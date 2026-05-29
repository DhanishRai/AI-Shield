import { Linking, Alert } from 'react-native';

/**
 * Initiates UPI payment by redirecting to an installed UPI app.
 * @param {Object} data - Contains upiId, name, amount
 */
export const initiateUpiPayment = async ({ upiId, name, amount }) => {
  try {
    // Construct the standard UPI Deep Link
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}`;
    
    // Ensure the device has an app capable of handling the URI scheme
    const supported = await Linking.canOpenURL(upiUrl);
    
    if (supported) {
      await Linking.openURL(upiUrl);
    } else {
      Alert.alert('Payment Error', 'No UPI app found on your device.');
    }
  } catch (error) {
    console.error('Deep Link Redirection Error:', error);
    Alert.alert('Payment Error', 'Failed to open the payment app. Please try again.');
  }
};
