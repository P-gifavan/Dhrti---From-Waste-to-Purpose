const express = require('express');
const router = express.Router();
const {
  getSellerListings,
  createSellerListing,
  updateSellerListing,
  deleteSellerListing,
} = require('../controllers/sellerListingController');
const { protect, supplierOnly } = require('../middleware/authMiddleware');

router.use(protect, supplierOnly);

router.route('/')
  .get(getSellerListings)
  .post(createSellerListing);

router.route('/:id')
  .put(updateSellerListing)
  .delete(deleteSellerListing);

module.exports = router;
