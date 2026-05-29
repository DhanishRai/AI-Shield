import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TypingIndicator = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Fraud Shield is typing...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  text: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default TypingIndicator;
