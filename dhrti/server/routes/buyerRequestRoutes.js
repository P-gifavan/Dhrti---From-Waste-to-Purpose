const express = require('express');
const router = express.Router();
const { getBuyerRequests, createBuyerRequest, deleteBuyerRequest } = require('../controllers/buyerRequestController');
const { protect, buyerOnly } = require('../middleware/authMiddleware');

router.use(protect, buyerOnly);

router.route('/')
  .get(getBuyerRequests)
  .post(createBuyerRequest);

router.route('/:id')
  .delete(deleteBuyerRequest);

module.exports = router;
