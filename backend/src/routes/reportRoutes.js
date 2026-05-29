const express = require('express');
const router = express.Router();
const { reportSuspicious } = require('../controllers/reportController');
const { body } = require('express-validator');

router.post('/', [
  body('upiId').notEmpty().withMessage('UPI ID is required'),
  body('reason').notEmpty().withMessage('Reason is required')
], reportSuspicious);

module.exports = router;
