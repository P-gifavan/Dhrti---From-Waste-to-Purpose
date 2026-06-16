const express = require('express');
const router = express.Router();
const {
  createOrder,
  getBuyerOrders,
  getSupplierOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('buyer'), createOrder);
router.get('/buyer', protect, authorize('buyer'), getBuyerOrders);
router.get('/supplier', protect, authorize('supplier'), getSupplierOrders);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;
