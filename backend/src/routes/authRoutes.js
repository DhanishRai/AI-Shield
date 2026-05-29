const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const { body } = require('express-validator');

router.post('/login', [
  body('phone').notEmpty().withMessage('Phone number is required')
], login);

module.exports = router;
