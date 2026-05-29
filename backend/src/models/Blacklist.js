const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
  upiId: {
    type: String,
    required: true,
    unique: true
  },
  riskLevel: {
    type: String,
    enum: ['SUSPICIOUS', 'HIGH RISK'],
    default: 'SUSPICIOUS'
  },
  reportsCount: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Blacklist', blacklistSchema);
