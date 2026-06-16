const express = require('express');
const router = express.Router();
const { createPaymentOrder, verifyPayment } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/create-order', protect, authorize('buyer'), createPaymentOrder);
router.post('/verify', protect, authorize('buyer'), verifyPayment);

module.exports = router;
