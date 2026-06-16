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

module.exports = {
  getProfile,
  updateProfile,
};
