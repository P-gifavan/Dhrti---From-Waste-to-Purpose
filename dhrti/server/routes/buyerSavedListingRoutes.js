const express = require('express');
const router = express.Router();
const { getSavedListings, saveListing, removeSavedListing } = require('../controllers/buyerSavedListingController');
const { protect, buyerOnly } = require('../middleware/authMiddleware');

router.use(protect, buyerOnly);

router.route('/')
  .get(getSavedListings)
  .post(saveListing);

router.route('/:id')
  .delete(removeSavedListing);

module.exports = router;
