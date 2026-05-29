const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  upiId: {
    type: String,
    required: true
  },
  merchantName: {
    type: String,
    default: 'Unknown Merchant'
  },
  amount: {
    type: Number,
    required: true
  },
  riskScore: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['SAFE', 'SUSPICIOUS', 'HIGH_RISK'],
    required: true
  },
  reason: {
    type: [String],
    default: []
  },
  confidence: {
    type: Number,
    default: 0
  },
  scannedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('History', historySchema);
