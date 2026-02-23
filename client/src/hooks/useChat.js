
import { useState, useCallback } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const useChat = (topic) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const { showToast } = useToast();


  const buildHistory = (msgs) =>
    msgs.map(m => ({ role: m.role, parts: [{ text: m.text }] }));

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isTyping) return;

    const apiKey = localStorage.getItem('cm_gemini_key') || '';

  
    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const { data } = await axios.post('/api/chat/message', {
        message: text,
        topic,
        apiKey,
        history: buildHistory(messages),
      });

      setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to get AI response. Please try again.';
      showToast(errMsg, 'error');
  
      setMessages(prev => [...prev, {
        role: 'model',
        text: `⚠️ ${errMsg}`,
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, topic, isTyping, showToast]);

  const clearMessages = useCallback(async () => {
    setMessages([]);
    try {
      await axios.delete(`/api/chat/history/${encodeURIComponent(topic)}`);
    } catch {
    
    }
  }, [topic]);

  return { messages, isTyping, sendMessage, clearMessages, setMessages };
};

export default useChat;
