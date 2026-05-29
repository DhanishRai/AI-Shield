import { Linking, Alert } from 'react-native';

/**
 * Generates a valid, standards-compliant UPI deep link.
 */
export const generateUPILink = ({ pa, pn, am, tn }) => {
  if (!pa) return null;
  
  // Safe encode payee address
  let url = `upi://pay?pa=${encodeURIComponent(pa)}`;
  
  // Safe encode payee name
  if (pn) {
    url += `&pn=${encodeURIComponent(pn)}`;
  }
  
  // Safe numeric decimal formatting for amount
  if (am) {
    const numericAmount = parseFloat(String(am).replace(/[^0-9.]/g, ''));
    if (!isNaN(numericAmount) && numericAmount > 0) {
      // Format to 2 decimal places as per UPI standards (e.g., 1.00)
      url += `&am=${numericAmount.toFixed(2)}`;
    }
  }
  
  // Mandatory currency field
  url += `&cu=INR`;
  
  // Support Transaction Note
  const note = tn || 'Fraud Shield Payment';
  url += `&tn=${encodeURIComponent(note)}`;

  return url;
};

/**
 * Initiates UPI payment by redirecting to an installed UPI app.
 * @param {Object} data - Contains upiId, name, amount, note
 */
export const initiateUpiPayment = async ({ upiId, name, amount, note }) => {
  try {
    // Validate required fields
    if (!upiId) {
      Alert.alert('Payment Error', 'Invalid payment details');
      return;
    }

    const upiUrl = generateUPILink({
      pa: upiId,
      pn: name,
      am: amount,
      tn: note
    });
    
    if (!upiUrl) {
      Alert.alert('Payment Error', 'Invalid payment details');
      return;
    }

    console.log("UPI URL:", upiUrl);
    
    // Ensure device supports this URL
    const supported = await Linking.canOpenURL(upiUrl);
    
    if (supported) {
      await Linking.openURL(upiUrl);
    } else {
      Alert.alert('Payment Error', 'No compatible UPI app found');
    }
  } catch (error) {
    console.error('Deep Link Redirection Error:', error);
    Alert.alert('Payment Error', 'Unable to initiate payment');
  }
};
