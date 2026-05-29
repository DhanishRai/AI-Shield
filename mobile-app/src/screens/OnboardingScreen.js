import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions, TouchableOpacity } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { ShieldCheck, Scan, AlertTriangle, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Scan Any UPI QR',
    description: 'Protect yourself before you pay. Scan any merchant QR to verify their identity.',
    icon: <Scan color="#FFFFFF" size={80} />,
    colors: ['#0066FF', '#00D1FF']
  },
  {
    id: '2',
    title: 'AI Threat Analysis',
    description: 'Our AI checks the UPI ID against thousands of reported scams in real-time.',
    icon: <ShieldCheck color="#FFFFFF" size={80} />,
    colors: ['#1A237E', '#0D47A1']
  },
  {
    id: '3',
    title: 'Stay Fraud Free',
    description: 'Get instant risk alerts and pay only when it is safe. Your security is our priority.',
    icon: <AlertTriangle color="#FFFFFF" size={80} />,
    colors: ['#FF1744', '#D50000']
  }
];

const OnboardingScreen = ({ navigation }) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <ScreenContainer useGradient={false}>
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => (
          <View key={slide.id} style={styles.slide}>
            <LinearGradient colors={slide.colors} style={styles.topSection}>
               <View style={styles.iconContainer}>
                 {slide.icon}
               </View>
            </LinearGradient>
            
            <View style={styles.bottomSection}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {slides.map((_, i) => {
            const opacity = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp'
            });
            const scale = scrollX.interpolate({
              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
              outputRange: [0.8, 1.2, 0.8],
              extrapolate: 'clamp'
            });
            return (
              <Animated.View 
                key={i} 
                style={[styles.indicator, { opacity, transform: [{ scale }] }]} 
              />
            );
          })}
        </View>

        <TouchableOpacity 
          style={styles.nextBtn} 
          onPress={() => navigation.replace('Login')}
        >
          <LinearGradient
            colors={['#0066FF', '#00D1FF']}
            style={styles.nextGradient}
          >
            <ChevronRight color="#FFFFFF" size={30} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  slide: {
    width: width,
    flex: 1,
  },
  topSection: {
    height: height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  bottomSection: {
    flex: 1,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  indicatorContainer: {
    flexDirection: 'row',
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#0066FF',
    marginHorizontal: 4,
  },
  nextBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  nextGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OnboardingScreen;
