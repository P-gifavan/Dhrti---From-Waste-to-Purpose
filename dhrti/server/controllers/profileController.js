const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.fullName = req.body.fullName || user.fullName;
    user.companyName = req.body.companyName || user.companyName;
    user.city = req.body.city || user.city;
    user.state = req.body.state || user.state;
    user.contactNumber = req.body.contactNumber || user.contactNumber;
    user.gstNumber = req.body.gstNumber || user.gstNumber;
    user.procurementPreferences = req.body.procurementPreferences || user.procurementPreferences;

    const updatedUser = await user.save();
    
    const userWithoutPassword = updatedUser.toObject();
    delete userWithoutPassword.passwordHash;

    res.json({ success: true, data: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Upload verification documents
// @route   POST /api/profile/upload-verification
// @access  Private
const uploadVerificationDocuments = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const fileUrls = req.files.map(file => `/uploads/verifications/${file.filename}`);

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.verificationDocuments = [...user.verificationDocuments, ...fileUrls];
    user.verificationStatus = 'pending'; // Reset to pending if they upload new docs
    
    await user.save();

    res.json({ success: true, message: 'Documents uploaded successfully', verificationDocuments: user.verificationDocuments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get public supplier profile
// @route   GET /api/profile/supplier/:id
// @access  Public
const getPublicSupplierProfile = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: 'supplier' }).select('-passwordHash -savedListings -verificationDocuments -email -contactNumber');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }
    // Only return contact details if user is verified, or maybe keep them hidden unless ordered
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadVerificationDocuments,
  getPublicSupplierProfile
};
