const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    console.log('📍 Attempting to connect to:', mongoURI ? mongoURI.substring(0, 50) + '...' : 'NO URI FOUND');
    
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;