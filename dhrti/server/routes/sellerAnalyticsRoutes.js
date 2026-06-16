const express = require('express');
const router = express.Router();
const { getSellerAnalytics } = require('../controllers/sellerAnalyticsController');
const { protect, supplierOnly } = require('../middleware/authMiddleware');

router.get('/', protect, supplierOnly, getSellerAnalytics);

module.exports = router;
