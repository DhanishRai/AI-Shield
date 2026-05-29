import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height, width } = Dimensions.get('window');

const ScreenContainer = ({ children, style, useGradient = true }) => {
  return (
    <View style={styles.outer}>
      <StatusBar style="dark" />
      {useGradient ? (
        <LinearGradient
          colors={['#F8FAFF', '#E0E7FF', '#F8FAFF']}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#F8FAFC' }]} />
      )}
      <SafeAreaView style={[styles.container, style]}>
        <View style={styles.content}>{children}</View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default ScreenContainer;
