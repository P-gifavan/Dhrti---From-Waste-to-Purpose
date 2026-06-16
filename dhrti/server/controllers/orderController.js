const Order = require('../models/Order');
const Listing = require('../models/Listing');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Buyer)
const createOrder = async (req, res) => {
  try {
    const { listingId, quantityKg, shippingAddress } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    const minOrderQuantity = 1; // Default min order quantity since it's not in schema
    if (quantityKg < minOrderQuantity) {
      return res.status(400).json({ success: false, message: `Minimum order quantity is ${minOrderQuantity}kg` });
    }

    if (quantityKg > listing.quantityKg) {
      return res.status(400).json({ success: false, message: `Only ${listing.quantityKg}kg available` });
    }

    const unitPrice = listing.pricePerKg;
    const totalAmount = unitPrice * quantityKg;

    const order = await Order.create({
      listingId,
      buyerId: req.user._id,
      sellerId: listing.sellerId,
      quantityKg,
      unitPrice,
      totalAmount,
      shippingAddress,
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get buyer orders
// @route   GET /api/orders/buyer
// @access  Private (Buyer)
const getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user._id })
      .populate('listingId', 'title category images')
      .populate('sellerId', 'companyName')
      .sort('-createdAt');
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get supplier orders
// @route   GET /api/orders/supplier
// @access  Private (Supplier)
const getSupplierOrders = async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.user._id })
      .populate('listingId', 'title category')
      .populate('buyerId', 'companyName fullName email contactNumber')
      .sort('-createdAt');
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify ownership/role
    if (req.user.role === 'supplier' && order.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (req.user.role === 'buyer' && order.buyerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const validSupplierTransitions = {
      'pending': ['accepted', 'rejected'],
      'paid': ['processing'],
      'processing': ['shipped'],
      'shipped': ['completed']
    };

    const validBuyerTransitions = {
      'pending': ['cancelled']
    };

    let isValid = false;

    if (req.user.role === 'supplier') {
      const allowed = validSupplierTransitions[order.orderStatus] || [];
      if (allowed.includes(status)) isValid = true;
    } else if (req.user.role === 'buyer') {
      const allowed = validBuyerTransitions[order.orderStatus] || [];
      if (allowed.includes(status)) isValid = true;
    }

    if (!isValid) {
      return res.status(400).json({ success: false, message: `Cannot change status from ${order.orderStatus} to ${status}` });
    }

    order.orderStatus = status;

    // If accepted, we might want to reserve inventory, but let's just decrease it on completion or acceptance.
    // For now, let's keep it simple.

    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  createOrder,
  getBuyerOrders,
  getSupplierOrders,
  updateOrderStatus,
};
