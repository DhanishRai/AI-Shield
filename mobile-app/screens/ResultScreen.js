import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import RiskCard from '../components/RiskCard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ResultScreen = ({ route, navigation }) => {
  const { scanData } = route.params || { scanData: 'upi://test' };
  
  // Animation values
  const ringAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(ringAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Mock analysis logic
  const isSuspicious = scanData.includes('scammer') || scanData === 'test';
  const score = isSuspicious ? 85 : 12;
  const status = isSuspicious ? 'High Risk' : 'Safe';
  
  const getStatusColor = () => {
    if (status === 'Safe') return '#00C853';
    return '#FF1744';
  };

  return (
    <ScreenContainer>
      <Header title="Analysis Result" showBack onBack={() => navigation.goBack()} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.meterContainer}>
          <Animated.View style={[styles.glowRing, { 
            borderColor: getStatusColor(),
            opacity: ringAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.3] }),
            transform: [{ scale: ringAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.2] }) }]
          }]} />
          
          <View style={[styles.mainCircle, { borderColor: getStatusColor() }]}>
             <LinearGradient
               colors={['#FFFFFF', '#F8FAFF']}
               style={styles.circleInner}
             >
                {isSuspicious ? (
                  <AlertTriangle color="#FF1744" size={40} />
                ) : (
                  <ShieldCheck color="#00C853" size={40} />
                )}
                <Text style={[styles.scoreText, { color: getStatusColor() }]}>{score}%</Text>
                <Text style={styles.scoreLabel}>Risk Level</Text>
             </LinearGradient>
          </View>
        </View>

        <Animated.View style={{ opacity: opacityAnim, transform: [{ translateY: ringAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
          <View style={styles.statusBadgeContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '15', borderColor: getStatusColor() }]}>
               <Text style={[styles.statusText, { color: getStatusColor() }]}>{status.toUpperCase()}</Text>
            </View>
          </View>

          <RiskCard 
            score={score} 
            status={isSuspicious ? 'High Risk' : 'Safe'} 
            reasons={isSuspicious ? [
              "Flagged UPI ID in our database",
              "Unusual transaction pattern detected",
              "Linked to reported fraud cases"
            ] : [
              "Verified merchant profile",
              "Safe transaction history",
              "SSL Encryption active"
            ]}
          />

          <View style={styles.actionContainer}>
            {isSuspicious ? (
              <>
                <PrimaryButton 
                  title="Report this Scam" 
                  onPress={() => navigation.navigate('ReportScam')} 
                  style={{ backgroundColor: '#FF1744' }}
                />
                <SecondaryButton 
                  title="Cancel Payment" 
                  onPress={() => navigation.navigate('Home')} 
                />
              </>
            ) : (
              <PrimaryButton 
                title="Proceed to Pay" 
                onPress={() => navigation.navigate('PaymentOptions', { amount: 1000 })} 
              />
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  meterContainer: {
    height: 240,
    width: 240,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  glowRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 20,
  },
  mainCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  circleInner: {
    width: '100%',
    height: '100%',
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 42,
    fontWeight: '900',
    marginTop: 5,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '700',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDA4AF',
    marginTop: 10,
    marginBottom: 30,
  },
  warningText: {
    color: '#BE123C',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  footer: {
    marginBottom: 40,
  },
  proceedBtn: {
    backgroundColor: '#EF4444', // Red for high risk
  },
  cancelBtn: {
    borderColor: '#666',
  },
});

export default ResultScreen;
