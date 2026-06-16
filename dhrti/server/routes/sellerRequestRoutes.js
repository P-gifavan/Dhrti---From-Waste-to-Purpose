const express = require('express');
const router = express.Router();
const { getSellerRequests, updateSellerRequestStatus } = require('../controllers/sellerRequestController');
const { protect, supplierOnly } = require('../middleware/authMiddleware');

router.use(protect, supplierOnly);

router.route('/')
  .get(getSellerRequests);

router.route('/:id')
  .put(updateSellerRequestStatus);

module.exports = router;
