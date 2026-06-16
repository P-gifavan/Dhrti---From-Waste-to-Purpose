const Order = require('../models/Order');

// @desc    Get analytics for buyer
// @route   GET /api/buyer/analytics
// @access  Private/Buyer
const getBuyerAnalytics = async (req, res) => {
  try {
    const buyerId = req.user._id;

    // We populate the listingId to get the wasteCategory
    const requests = await Order.find({ buyerId }).populate('listingId', 'wasteCategory');

    const categoryCount = {};
    const categoryQuantity = {};
    const statusDistribution = { pending: 0, accepted: 0, rejected: 0, completed: 0 };
    
    let totalRequests = requests.length;

    requests.forEach((req) => {
      const category = req.listingId?.wasteCategory || 'unknown';
      
      // Category counts
      categoryCount[category] = (categoryCount[category] || 0) + 1;
      
      // Category quantities
      categoryQuantity[category] = (categoryQuantity[category] || 0) + req.quantityKg;
      
      // Status
      if (req.status in statusDistribution) {
        statusDistribution[req.status]++;
      }
    });

    // Formatting for Recharts
    const requestsByCategory = Object.keys(categoryCount).map(key => ({
      name: key.replace('_', ' '),
      value: categoryCount[key]
    })).filter(x => x.name !== 'unknown');

    const quantityByCategory = Object.keys(categoryQuantity).map(key => ({
      name: key.replace('_', ' '),
      value: categoryQuantity[key]
    })).filter(x => x.name !== 'unknown');

    const statusData = Object.keys(statusDistribution).map(key => ({
      name: key,
      value: statusDistribution[key]
    }));

    res.json({
      success: true,
      data: {
        totalRequests,
        requestsByCategory,
        quantityByCategory,
        statusData,
        summary: statusDistribution
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = { getBuyerAnalytics };
