
const axios = require('axios');
const User = require('../models/User');
const ChatSession = require('../models/ChatSession');

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';


const sendMessage = async (req, res) => {
  try {
    const { message, topic, history, apiKey } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

  
    const geminiKey = apiKey || process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return res.status(400).json({ message: 'Gemini API key not configured' });
    }

    const user = req.user;
    const currentTopic = topic || 'general career advice';

    const systemPrompt = `You are careerBnao Ai, an expert career counselor with 20+ years of experience helping professionals at all levels. You specialize in ${currentTopic}.

The user's name is ${user.name} and their career stage is "${user.careerStage || 'not specified'}".

Guidelines:
- Give practical, actionable, and personalized advice
- Be warm, encouraging, and professional
- Use structured responses with bullet points when listing steps
- Focus specifically on ${currentTopic}
- Keep responses concise but comprehensive (under 400 words)
- Use relevant emojis sparingly to add warmth
- Always end with an encouraging note or follow-up question`;

  
    const contents = [
      { role: 'user',  parts: [{ text: `[System]: ${systemPrompt}` }] },
      { role: 'model', parts: [{ text: 'Understood! I am CareerMind AI. How can I help you today?' }] },
      ...(history || []),
      { role: 'user',  parts: [{ text: message }] },
    ];

    const response = await axios.post(
      `${GEMINI_URL}?key=${geminiKey}`,
      {
        contents,
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.8,
        },
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const aiText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'I apologize, I could not generate a response. Please try again.';

    // Save conversation to database
    let session = await ChatSession.findOne({ user: user._id, topic: currentTopic });
    if (!session) {
      session = new ChatSession({ user: user._id, topic: currentTopic, messages: [] });
    }

    session.messages.push({ role: 'user', text: message, topic: currentTopic });
    session.messages.push({ role: 'model', text: aiText, topic: currentTopic });

    // Keep only last 50 messages per session
    if (session.messages.length > 50) {
      session.messages = session.messages.slice(-50);
    }

    await session.save();

    res.json({ reply: aiText });
  } catch (err) {
    console.error('Chat error:', err?.response?.data || err.message);

    if (err?.response?.status === 400) {
      return res.status(400).json({ message: 'Invalid Gemini API key or bad request' });
    }
    if (err?.response?.status === 429) {
      return res.status(429).json({ message: 'Gemini API rate limit reached. Please wait a moment.' });
    }

    res.status(500).json({ message: 'Failed to get AI response. Please try again.' });
  }
};

const getChatHistory = async (req, res) => {
  try {
    const topic = req.params.topic || 'general career advice';
    const session = await ChatSession.findOne({ user: req.user._id, topic });

    if (!session) {
      return res.json({ messages: [] });
    }

    res.json({ messages: session.messages });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load chat history' });
  }
};

const clearHistory = async (req, res) => {
  try {
    const topic = req.params.topic;
    await ChatSession.findOneAndDelete({ user: req.user._id, topic });
    res.json({ message: 'Chat history cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear history' });
  }
};

module.exports = { sendMessage, getChatHistory, clearHistory };