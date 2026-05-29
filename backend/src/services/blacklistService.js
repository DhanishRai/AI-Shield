const Blacklist = require('../models/Blacklist');

const mongoose = require('mongoose');

/**
 * Helper to check if a UPI ID is blacklisted
 * @param {string} upiId 
 * @returns {Object|null} Blacklist record if found, else null
 */
const checkBlacklist = async (upiId) => {
  try {
    if (mongoose.connection.readyState !== 1) return null;
    const entry = await Blacklist.findOne({ upiId });
    return entry;
  } catch (error) {
    console.error('Error checking blacklist:', error.message);
    throw new Error('Failed to check blacklist status');
  }
};

module.exports = {
  checkBlacklist
};
