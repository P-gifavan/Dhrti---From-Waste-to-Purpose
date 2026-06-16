const Listing = require('../models/Listing');

// @desc    Get all listings for logged in supplier
// @route   GET /api/seller/listings
// @access  Private/Supplier
const getSellerListings = async (req, res) => {
  try {
    const listings = await Listing.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create a listing
// @route   POST /api/seller/listings
// @access  Private/Supplier
const createSellerListing = async (req, res) => {
  try {
    const listing = await Listing.create({
      ...req.body,
      sellerId: req.user._id,
    });
    res.status(201).json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update a listing
// @route   PUT /api/seller/listings/:id
// @access  Private/Supplier
const updateSellerListing = async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    if (listing.sellerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    listing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete a listing
// @route   DELETE /api/seller/listings/:id
// @access  Private/Supplier
const deleteSellerListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });
    if (listing.sellerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    await listing.deleteOne();
    res.json({ success: true, message: 'Listing removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getSellerListings,
  createSellerListing,
  updateSellerListing,
  deleteSellerListing,
};
