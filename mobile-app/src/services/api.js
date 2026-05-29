import axios from 'axios';

// Backend Node.js API URL
// For Android emulator: use 10.0.2.2 instead of localhost
// For physical device: use your computer's local IP (e.g., 192.168.1.100)
// For iOS simulator: localhost works
// Using local IPv4 address directly since tunnels crash
const API_BASE_URL = 'http://10.201.109.69:3000/api';

/**
 * Helper to handle axios errors and provide user-friendly messages.
 */
const handleApiError = (error, context) => {
  console.error(`${context} Error:`, {
    message: error.message,
    code: error.code,
    url: error.config?.url,
    status: error.response?.status
  });

  if (error.code === 'ERR_NETWORK') {
    throw new Error(
      'Network Connection Refused.\n\n' +
      '1. Ensure your computer and phone are on the SAME WiFi.\n' +
      '2. Ensure Windows Firewall allows port 3000.\n' +
      '3. Ensure your WiFi is set to "Private" in Windows Settings.'
    );
  }

  if (error.code === 'ECONNABORTED') {
    throw new Error('Connection timed out. The server is taking too long to respond.');
  }

  const serverMessage = error.response?.data?.message || error.response?.data?.error;
  if (serverMessage) throw new Error(serverMessage);

  throw new Error(`${context} failed. Please ensure the backend is running.`);
};

/**
 * Sends parsed QR code data to the Node.js backend for AI risk analysis.
 */
export const analyzeQR = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/scan`, {
      upiId: data.upiId,
      merchantName: data.name,
      amount: parseFloat(data.amount) || 0,
    }, {
      timeout: 15000,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Analysis');
  }
};

/**
 * Fetches scan history for a user.
 */
export const getHistory = async (userId = 'demo-user') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/history/${userId}`, {
      timeout: 8000,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'History Fetch');
  }
};

/**
 * Reports a suspicious UPI ID.
 */
export const reportScam = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/report`, {
      upiId: data.upiId,
      reason: data.reason,
    }, {
      timeout: 8000,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Report');
  }
};

/**
 * Login / Register user.
 */
export const loginUser = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      phone: data.phone,
      name: data.name || 'User',
    }, {
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Login');
  }
};
