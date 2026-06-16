const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { generateToken } = require('../utils/jwt');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, role, companyName, city, state } = req.body;

    // Validate role
    if (!['buyer', 'supplier'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await User.create({
      fullName,
      email,
      passwordHash,
      role,
      companyName,
      city,
      state,
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          companyName: user.companyName,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await comparePassword(password, user.passwordHash))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          companyName: user.companyName,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');

    if (user) {
      res.json({
        success: true,
        data: user,
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Authenticate/Register user with Google
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  try {
    const { credential, role } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not exists
      // Require role if creating a new user from google
      if (!role || !['buyer', 'supplier'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Role is required for new Google signups' });
      }

      user = await User.create({
        fullName: name,
        email,
        authProvider: 'google',
        googleId: sub,
        role,
        companyName: `${name}'s Company`, // Default, user can update later
        companyLogo: picture,
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ success: false, message: 'Google Authentication Failed' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  googleLogin,
};
