import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { parseUpiString } from '../services/parser';

const ScannerScreen = ({ navigation }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const onSuccess = (e) => {
    setIsProcessing(true);
    const scannedData = e.data;
    
    // Parse the raw QR content
    const parsedData = parseUpiString(scannedData);
    
    if (parsedData.error) {
      Alert.alert('Scan Error', parsedData.error, [
        { text: 'OK', onPress: () => setIsProcessing(false) } // Reset state to allow next scan
      ]);
      return;
    }

    // On successful parse, navigate to result screen
    setIsProcessing(false);
    navigation.navigate('Result', { paymentData: parsedData });
  };

  return (
    <View style={styles.container}>
      {isProcessing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Processing QR Code...</Text>
        </View>
      ) : (
        <QRCodeScanner
          onRead={onSuccess}
          showMarker={true}
          markerStyle={styles.marker}
          cameraProps={{ captureAudio: false }} // Ensure we don't ask for microphone permission
          topContent={
            <Text style={styles.headerText}>Fraud Shield</Text>
          }
          bottomContent={
            <Text style={styles.footerText}>Scan the Merchant's UPI QR Code</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    marginTop: 15,
    color: '#fff',
    fontSize: 16,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 40,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 20,
  },
  marker: {
    borderColor: '#4CAF50', // Highlight color for scanner frame
    borderRadius: 10,
  }
});

export default ScannerScreen;
