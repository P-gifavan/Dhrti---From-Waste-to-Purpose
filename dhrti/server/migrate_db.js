require('dotenv').config();
const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({},{ strict: false });
const Listing = mongoose.model('ListingMigration', listingSchema, 'listings');

async function migrateDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB for migration');
    
    const docs = await Listing.find({ wasteCategory: { $exists: false } });
    console.log(`Found ${docs.length} documents needing migration`);

    for (const doc of docs) {
      const data = doc.toObject();
      const update = {
        $set: {
          wasteCategory: 'recyclable_plastic', // mapping old plastic_type (PET, PVC) to standard 'recyclable_plastic'
          quantityKg: data.quantity_kg || 0,
          pricePerKg: data.price_per_kg || 0,
        },
        $unset: {
          plastic_type: "",
          quantity_kg: "",
          price_per_kg: "",
          location: "",
          image_url: ""
        }
      };

      await Listing.updateOne({ _id: doc._id }, update);
      console.log(`Migrated doc ${doc._id}`);
    }

    console.log('Migration complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrateDB();
