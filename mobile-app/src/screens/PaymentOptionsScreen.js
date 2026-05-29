import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import { ChevronRight } from 'lucide-react-native';
import * as IntentLauncher from 'expo-intent-launcher';


const PaymentOptionsScreen = ({ route, navigation }) => {
  const { paymentData } = route.params || {};

  const options = [
    { id: 'gpay', name: 'Google Pay', icon: '🔵', packageId: 'com.google.android.apps.nbu.paisa.user' },
    { id: 'phonepe', name: 'PhonePe', icon: '🟣', packageId: 'com.phonepe.app' },
    { id: 'paytm', name: 'Paytm', icon: '🔹', packageId: 'net.one97.paytm' },
  ];

  const handlePayment = async (option) => {
    try {
      // Use specific app protocols to force the direct opening of the selected app
      // This bypasses the generic "app selector" list
      const appData = option.id === 'gpay' ? 'tez://upi/pay' : 
                      option.id === 'phonepe' ? 'phonepe://pay' : 
                      'paytmmp://pay';

      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        packageName: option.packageId,
        data: appData
      });
    } catch (error) {
      Alert.alert('App Not Found', `Please make sure ${option.name} is installed.`);
    }
  };

  return (
    <ScreenContainer>
      <Header title="Choose Payment App" showBack onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={styles.subtitle}>Select an app to complete your transaction securely.</Text>
        
        {options.map((option) => (
          <TouchableOpacity 
            key={option.id} 
            style={styles.optionCard} 
            activeOpacity={0.7}
            onPress={() => handlePayment(option)}
          >
            <View style={styles.left}>
              <View style={styles.iconCircle}>
                <Text style={{ fontSize: 24 }}>{option.icon}</Text>
              </View>
              <Text style={styles.name}>{option.name}</Text>
            </View>
            <ChevronRight color="#999" size={20} />
          </TouchableOpacity>
        ))}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            🔒 Fraud Shield is monitoring this transaction in the background.
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  infoBox: {
    marginTop: 30,
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoText: {
    color: '#0369A1',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default PaymentOptionsScreen;
