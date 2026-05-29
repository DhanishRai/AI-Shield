import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { analyzeQR } from '../services/api';
import { initiateUpiPayment } from '../services/deepLink';

const ResultScreen = ({ route, navigation }) => {
  const { paymentData } = route.params;
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    performRiskScan();
  }, []);

  const performRiskScan = async () => {
    setLoading(true);
    setError(null);
    try {
      const riskData = await analyzeQR(paymentData);
      setResult(riskData);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayClick = () => {
    // Show confirmation popup before proceeding with actual payment link
    Alert.alert(
      'Confirm Payment',
      `Are you sure you want to proceed paying ₹${paymentData.amount} to ${paymentData.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Pay Now', onPress: () => initiateUpiPayment(paymentData) }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Analyzing Risk. Please wait...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>Analysis Failed</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={performRiskScan}>
          <Text style={styles.btnText}>Retry Analysis</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>Scan Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!result) return null;

  // Determine styles and permissions from risk status
  const isSafe = result.status === 'SAFE';
  const isSuspicious = result.status === 'SUSPICIOUS';
  const isHighRisk = result.status === 'HIGH RISK';

  let statusColor = '#000';
  if (isSafe) statusColor = '#4CAF50';
  else if (isSuspicious) statusColor = '#FFC107';
  else if (isHighRisk) statusColor = '#F44336';

  const canProceed = isSafe || isSuspicious;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Risk Analysis</Text>
      
      {/* Fetched Payment Details Section */}
      <View style={styles.detailsCard}>
        <Text style={styles.detailText}>Merchant: <Text style={styles.bold}>{paymentData.name}</Text></Text>
        <Text style={styles.detailText}>UPI ID: <Text style={styles.bold}>{paymentData.upiId}</Text></Text>
        <Text style={styles.detailText}>Amount: <Text style={styles.bold}>₹{paymentData.amount}</Text></Text>
      </View>

      {/* Dynamic Status Section */}
      <View style={[styles.statusBox, { borderColor: statusColor }]}>
         <Text style={[styles.statusTitle, { color: statusColor }]}>{result.status}</Text>
         <Text style={styles.scoreText}>Risk Score: {result.risk_score}/100</Text>
         <Text style={styles.reasonText}>{result.reason}</Text>
      </View>

      {/* Action Buttons conditionally rendered */}
      {canProceed ? (
        <TouchableOpacity 
          style={[styles.payBtn, { backgroundColor: statusColor }]} 
          onPress={handlePayClick}
        >
          <Text style={styles.btnText}>Proceed to Pay</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.blockedAlert}>Payment Blocked - High Risk Detected</Text>
      )}

      <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.btnText}>Cancel & Scan Again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  detailsCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  bold: {
    fontWeight: 'bold',
    color: '#111',
  },
  statusBox: {
    borderWidth: 2,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#fff',
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
    fontWeight: '600',
  },
  reasonText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  payBtn: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  cancelBtn: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#9e9e9e',
  },
  retryBtn: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#2196F3',
    marginBottom: 15,
    width: '100%',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#F44336',
    fontSize: 16,
    marginBottom: 25,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#444',
  },
  blockedAlert: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
});

export default ResultScreen;
