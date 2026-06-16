const express = require('express');
const router = express.Router();
const { getListings, createListing } = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getListings)
  .post(protect, createListing);

module.exports = router;
