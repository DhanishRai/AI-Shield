import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { Image as ImageIcon, Upload } from 'lucide-react-native';

const ReportScamScreen = ({ navigation }) => {
  const [upiId, setUpiId] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!upiId || !reason) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Report Submitted', 'Thank you for helping keep the community safe!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    }, 2000);
  };

  return (
    <ScreenContainer>
      <Header title="Report a Scam" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.subtitle}>Help others by reporting suspicious UPI IDs or QR codes.</Text>
        
        <TouchableOpacity style={styles.uploadBox} activeOpacity={0.6}>
          <Upload color="#0066FF" size={32} />
          <Text style={styles.uploadText}>Upload Scam QR Code</Text>
          <Text style={styles.uploadSubtext}>Optional (JPG, PNG)</Text>
        </TouchableOpacity>

        <InputField 
          label="Scammer UPI ID"
          placeholder="e.g. mobile@upi"
          value={upiId}
          onChangeText={setUpiId}
        />

        <InputField 
          label="Reason / Incident Details"
          placeholder="Describe what happened..."
          value={reason}
          onChangeText={setReason}
          multiline
          numberOfLines={4}
        />

        <View style={styles.footer}>
          <PrimaryButton 
            title="Submit Report" 
            onPress={handleSubmit}
            loading={loading}
          />
          <Text style={styles.disclaimer}>
            Your report will be reviewed by our team and shared with NPCI if verified.
          </Text>
        </View>
      </ScrollView>
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
  uploadBox: {
    height: 150,
    borderWidth: 2,
    borderColor: '#E1E4E8',
    borderStyle: 'dashed',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    marginBottom: 20,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 10,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  footer: {
    marginTop: 20,
    marginBottom: 40,
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});

export default ReportScamScreen;
