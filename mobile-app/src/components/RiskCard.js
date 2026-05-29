import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StatusBadge from './StatusBadge';

const RiskCard = ({ score, status, reasons }) => {
  const getScoreColor = () => {
    const s = (status || '').toUpperCase();
    if (s === 'SAFE') return '#00C853';
    if (s === 'SUSPICIOUS' || s === 'MEDIUM') return '#FF9100';
    return '#FF1744'; // HIGH_RISK / HIGH RISK / Risk
  };

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.label}>Threat Analysis</Text>
            <Text style={[styles.score, { color: getScoreColor() }]}>{score}% Risk</Text>
          </View>
          <StatusBadge status={status} />
        </View>
        
        <View style={styles.divider} />
        
        <Text style={styles.reasonsTitle}>AI Insights:</Text>
        {reasons.map((reason, index) => (
          <View key={index} style={styles.reasonItem}>
            <View style={[styles.dot, { backgroundColor: getScoreColor() }]} />
            <Text style={styles.reasonText}>{reason}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
    marginBottom: 4,
  },
  score: {
    fontSize: 28,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 20,
  },
  reasonsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
    marginTop: 6,
  },
  reasonText: {
    fontSize: 14,
    color: '#475569',
    flex: 1,
    lineHeight: 20,
  },
});

export default RiskCard;
