const express = require('express');
const router = express.Router();
const { createReview, getTargetReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createReview);

router.route('/target/:targetId')
  .get(getTargetReviews);

module.exports = router;
