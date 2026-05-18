const express = require('express');
const router = express.Router();
const { generateRecommendations } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/recommend', protect, generateRecommendations);

module.exports = router;
