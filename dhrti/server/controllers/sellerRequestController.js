const Order = require('../models/Order');

// @desc    Get requests received by supplier
// @route   GET /api/seller/requests
// @access  Private/Supplier
const getSellerRequests = async (req, res) => {
  try {
    const requests = await Order.find({ sellerId: req.user._id })
      .populate('listingId', 'title wasteCategory quantityKg pricePerKg')
      .populate('buyerId', 'fullName companyName city state')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update request status
// @route   PUT /api/seller/requests/:id
// @access  Private/Supplier
const updateSellerRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let request = await Order.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    if (request.sellerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    request.status = status;
    await request.save();
    
    // Populate before sending back
    const updatedRequest = await Order.findById(req.params.id)
      .populate('listingId', 'title wasteCategory quantityKg pricePerKg')
      .populate('buyerId', 'fullName companyName city state');
      
    res.json({ success: true, data: updatedRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getSellerRequests,
  updateSellerRequestStatus,
};
