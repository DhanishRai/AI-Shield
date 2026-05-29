const { analyzeScan } = require('./flaskService');
const mongoose = require('mongoose');

// Lazy-load models - they may fail if MongoDB is not available
let History, checkBlacklist;
try {
  History = require('../models/History');
  checkBlacklist = require('./blacklistService').checkBlacklist;
} catch (e) {
  console.warn('Model loading deferred:', e.message);
}

/**
 * Process a new QR scan
 * @param {Object} scanData - The scan details payload
 * @returns {Object} Final scan evaluation result
 */
const processScan = async (scanData) => {
  const { upiId, merchantName, amount, userId } = scanData;
  let reportsCount = 0;
  
  // 1. Check local Blacklist first (if DB available)
  try {
    if (checkBlacklist) {
      const blacklistEntry = await checkBlacklist(upiId);
      if (blacklistEntry) {
        if (blacklistEntry.riskLevel === 'HIGH RISK') {
          // Save to history if possible
          let historyId = null;
          try {
            if (History && mongoose.connection.readyState === 1) {
              const history = await History.create({
                userId, upiId, merchantName, amount,
                riskScore: 100, status: 'HIGH_RISK',
                reason: ['UPI ID is blacklisted']
              });
              historyId = history._id;
            }
          } catch (dbErr) {
            console.warn('History save failed:', dbErr.message);
          }

          return {
            risk_score: 100,
            status: 'HIGH_RISK',
            confidence: 0.99,
            reasons: ['UPI ID is blacklisted'],
            historyId
          };
        }
        reportsCount = blacklistEntry.reportsCount;
      }
    }
  } catch (err) {
    console.warn('Blacklist check skipped:', err.message);
  }

  // 2. Call Flask AI Microservice
  const flaskResponse = await analyzeScan({ 
    upiId, merchantName, amount, reportsCount,
    isNewPayee: true,
    hour: new Date().getHours()
  });
  
  // 3. Save scan history (if DB available)
  let historyId = null;
  try {
    if (History && mongoose.connection.readyState === 1) {
      const history = await History.create({
        userId, upiId, merchantName, amount,
        riskScore: flaskResponse.risk_score,
        status: flaskResponse.status,
        reason: flaskResponse.reasons || []
      });
      historyId = history._id;
    }
  } catch (dbErr) {
    console.warn('History save failed:', dbErr.message);
  }

  return {
    ...flaskResponse,
    historyId
  };
};

module.exports = {
  processScan
};
