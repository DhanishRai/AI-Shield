import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Animated, TouchableOpacity } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { ShieldCheck, Scan, Smartphone, Lock, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'AI Protection',
    description: 'Our advanced AI monitors every transaction to shield you from evolving digital threats.',
    icon: <ShieldCheck size={80} color="#FFFFFF" />,
    colors: ['#0066FF', '#00D1FF'],
  },
  {
    id: 2,
    title: 'Scan with Confidence',
    description: 'Instantly verify any QR code before you pay. We identify malicious links in milliseconds.',
    icon: <Scan size={80} color="#FFFFFF" />,
    colors: ['#6366F1', '#A855F7'],
  },
  {
    id: 3,
    title: 'Secure Transfers',
    description: 'Experience a seamless and highly encrypted payment gateway for all your daily needs.',
    icon: <Smartphone size={80} color="#FFFFFF" />,
    colors: ['#10B981', '#34D399'],
  },
  {
    id: 4,
    title: 'Fraud Shield',
    description: 'The ultimate security companion for your digital wallet. Stay safe, stay protected.',
    icon: <Lock size={80} color="#FFFFFF" />,
    colors: ['#F59E0B', '#FB923C'],
  },
];

const OnboardingScreen = ({ navigation }) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <ScreenContainer useGradient={false}>
      <ScrollView
        horizontal
        pagingEnabled
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
              
              {index === slides.length - 1 ? (
                <TouchableOpacity 
                  style={styles.getStartedBtn} 
                  onPress={() => navigation.replace('Auth')}
                >
                  <LinearGradient
                    colors={['#0066FF', '#00D1FF']}
                    style={styles.btnGradient}
                  >
                    <Text style={styles.btnText}>GET STARTED</Text>
                    <ArrowRight color="#FFFFFF" size={20} />
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <View style={styles.indicatorContainer}>
                  {slides.map((_, i) => {
                    const opacity = scrollX.interpolate({
                      inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                      outputRange: [0.3, 1, 0.3],
                      extrapolate: 'clamp',
                    });
                    const scale = scrollX.interpolate({
                      inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                      outputRange: [0.8, 1.2, 0.8],
                      extrapolate: 'clamp',
                    });
                    return (
                      <Animated.View 
                        key={i} 
                        style={[styles.indicator, { opacity, transform: [{ scale }] }]} 
                      />
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  slide: {
    width: width,
    height: height,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
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
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  indicatorContainer: {
    flexDirection: 'row',
    height: 10,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0066FF',
    marginHorizontal: 5,
  },
  getStartedBtn: {
    width: width - 80,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  btnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1.5,
    marginRight: 10,
  },
});

export default OnboardingScreen;
