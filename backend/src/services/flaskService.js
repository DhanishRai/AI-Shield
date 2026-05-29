const axios = require('axios');
const { FLASK_SERVICE_URL } = require('../config/env');

/**
 * Service to communicate with the Flask AI Microservice
 * Maps Node.js field names to Flask's expected snake_case format.
 * @param {Object} scanData 
 * @param {number} retries - Number of retry attempts
 * @param {number} timeout - Request timeout in milliseconds
 */
const analyzeScan = async (scanData, retries = 3, timeout = 5000) => {
  // Map from Node.js camelCase to Flask snake_case
  const payload = {
    upi_id: scanData.upiId,
    merchant_name: scanData.merchantName || 'Unknown',
    amount: parseFloat(scanData.amount) || 0,
    report_count: scanData.reportsCount || 0,
    is_new_payee: scanData.isNewPayee !== undefined ? scanData.isNewPayee : true,
    hour: scanData.hour || new Date().getHours(),
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(FLASK_SERVICE_URL, payload, {
        timeout: timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Map Flask response back to Node.js format
      const flaskResult = response.data;
      return {
        risk_score: flaskResult.risk_score,
        status: flaskResult.status,
        confidence: flaskResult.confidence,
        reasons: flaskResult.reasons || [],
        response_time_ms: flaskResult.response_time_ms,
      };
    } catch (error) {
      const isLastAttempt = attempt === retries;
      
      console.warn(`Flask service call failed (Attempt ${attempt}/${retries}): ${error.message}`);
      
      if (isLastAttempt) {
        console.error('All retries exhausted for Flask AI service.');
        throw new Error('AI engine unavailable. Please try again later.');
      }

      // Exponential backoff delay: 500ms, 1000ms...
      const backoffDelay = attempt * 500;
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
};

module.exports = {
  analyzeScan
};
