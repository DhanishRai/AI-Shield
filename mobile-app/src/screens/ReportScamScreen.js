import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { Upload } from 'lucide-react-native';
import { reportScam } from '../services/api';

const ReportScamScreen = ({ route, navigation }) => {
  const prefillUpiId = route.params?.upiId || '';
  const [upiId, setUpiId] = useState(prefillUpiId);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!upiId || !reason) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      await reportScam({ upiId, reason });
      Alert.alert('Report Submitted', 'Thank you for helping keep the community safe!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
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

        {/* Recent Reports Section */}
        <View style={styles.recentReportsContainer}>
          <Text style={styles.recentReportsTitle}>Recent Reports on Suspicious Contacts</Text>
          {[
            { id: 1, upi: 'scammer1@upi', reason: 'Asked for OTP over phone call', date: '2 hours ago' },
            { id: 2, upi: 'fake_prize@ybl', reason: 'Sent a link claiming I won a lottery', date: '5 hours ago' },
            { id: 3, upi: 'support_fake@sbi', reason: 'Pretended to be bank support', date: '1 day ago' }
          ].map((report) => (
            <View key={report.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <Text style={styles.reportUpi}>{report.upi}</Text>
                <Text style={styles.reportDate}>{report.date}</Text>
              </View>
              <Text style={styles.reportReason}>{report.reason}</Text>
            </View>
          ))}
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
  recentReportsContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 20,
  },
  recentReportsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 15,
  },
  reportCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  reportUpi: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B91C1C',
  },
  reportDate: {
    fontSize: 12,
    color: '#94A3B8',
  },
  reportReason: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
});

export default ReportScamScreen;
