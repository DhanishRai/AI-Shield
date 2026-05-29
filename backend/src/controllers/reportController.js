const Report = require('../models/Report');
const Blacklist = require('../models/Blacklist');
const { validationResult } = require('express-validator');

// @desc    Report suspicious QR/UPI
// @route   POST /api/report
// @access  Public
const reportSuspicious = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { qrId, upiId, reason, reportedBy } = req.body;

  try {
    // 1. Create the report
    const report = await Report.create({
      qrId,
      upiId,
      reason,
      reportedBy
    });

    // 2. Update Blacklist logic (mock)
    let blacklistEntry = await Blacklist.findOne({ upiId });
    if (blacklistEntry) {
      blacklistEntry.reportsCount += 1;
      if (blacklistEntry.reportsCount > 3) {
        blacklistEntry.riskLevel = 'HIGH RISK';
      }
      await blacklistEntry.save();
    } else {
      await Blacklist.create({
        upiId,
        riskLevel: 'SUSPICIOUS',
        reportsCount: 1
      });
    }

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  reportSuspicious
};
