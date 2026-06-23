const User = require('../models/User');
const Listing = require('../models/Listing');
const Order = require('../models/Order');
const Review = require('../models/Review');
const { createNotification } = require('./notificationController');

// --- USERS ---
const getUsers = async (req, res) => {
  try {
    const { search, role, status } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.role = role;
    if (status) query.verificationStatus = status;

    const users = await User.find(query).select('-passwordHash').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await user.deleteOne();
    res.json({ success: true, message: 'User removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = false;
    await user.save();
    res.json({ success: true, message: 'User suspended' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const activateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = true;
    await user.save();
    res.json({ success: true, message: 'User activated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// --- VERIFICATIONS ---
const getVerifications = async (req, res) => {
  try {
    const users = await User.find({ verificationStatus: { $in: ['pending', 'verified', 'rejected'] } })
      .select('fullName email companyName verificationStatus verificationDocuments verificationHistory role')
      .sort({ updatedAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const updateVerificationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    if (!['pending', 'verified', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.verificationStatus = status;
    user.verificationHistory.push({ status, notes: notes || `Verification ${status} by admin` });
    await user.save();

    // Notify the user
    await createNotification(
      user._id,
      `Verification ${status === 'verified' ? 'Approved' : 'Rejected'}`,
      `Your business verification status is now ${status}. ${notes || ''}`,
      status === 'verified' ? 'verification_approved' : 'verification_rejected',
      `/${user.role}/profile`
    );

    res.json({ success: true, message: `Verification status updated to ${status}`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// --- LISTINGS ---
const getListings = async (req, res) => {
  try {
    const listings = await Listing.find({}).populate('sellerId', 'companyName fullName').sort({ createdAt: -1 });
    res.json({ success: true, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const suspendListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    listing.status = 'draft'; // Reusing 'draft' to hide from marketplace
    await listing.save();
    res.json({ success: true, message: 'Listing suspended' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    await listing.deleteOne();
    res.json({ success: true, message: 'Listing removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// --- ORDERS ---
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('buyerId', 'companyName fullName')
      .populate('sellerId', 'companyName fullName')
      .populate('listingId', 'title')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.orderStatus = status;
    await order.save();
    res.json({ success: true, message: `Order status updated to ${status}`, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// --- PAYMENTS ---
const getPayments = async (req, res) => {
  try {
    const payments = await Order.find({ paymentId: { $exists: true, $ne: null } })
      .populate('buyerId', 'companyName')
      .select('paymentId paymentStatus totalAmount createdAt')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// --- REVIEWS ---
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate('reviewerId', 'companyName fullName')
      .populate('reviewTargetId', 'companyName fullName')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    await review.deleteOne();
    res.json({ success: true, message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// --- ANALYTICS ---
const getAnalytics = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    
    // Total Revenue (sum of totalAmount for paid orders)
    const paidOrders = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const revenue = paidOrders.length > 0 ? paidOrders[0].totalRevenue : 0;

    // Total Waste Traded (sum of quantityKg for completed/paid orders)
    const tradedWaste = await Order.aggregate([
      { $match: { orderStatus: { $in: ['paid', 'processing', 'shipped', 'completed'] } } },
      { $group: { _id: null, totalWaste: { $sum: '$quantityKg' } } }
    ]);
    const wasteTraded = tradedWaste.length > 0 ? tradedWaste[0].totalWaste : 0;

    res.json({
      success: true,
      data: {
        userCount,
        revenue,
        wasteTraded,
        categoryTrends: [] // To be implemented with listing data if needed
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getUsers, deleteUser, suspendUser, activateUser,
  getVerifications, updateVerificationStatus,
  getListings, suspendListing, deleteListing,
  getOrders, updateOrderStatus,
  getPayments,
  getReviews, deleteReview,
  getAnalytics
};
