import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { X, Zap, ShieldCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenContainer from '../components/ScreenContainer';
import { parseUpiString } from '../modules/scanner/qrParser';

// Use a placeholder for the Camera component if not installed yet
// User will need to run: npx expo install expo-camera
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width, height } = Dimensions.get('window');

const ScannerScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanned, setScanned] = useState(false);
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }

    const startAnimation = () => {
      scanLineAnim.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startAnimation();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned || isProcessing) return;
    
    setScanned(true);
    setIsProcessing(true);
    
    const parsedData = parseUpiString(data);
    
    if (parsedData.error) {
      Alert.alert('Invalid QR', parsedData.error, [
        { text: 'Scan Again', onPress: () => { setScanned(false); setIsProcessing(false); } }
      ]);
      return;
    }

    // Success! Navigate to Result with the parsed data
    setIsProcessing(false);
    navigation.navigate('Result', { scanData: data, parsedData: parsedData });
  };

  const handleMockScan = () => {
    handleBarCodeScanned({ data: 'upi://pay?pa=verified@bank&pn=Safe%20Store&am=500' });
  };

  const translateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 240], 
  });

  if (!permission) {
    return <ScreenContainer><ActivityIndicator size="large" color="#0066FF" style={{ flex: 1 }} /></ScreenContainer>;
  }
  if (!permission.granted) {
    return (
      <ScreenContainer style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ color: '#fff', textAlign: 'center', marginBottom: 20 }}>
            Camera permission is required to scan QR codes.
          </Text>
          <TouchableOpacity 
            onPress={requestPermission}
            style={{ backgroundColor: '#0066FF', padding: 15, borderRadius: 10 }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer useGradient={false} style={styles.container}>
      <View style={styles.cameraPreview}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={styles.overlay}>
          <View style={styles.topSection}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
              <X color="#FFFFFF" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Scan QR Code</Text>
            <TouchableOpacity style={styles.iconBtn}>
              <Zap color="#FFFFFF" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.scannerContainer}>
            <View style={styles.scannerBox}>
              <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
              
              {/* Corner Accents */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>

          <View style={styles.bottomSection}>
            <Text style={styles.hintText}>Align QR code within the frame to scan</Text>
            
            {isProcessing && (
               <View style={styles.loaderBox}>
                 <ActivityIndicator color="#00E5FF" />
                 <Text style={styles.loaderText}>Analyzing Merchant...</Text>
               </View>
            )}

            <TouchableOpacity 
              style={styles.simulateBtn} 
              onPress={handleMockScan}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#0066FF', '#00D1FF']}
                style={styles.simulateGradient}
              >
                <Text style={styles.simulateText}>SIMULATE SCAN</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: '#000',
  },
  cameraPreview: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  scannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerBox: {
    width: 240,
    height: 240,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  scanLine: {
    height: 4,
    width: '100%',
    backgroundColor: '#00E5FF',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#00E5FF',
    borderWidth: 4,
  },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 24 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 24 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 24 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 24 },
  bottomSection: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  hintText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
  loaderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  loaderText: {
    color: '#00E5FF',
    marginLeft: 10,
    fontWeight: '600',
  },
  simulateBtn: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  simulateGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  simulateText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 1.5,
  },
});

export default ScannerScreen;
