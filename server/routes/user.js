
const express = require('express');
const router = express.Router();
const { saveApiKey, getApiKey, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.put('/apikey', protect, saveApiKey);
router.get('/apikey', protect, getApiKey);
router.put('/profile', protect, updateProfile);

module.exports = router;
