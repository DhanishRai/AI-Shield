export const parseUpiString = (upiString) => {
  // Validate input type and format
  if (!upiString || typeof upiString !== 'string' || !upiString.startsWith('upi://pay')) {
    return { error: 'Invalid Payment QR. Please scan a valid UPI QR code.' };
  }

  try {
    // Separate the base uri from the query string
    const [, queryString] = upiString.split('?');
    
    if (!queryString) {
        return { error: 'Missing parameters in QR.' };
    }

    // Parse the query parameters
    const params = queryString.split('&').reduce((acc, param) => {
      const [key, value] = param.split('=');
      if (key && value !== undefined) {
        // Handle URL encoded values for names, etc.
        acc[key] = decodeURIComponent(value);
      }
      return acc;
    }, {});

    // Ensure backwards compatibility, providing safe defaults
    const upiId = params.pa || '';
    const name = params.pn || 'Unknown Merchant';
    const amount = params.am || '0';

    if (!upiId) {
      return { error: 'Missing UPI ID in QR code.' };
    }

    return { upiId, name, amount };
  } catch (error) {
    console.error('QR Parsing Error:', error);
    return { error: 'Failed to parse QR code data.' };
  }
};
