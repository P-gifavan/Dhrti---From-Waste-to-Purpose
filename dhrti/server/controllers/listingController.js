const Listing = require('../models/Listing');

// @desc    Get all listings (with search, filter, pagination)
// @route   GET /api/listings
// @access  Public
const getListings = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const query = { status: 'active' };

    // Search
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { city: searchRegex },
        { state: searchRegex },
      ];
    }

    // Filter by wasteCategory
    if (req.query.wasteCategory) {
      query.wasteCategory = req.query.wasteCategory;
    }

    // Filter by condition
    if (req.query.condition) {
      query.condition = req.query.condition;
    }

    // Filter by location
    if (req.query.city) {
      query.city = new RegExp(req.query.city, 'i');
    }
    if (req.query.state) {
      query.state = new RegExp(req.query.state, 'i');
    }

    // Filter by quantity
    if (req.query.minQuantity || req.query.maxQuantity) {
      query.quantityKg = {};
      if (req.query.minQuantity) query.quantityKg.$gte = Number(req.query.minQuantity);
      if (req.query.maxQuantity) query.quantityKg.$lte = Number(req.query.maxQuantity);
    }

    const total = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .populate('sellerId', 'companyName fullName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: listings,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create a new listing
// @route   POST /api/listings
// @access  Private (Supplier only)
const createListing = async (req, res) => {
  try {
    if (req.user.role !== 'supplier') {
      return res.status(403).json({ success: false, message: 'Only suppliers can create listings' });
    }

    const {
      title,
      wasteCategory,
      description,
      quantityKg,
      pricePerKg,
      city,
      state,
      condition,
      status,
    } = req.body;

    const listing = await Listing.create({
      sellerId: req.user._id,
      title,
      wasteCategory,
      description,
      quantityKg,
      pricePerKg,
      city,
      state,
      condition,
      status: status || 'active',
    });

    res.status(201).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getListings,
  createListing,
};
