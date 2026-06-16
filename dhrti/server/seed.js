require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const { hashPassword } = require('./utils/bcrypt');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding');

    // Clear existing users to prevent duplicate key errors during seeding
    await User.deleteMany();

    // Hash passwords
    const passwordHash = await hashPassword('demo1234');

    const users = [
      {
        email: 'supplier@demo.dhrti.local',
        passwordHash,
        fullName: 'Demo Supplier',
        role: 'supplier',
        companyName: 'Supplier Co',
        city: 'Mumbai',
        state: 'Maharashtra',
      },
      {
        email: 'buyer@demo.dhrti.local',
        passwordHash,
        fullName: 'Demo Buyer',
        role: 'buyer',
        companyName: 'Buyer Inc',
        city: 'Delhi',
        state: 'Delhi',
      },
    ];

    await User.insertMany(users);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
