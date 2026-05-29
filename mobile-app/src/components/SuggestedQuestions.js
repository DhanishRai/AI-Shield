import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const SuggestedQuestions = ({ suggestions, onSelect }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {suggestions.map((question) => (
        <TouchableOpacity
          key={question}
          style={styles.chip}
          onPress={() => onSelect(question)}
          activeOpacity={0.8}
        >
          <Text style={styles.chipText}>{question}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  chipText: {
    color: '#1D4ED8',
    fontWeight: '700',
    fontSize: 12,
  },
});

export default SuggestedQuestions;
