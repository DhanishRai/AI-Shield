import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatusBadge = ({ status }) => {
  const getColors = () => {
    switch (status) {
      case 'Safe':
        return { bg: 'rgba(0, 255, 148, 0.1)', text: '#00FF94' };
      case 'Medium':
        return { bg: 'rgba(255, 184, 0, 0.1)', text: '#FFB800' };
      case 'High Risk':
      case 'Risk':
        return { bg: 'rgba(255, 0, 92, 0.1)', text: '#FF005C' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.1)', text: '#FFFFFF' };
    }
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
