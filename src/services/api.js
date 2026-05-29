import axios from 'axios';

// IMPORTANT: Replace <backend-ip> with your actual local network IP 
// or production API host for physical devices to access it.
const BACKEND_URL = 'http://192.168.1.100:5000/api/scan'; 

/**
 * Sends parsed QR code data to the Node.js backend for AI risk analysis.
 * @param {Object} data - Contains upiId, name, amount
 * @returns {Promise<Object>} The risk assessment result
 */
export const analyzeQR = async (data) => {
  try {
    const response = await axios.post(BACKEND_URL, {
      upiId: data.upiId,
      name: data.name,
      amount: data.amount,
    });
    
    return response.data;
  } catch (error) {
    console.error('API Integration Error:', error);
    
    // Provide a user-friendly error message extracting backend message if present
    const errorMessage = error.response?.data?.message || 'Network error or backend is unreachable.';
    throw new Error(errorMessage);
  }
};
