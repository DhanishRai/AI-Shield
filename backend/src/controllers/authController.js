const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Login / Register user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { phone, name } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ phone });

    // If not, create user (acting as a simple login/register for hackathon)
    if (!user) {
      user = await User.create({
        phone,
        name: name || 'User'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login
};
