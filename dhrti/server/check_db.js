require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('./models/Listing');

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    const missing = await Listing.find({ wasteCategory: { $exists: false } });
    console.log(`Listings missing wasteCategory: ${missing.length}`);
    if (missing.length > 0) {
      console.log('Missing docs:', missing);
    }

    const invalid = await Listing.find({ wasteCategory: { $nin: ['recyclable_plastic', 'paper', 'metal'] } });
    console.log(`Listings with invalid wasteCategory: ${invalid.length}`);
    if (invalid.length > 0) {
      console.log('Invalid docs:', invalid);
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkDB();
