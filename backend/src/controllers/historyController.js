const History = require('../models/History');
const mongoose = require('mongoose');

// @desc    Get scan history for a user
// @route   GET /api/history/:userId
// @access  Public
const getUserHistory = async (req, res, next) => {
  const { userId } = req.params;

  try {
    // If MongoDB is not connected, return mock data instantly
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: 2,
        data: [
          {
            _id: 'mock1',
            userId: userId,
            upiId: 'test@upi',
            merchantName: 'Unknown User',
            amount: 5000,
            riskScore: 85,
            riskLevel: 'HIGH',
            scannedAt: new Date()
          },
          {
            _id: 'mock2',
            userId: userId,
            upiId: 'amazon@pay',
            merchantName: 'Amazon India',
            amount: 1299,
            riskScore: 10,
            riskLevel: 'SAFE',
            scannedAt: new Date(Date.now() - 86400000)
          }
        ]
      });
    }

    const history = await History.find({ userId }).sort({ scannedAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserHistory
};
