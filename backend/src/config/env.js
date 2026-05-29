require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/fraud-shield',
  NODE_ENV: process.env.NODE_ENV || 'development',
  FLASK_SERVICE_URL: process.env.FLASK_SERVICE_URL || 'http://localhost:5000/predict'
};
