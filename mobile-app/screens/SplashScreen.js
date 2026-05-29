import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { ShieldCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ScreenContainer useGradient={false} style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F0F7FF']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.centerContent}>
        <Animated.View style={[
          styles.logoWrapper, 
          { opacity: logoOpacity, transform: [{ scale: logoScale }] }
        ]}>
          <LinearGradient
            colors={['#0066FF', '#00D1FF']}
            style={styles.logoGradient}
          >
            <ShieldCheck color="#FFFFFF" size={70} strokeWidth={2.5} />
          </LinearGradient>
          <View style={styles.logoShadow} />
        </Animated.View>

        <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
          <Text style={styles.brandName}>PAYNOVA</Text>
          <View style={styles.taglineBorder} />
          <Text style={styles.tagline}>SECURE TRANSFERS | AI PROTECTION</Text>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Securely protecting your digital assets</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  logoShadow: {
    position: 'absolute',
    bottom: -10,
    width: 100,
    height: 30,
    backgroundColor: 'rgba(0, 102, 255, 0.1)',
    borderRadius: 50,
    transform: [{ scaleX: 1.2 }],
    zIndex: 1,
  },
  brandName: {
    fontSize: 42,
    fontWeight: '900',
    color: '#003366',
    letterSpacing: 4,
  },
  taglineBorder: {
    width: 40,
    height: 4,
    backgroundColor: '#00D1FF',
    marginVertical: 12,
    borderRadius: 2,
  },
  tagline: {
    fontSize: 12,
    color: '#666',
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 60,
  },
  footerText: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});

export default SplashScreen;
