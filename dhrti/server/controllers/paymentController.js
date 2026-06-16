const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_dummy',
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private (Buyer)
const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.buyerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Order is already paid' });
    }

    if (order.orderStatus !== 'accepted') {
      return res.status(400).json({ success: false, message: 'Order must be accepted by supplier before payment' });
    }

    // Amount must be in paise for INR
    const options = {
      amount: Math.round(order.totalAmount * 100),
      currency: 'INR',
      receipt: `receipt_order_${order._id}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Private (Buyer)
const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret_dummy')
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpaySignature;

    if (!isAuthentic) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Update order status
    order.paymentStatus = 'paid';
    order.paymentId = razorpayPaymentId;
    // We can also advance the order status
    order.orderStatus = 'paid';
    await order.save();

    res.status(200).json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Razorpay Verify Error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};
