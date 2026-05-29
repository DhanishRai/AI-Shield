const express = require('express');
const router = express.Router();
const { scanQR } = require('../controllers/scanController');
const { body } = require('express-validator');

router.post('/', [
  body('upiId').notEmpty().withMessage('UPI ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
], scanQR);

module.exports = router;
