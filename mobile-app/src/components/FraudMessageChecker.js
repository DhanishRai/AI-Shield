import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import { useSettings } from '../context/SettingsContext';

const WARNING_BY_LANGUAGE = {
  English: {
    text: 'Warning this looks like a fraud message',
    speechCode: 'en-US',
  },
  Hindi: {
    text: 'चेतावनी, यह संदेश धोखाधड़ी जैसा लगता है',
    speechCode: 'hi-IN',
  },
  Kannada: {
    text: 'ಎಚ್ಚರಿಕೆ, ಈ ಸಂದೇಶವು ಮೋಸದಂತೆ ಕಾಣುತ್ತದೆ',
    speechCode: 'kn-IN',
  },
};

const KEYWORD_RULES = [
  { key: 'otp', label: 'OTP request detected' },
  { key: 'kyc', label: 'KYC urgency detected' },
  { key: 'urgent', label: 'Urgency language detected' },
  { key: 'click link', label: 'Suspicious link instruction detected' },
  { key: 'reward', label: 'Reward lure detected' },
  { key: 'verify now', label: 'Forced verification phrase detected' },
];

const isTtsAvailable = typeof Speech.speak === 'function' && typeof Speech.stop === 'function';

const FraudMessageChecker = () => {
  const { language } = useSettings();
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);

  const canAnalyze = useMemo(() => message.trim().length > 0, [message]);
  const selectedWarning = WARNING_BY_LANGUAGE[language] || WARNING_BY_LANGUAGE.English;

  const speakWarning = () => {
    if (!isTtsAvailable) return;
    Speech.stop();
    Speech.speak(selectedWarning.text, {
      language: selectedWarning.speechCode,
      rate: 0.95,
      pitch: 1,
    });
  };

  const analyzeMessage = () => {
    const normalizedText = message.toLowerCase();
    const detectedReasons = KEYWORD_RULES.filter((rule) => normalizedText.includes(rule.key)).map((rule) => rule.label);

    const isScam = detectedReasons.length > 0;
    const riskLevel = detectedReasons.length >= 3 ? 'HIGH RISK' : isScam ? 'SUSPICIOUS' : 'LOW RISK';
    const nextResult = { isScam, riskLevel, reasons: detectedReasons };

    setResult(nextResult);
    if (isScam) {
      speakWarning();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suspicious SMS Fraud Checker</Text>
      <Text style={styles.subtitle}>Paste any SMS to quickly check common scam patterns.</Text>

      <TextInput
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={4}
        placeholder="Paste suspicious message here..."
        placeholderTextColor="#94A3B8"
        style={styles.input}
        textAlignVertical="top"
      />

      <TouchableOpacity
        onPress={analyzeMessage}
        disabled={!canAnalyze}
        style={[styles.primaryButton, !canAnalyze && styles.disabledButton]}
        activeOpacity={0.85}
      >
        <Text style={styles.primaryButtonText}>Analyze Message</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultBox}>
          <Text style={[styles.riskText, result.isScam ? styles.riskHigh : styles.riskLow]}>
            Risk: {result.riskLevel}
          </Text>

          {result.reasons.length > 0 ? (
            <View style={styles.reasonContainer}>
              <Text style={styles.reasonTitle}>Reasons detected:</Text>
              {result.reasons.map((reason) => (
                <Text key={reason} style={styles.reasonItem}>
                  - {reason}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={styles.safeText}>No suspicious keywords detected.</Text>
          )}

          {result.isScam && (
            <>
              <TouchableOpacity
                onPress={speakWarning}
                style={[styles.secondaryButton, !isTtsAvailable && styles.disabledButton]}
                disabled={!isTtsAvailable}
                activeOpacity={0.85}
              >
                <Text style={styles.secondaryButtonText}>Hear Warning</Text>
              </TouchableOpacity>
              {!isTtsAvailable && (
                <Text style={styles.ttsInfoText}>
                  Voice warning is unavailable in this runtime.
                </Text>
              )}
            </>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 20,
    marginTop: 18,
    marginBottom: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 12,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  input: {
    minHeight: 108,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: '#0066FF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  disabledButton: {
    opacity: 0.45,
  },
  resultBox: {
    marginTop: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
  },
  riskText: {
    fontSize: 15,
    fontWeight: '800',
  },
  riskHigh: {
    color: '#B91C1C',
  },
  riskLow: {
    color: '#15803D',
  },
  reasonContainer: {
    marginTop: 8,
  },
  reasonTitle: {
    color: '#334155',
    fontWeight: '700',
    marginBottom: 4,
  },
  reasonItem: {
    color: '#475569',
    marginBottom: 2,
    fontSize: 13,
    fontWeight: '600',
  },
  safeText: {
    marginTop: 8,
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
  },
  secondaryButton: {
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0066FF',
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#0066FF',
    fontSize: 14,
    fontWeight: '800',
  },
  ttsInfoText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default FraudMessageChecker;
