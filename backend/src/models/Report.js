const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  qrId: {
    type: String
  },
  upiId: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);
