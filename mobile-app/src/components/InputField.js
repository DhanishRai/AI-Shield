import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const InputField = ({ label, placeholder, value, onChangeText, secureTextEntry, keyboardType, multiline, numberOfLines }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputWrapper, 
        isFocused && styles.inputFocused
      ]}>
        <TextInput
          style={[styles.input, multiline && styles.textArea]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          placeholderTextColor="#94A3B8"
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%',
  },
  label: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 8,
    fontWeight: '700',
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  inputFocused: {
    borderColor: '#0066FF',
    backgroundColor: '#FFFFFF',
  },
  input: {
    paddingHorizontal: 18,
    paddingVertical: 15,
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  textArea: {
    height: 120,
    paddingTop: 15,
  },
});

export default InputField;
