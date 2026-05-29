const { validationResult } = require('express-validator');
const { processScan } = require('../services/scanService');

// @desc    Scan QR and analyze risk
// @route   POST /api/scan
// @access  Public
const scanQR = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Provide a default userId if not sent (hackathon simplicity)
    const scanData = {
      ...req.body,
      userId: req.body.userId || 'demo-user',
    };

    const result = await processScan(scanData);
    res.status(200).json(result);
  } catch (error) {
    // Return a user-friendly error instead of crashing
    res.status(503).json({
      error: error.message || 'Server error during scan analysis',
      status: 'ERROR'
    });
  }
};

module.exports = {
  scanQR
};
