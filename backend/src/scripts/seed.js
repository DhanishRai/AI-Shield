const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../src/models/User');
const Blacklist = require('../src/models/Blacklist');

// Load environment variables from the backend root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fraud-shield';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Connected for Seeding...');

    // Clear existing data for a fresh start
    await User.deleteMany();
    await Blacklist.deleteMany();

    // 1. Create a mock user
    const user = await User.create({
      name: 'Demo Tester',
      phone: '9999999999'
    });
    console.log(`✅ Created Mock User: ${user._id}`);

    // 2. Create mock blacklist data
    await Blacklist.insertMany([
      { upiId: 'scammer@ybl', riskLevel: 'HIGH RISK', reportsCount: 5 },
      { upiId: 'fake-lottery@okicici', riskLevel: 'HIGH RISK', reportsCount: 12 },
      { upiId: 'shady-shop@paytm', riskLevel: 'SUSPICIOUS', reportsCount: 2 }
    ]);
    console.log('✅ Populated Mock Blacklist Entries');

    console.log('\n🚀 Database Seeding Completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
