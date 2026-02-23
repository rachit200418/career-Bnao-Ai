
const User = require('../models/User');

const saveApiKey = async (req, res) => {
  try {
    const { geminiApiKey } = req.body;
    await User.findByIdAndUpdate(req.user._id, { geminiApiKey });
    res.json({ message: 'API key saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save API key' });
  }
};

const getApiKey = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+geminiApiKey');
    res.json({ geminiApiKey: user.geminiApiKey || '' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get API key' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, careerStage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, careerStage },
      { new: true, runValidators: true }
    );
    res.json({
      message: 'Profile updated',
      user: { id: user._id, name: user.name, email: user.email, careerStage: user.careerStage },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

module.exports = { saveApiKey, getApiKey, updateProfile };
