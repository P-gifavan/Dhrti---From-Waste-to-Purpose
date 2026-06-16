const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    wasteCategory: {
      type: String,
      enum: ['recyclable_plastic', 'paper', 'metal'],
      required: true,
    },
    description: {
      type: String,
    },
    quantityKg: {
      type: Number,
      required: true,
    },
    pricePerKg: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'sold'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

listingSchema.index({ sellerId: 1 });
listingSchema.index({ status: 1 });
listingSchema.index({ wasteCategory: 1 });
listingSchema.index({ city: 1, state: 1 });

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
