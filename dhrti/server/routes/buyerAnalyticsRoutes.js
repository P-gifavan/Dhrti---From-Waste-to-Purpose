const express = require('express');
const router = express.Router();
const { getBuyerAnalytics } = require('../controllers/buyerAnalyticsController');
const { protect, buyerOnly } = require('../middleware/authMiddleware');

router.get('/', protect, buyerOnly, getBuyerAnalytics);

module.exports = router;
