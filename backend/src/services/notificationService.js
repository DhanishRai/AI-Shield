/**
 * Service for sending notifications (e.g., SMS, push notifications)
 * Useful for alerting users if their account has suspicious activity
 */

const sendSuspiciousAlert = async (userId, message) => {
  // Implement notification logic
  console.log(`Alerting user ${userId}: ${message}`);
};

module.exports = {
  sendSuspiciousAlert
};
