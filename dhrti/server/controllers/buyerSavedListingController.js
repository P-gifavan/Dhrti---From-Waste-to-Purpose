const User = require('../models/User');

// @desc    Get saved listings
// @route   GET /api/buyer/saved-listings
// @access  Private/Buyer
const getSavedListings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedListings',
      select: 'title wasteCategory quantityKg pricePerKg city state status condition description'
    });
    res.json({ success: true, data: user.savedListings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Save a listing
// @route   POST /api/buyer/saved-listings
// @access  Private/Buyer
const saveListing = async (req, res) => {
  try {
    const { listingId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.savedListings.includes(listingId)) {
      user.savedListings.push(listingId);
      await user.save();
    }
    
    res.json({ success: true, message: 'Listing saved' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Remove a saved listing
// @route   DELETE /api/buyer/saved-listings/:id
// @access  Private/Buyer
const removeSavedListing = async (req, res) => {
  try {
    const listingId = req.params.id;
    const user = await User.findById(req.user._id);

    user.savedListings = user.savedListings.filter(id => id.toString() !== listingId);
    await user.save();

    res.json({ success: true, message: 'Listing removed from saved' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getSavedListings,
  saveListing,
  removeSavedListing
};
