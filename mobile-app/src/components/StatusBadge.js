import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatusBadge = ({ status }) => {
  const getColors = () => {
    const s = (status || '').toUpperCase();
    if (s === 'SAFE')
      return { bg: 'rgba(0, 200, 83, 0.1)', text: '#00C853' };
    if (s === 'SUSPICIOUS' || s === 'MEDIUM')
      return { bg: 'rgba(255, 145, 0, 0.1)', text: '#FF9100' };
    if (s.includes('RISK') || s === 'RISK')
      return { bg: 'rgba(255, 23, 68, 0.1)', text: '#FF1744' };
    return { bg: 'rgba(148, 163, 184, 0.1)', text: '#64748B' };
  };

  const colors = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg, borderColor: colors.text }]}>
      <Text style={[styles.text, { color: colors.text }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 30,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default StatusBadge;
