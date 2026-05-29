import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [myReports, setMyReports] = useState([
    { id: 1, upi: 'scammer1@upi', reason: 'Asked for OTP over phone call', date: '2 hours ago' },
    { id: 2, upi: 'fake_prize@ybl', reason: 'Sent a link claiming I won a lottery', date: '5 hours ago' }
  ]);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const saved = await AsyncStorage.getItem('user_reports');
        if (saved) setMyReports(JSON.parse(saved));
      } catch (e) {
        console.log('Failed to load reports');
      }
    };
    loadReports();
  }, []);

  const handleSubmit = async () => {
    if (!upiId || !reason) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      await reportScam({ upiId, reason });
      const newReport = { id: Date.now(), upi: upiId, reason: reason, date: 'Just now' };
      const updatedReports = [newReport, ...myReports];
      setMyReports(updatedReports);
      await AsyncStorage.setItem('user_reports', JSON.stringify(updatedReports));
      setUpiId('');
      setReason('');
      
      Alert.alert('Report Submitted', 'Thank you! Your report has been added to your history.');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const viewMode = route.params?.viewMode || 'both';

  return (
    <ScreenContainer>
      <Header title={viewMode === 'list' ? "My Reports" : "Report Fraud"} showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
        
        {viewMode !== 'list' && (
          <>
            <Text style={styles.subtitle}>Help others by reporting suspicious contacts, UPI IDs or QR codes.</Text>
            
            <TouchableOpacity style={styles.uploadBox} activeOpacity={0.6}>
              <Upload color="#0066FF" size={32} />
              <Text style={styles.uploadText}>Upload Scam QR Code</Text>
              <Text style={styles.uploadSubtext}>Optional (JPG, PNG)</Text>
            </TouchableOpacity>

            <InputField 
              label="Contact Number / UPI ID"
              placeholder="e.g. +91 9876... or scammer@upi"
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
          </>
        )}

        {/* Recent Reports Section */}
        {viewMode !== 'form' && (
          <View style={styles.recentReportsContainer}>
            <Text style={styles.recentReportsTitle}>My Recent Reports</Text>
            {myReports.length === 0 ? (
              <Text style={{color: '#94A3B8', textAlign: 'center', marginTop: 10}}>No reports submitted yet.</Text>
            ) : (
              myReports.map((report) => (
                <View key={report.id} style={styles.reportCard}>
                  <View style={styles.reportHeader}>
                    <Text style={styles.reportUpi}>{report.upi}</Text>
                    <Text style={styles.reportDate}>{report.date}</Text>
                  </View>
                  <Text style={styles.reportReason}>{report.reason}</Text>
                </View>
              ))
            )}
          </View>
        )}
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
