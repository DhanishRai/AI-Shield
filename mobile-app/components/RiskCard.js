import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StatusBadge from './StatusBadge';

const RiskCard = ({ score, status, reasons }) => {
  const getScoreColor = () => {
    if (status === 'Safe') return '#00FF94'; // Neon Green
    if (status === 'Medium') return '#FFB800'; // Neon Yellow
    return '#FF005C'; // Neon Red/Pink
  };

  return (
    <View style={[styles.card, { borderColor: 'rgba(255, 255, 255, 0.1)' }]}>
      <View style={[styles.neonGlow, { backgroundColor: getScoreColor() }]} />
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    marginVertical: 16,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  neonGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.15,
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
    color: '#9AA0A6',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  reasonsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
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
    color: '#9AA0A6',
    flex: 1,
    lineHeight: 20,
  },
});

export default RiskCard;
