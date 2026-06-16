const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: false, // Optional for Google OAuth users
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    googleId: {
      type: String,
    },
    fullName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['buyer', 'supplier', 'admin'],
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    companyLogo: {
      type: String,
    },
    companyDescription: {
      type: String,
    },
    website: {
      type: String,
    },
    city: {
      type: String,
      required: false, // Make optional for easy google signup
    },
    state: {
      type: String,
      required: false,
    },
    savedListings: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
    }],
    procurementPreferences: {
      type: String,
    },
    monthlyDemand: {
      type: String,
    },
    preferredWasteCategories: [{
      type: String,
    }],
    factoryLocations: [{
      type: String,
    }],
    contactNumber: {
      type: String,
    },
    gstNumber: {
      type: String,
    },
    panNumber: {
      type: String,
    },
    pickupLocations: [{
      type: String,
    }],
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    verificationDocuments: [{
      type: String, // URLs or paths
    }],
  },
  {
    timestamps: true,
  }
);

userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;
