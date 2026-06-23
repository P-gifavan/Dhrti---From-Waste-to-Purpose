const Review = require('../models/Review');
const Order = require('../models/Order');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { orderId, reviewTargetId, rating, comment } = req.body;
    const reviewerId = req.user._id;

    // Check if order exists and belongs to the reviewer (either buyer or supplier)
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.buyerId.toString() !== reviewerId.toString() && order.sellerId.toString() !== reviewerId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to review this order' });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ orderId, reviewerId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this order' });
    }

    const review = await Review.create({
      reviewerId,
      reviewTargetId,
      orderId,
      rating,
      comment
    });

    // Notify the target user
    await createNotification(
      reviewTargetId,
      'New Review Received',
      `You received a ${rating}-star review.`,
      'review_received',
      `/${order.sellerId.toString() === reviewTargetId.toString() ? 'seller' : 'buyer'}/profile`
    );

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get reviews for a target user
// @route   GET /api/reviews/target/:targetId
// @access  Public
const getTargetReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewTargetId: req.params.targetId })
      .populate('reviewerId', 'fullName companyName companyLogo')
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? (reviews.reduce((acc, item) => item.rating + acc, 0) / totalReviews).toFixed(1)
      : 0;

    res.json({ 
      success: true, 
      data: {
        reviews,
        totalReviews,
        averageRating
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get a specific review
// @route   GET /api/reviews/:id
// @access  Public
const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('reviewerId', 'fullName companyName')
      .populate('reviewTargetId', 'fullName companyName');
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    let review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.reviewerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.reviewerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  createReview,
  getTargetReviews,
  getReview,
  updateReview,
  deleteReview
};
