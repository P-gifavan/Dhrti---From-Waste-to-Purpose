const User = require('../models/User');

// @desc    Upload verification documents
// @route   POST /api/verifications/upload
// @access  Private
const uploadDocuments = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No documents uploaded' });
    }

    const documentPaths = req.files.map(file => `/uploads/verifications/${file.filename}`);

    user.verificationDocuments = [...user.verificationDocuments, ...documentPaths];
    user.verificationStatus = 'pending';
    user.verificationHistory.push({
      status: 'pending',
      notes: 'Documents uploaded for review',
    });

    await user.save();

    res.json({
      success: true,
      message: 'Documents uploaded successfully',
      verificationStatus: user.verificationStatus,
      verificationDocuments: user.verificationDocuments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get user verification status and history
// @route   GET /api/verifications/status
// @access  Private
const getVerificationStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('verificationStatus verificationDocuments verificationHistory');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      verificationStatus: user.verificationStatus,
      verificationDocuments: user.verificationDocuments,
      verificationHistory: user.verificationHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  uploadDocuments,
  getVerificationStatus,
};
