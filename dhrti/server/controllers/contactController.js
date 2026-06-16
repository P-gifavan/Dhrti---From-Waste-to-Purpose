const ContactMessage = require('../models/ContactMessage');

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
const submitContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      message,
    });

    res.status(201).json({
      success: true,
      data: contactMessage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  submitContactMessage,
};
