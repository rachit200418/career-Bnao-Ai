
const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory, clearHistory } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.post('/message', protect, sendMessage);
router.get('/history/:topic', protect, getChatHistory);
router.delete('/history/:topic', protect, clearHistory);

module.exports = router;
