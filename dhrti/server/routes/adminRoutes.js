const express = require('express');
const router = express.Router();
const { 
  getUsers, deleteUser, suspendUser, activateUser,
  getVerifications, updateVerificationStatus,
  getListings, suspendListing, deleteListing,
  getOrders, updateOrderStatus,
  getPayments,
  getReviews, deleteReview,
  getAnalytics
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Dashboard / Analytics
router.get('/analytics', protect, admin, getAnalytics);

// Users
router.get('/users', protect, admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/users/:id/suspend', protect, admin, suspendUser);
router.put('/users/:id/activate', protect, admin, activateUser);

// Verifications
router.get('/verifications', protect, admin, getVerifications);
router.put('/verifications/:id/approve', protect, admin, (req, res, next) => {
  req.body.status = 'verified';
  updateVerificationStatus(req, res, next);
});
router.put('/verifications/:id/reject', protect, admin, (req, res, next) => {
  req.body.status = 'rejected';
  updateVerificationStatus(req, res, next);
});

// Listings
router.get('/listings', protect, admin, getListings);
router.put('/listings/:id/suspend', protect, admin, suspendListing);
router.delete('/listings/:id', protect, admin, deleteListing);

// Orders
router.get('/orders', protect, admin, getOrders);
router.put('/orders/:id/status', protect, admin, updateOrderStatus);

// Payments
router.get('/payments', protect, admin, getPayments);

// Reviews
router.get('/reviews', protect, admin, getReviews);
router.delete('/reviews/:id', protect, admin, deleteReview);

module.exports = router;
