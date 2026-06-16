const Listing = require('../models/Listing');

// @desc    Get analytics for supplier
// @route   GET /api/seller/analytics
// @access  Private/Supplier
const getSellerAnalytics = async (req, res) => {
  try {
    const sellerId = req.user._id;

    const listings = await Listing.find({ sellerId });

    // Aggregate by category
    const categoryCount = {};
    const categoryQuantity = {};
    const statusDistribution = { active: 0, draft: 0, sold: 0 };
    
    let totalQuantity = 0;

    listings.forEach((listing) => {
      // Category counts
      categoryCount[listing.wasteCategory] = (categoryCount[listing.wasteCategory] || 0) + 1;
      
      // Category quantities
      categoryQuantity[listing.wasteCategory] = (categoryQuantity[listing.wasteCategory] || 0) + listing.quantityKg;
      totalQuantity += listing.quantityKg;
      
      // Status
      if (listing.status in statusDistribution) {
        statusDistribution[listing.status]++;
      }
    });

    // Formatting for Recharts
    const listingsByCategory = Object.keys(categoryCount).map(key => ({
      name: key.replace('_', ' '),
      value: categoryCount[key]
    }));

    const quantityByCategory = Object.keys(categoryQuantity).map(key => ({
      name: key.replace('_', ' '),
      value: categoryQuantity[key]
    }));

    const statusData = Object.keys(statusDistribution).map(key => ({
      name: key,
      value: statusDistribution[key]
    }));

    res.json({
      success: true,
      data: {
        totalListings: listings.length,
        totalQuantity,
        listingsByCategory,
        quantityByCategory,
        statusData,
        summary: {
          active: statusDistribution.active,
          draft: statusDistribution.draft,
          sold: statusDistribution.sold,
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = { getSellerAnalytics };
