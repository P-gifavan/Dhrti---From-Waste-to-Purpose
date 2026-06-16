const Order = require('../models/Order');
const Listing = require('../models/Listing');

// @desc    Get all requests created by the buyer
// @route   GET /api/buyer/requests
// @access  Private/Buyer
const getBuyerRequests = async (req, res) => {
  try {
    const requests = await Order.find({ buyerId: req.user._id })
      .populate('listingId', 'title wasteCategory pricePerKg')
      .populate('sellerId', 'fullName companyName city state contactNumber')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create a new request
// @route   POST /api/buyer/requests
// @access  Private/Buyer
const createBuyerRequest = async (req, res) => {
  try {
    const { listingId, quantityKg, shippingAddress } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    
    // Calculate total price
    const totalPrice = quantityKg * listing.pricePerKg;

    const request = await Order.create({
      listingId,
      buyerId: req.user._id,
      sellerId: listing.sellerId,
      quantityKg,
      totalPrice,
      shippingAddress,
      status: 'pending'
    });

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete a pending request
// @route   DELETE /api/buyer/requests/:id
// @access  Private/Buyer
const deleteBuyerRequest = async (req, res) => {
  try {
    const request = await Order.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    
    if (request.buyerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending requests can be deleted' });
    }

    await request.deleteOne();
    res.json({ success: true, message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getBuyerRequests,
  createBuyerRequest,
  deleteBuyerRequest
};
