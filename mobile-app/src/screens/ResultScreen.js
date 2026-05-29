import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions, ActivityIndicator, Alert } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import RiskCard from '../components/RiskCard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { ShieldAlert, ShieldCheck, AlertTriangle, User, CreditCard, Wallet, Smartphone } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { analyzeQR } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { TextInput, Vibration } from 'react-native';
import * as Speech from 'expo-speech';

const { width } = Dimensions.get('window');

const ResultScreen = ({ route, navigation }) => {
  const { simpleMode } = useSettings();
  const { scanData, parsedData } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [editableAmount, setEditableAmount] = useState(parsedData?.amount || '');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasWarned, setHasWarned] = useState(false);
  
  // Animation values
  const ringAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const riskSectionAnim = useRef(new Animated.Value(0)).current;

  const performAnalysis = async (amount) => {
    if (!amount || amount === '0' || amount === '') {
      setAnalysis(null);
      setLoading(false);
      setIsRefreshing(false);
      riskSectionAnim.setValue(0);
      setHasWarned(false);
      return;
    }

    setIsRefreshing(true);
    try {
      if (parsedData) {
        const result = await analyzeQR({
          ...parsedData,
          amount: amount
        });
        setAnalysis(result);
        startAnimations();
        
        // Tiered Voice Warning Logic
        const normalizedStatus = String(result?.status || '').toUpperCase();
        const isHighRisk = normalizedStatus === 'HIGH_RISK' || normalizedStatus === 'HIGH RISK' || normalizedStatus === 'HIGH';
        const isSuspicious = normalizedStatus === 'SUSPICIOUS' || normalizedStatus === 'MEDIUM';
        
        if (isHighRisk && !hasWarned) {
          Speech.speak('Danger: This transaction is highly unsafe. Stop immediately.', {
            language: 'en',
            pitch: 0.8,
            rate: 0.8
          });
          Vibration.vibrate([0, 500, 200, 500, 200, 500]); // Strong haptic
          setHasWarned(true);
        } else if (isSuspicious && !hasWarned) {
          Speech.speak('Warning: This transaction has suspicious signals. Proceed with caution.', {
            language: 'en',
            pitch: 1.0,
            rate: 0.9
          });
          Vibration.vibrate(500); // Mild haptic
          setHasWarned(true);
        } else if (!isHighRisk && !isSuspicious) {
          setHasWarned(false);
        }
      } else {
        // Mock fallback
        setTimeout(() => {
          const amountValue = parseFloat(amount);
          const isHigh = amountValue > 50000;
          const isSusp = amountValue > 10000;
          
          setAnalysis({
            risk_score: Math.floor(Math.random() * 20) + (isHigh ? 60 : isSusp ? 30 : 0),
            status: isHigh ? 'HIGH RISK' : isSusp ? 'SUSPICIOUS' : 'SAFE',
            confidence: 0.85,
            reasons: ["Verified merchant profile", isHigh ? "Extremely high value" : isSusp ? "High value transaction" : "Safe transaction history"]
          });
          
          if (isHigh && !hasWarned) {
            Speech.speak('Danger: This transaction is highly unsafe.');
            Vibration.vibrate([0, 500, 200, 500]);
            setHasWarned(true);
          } else if (isSusp && !hasWarned) {
            Speech.speak('Warning: This transaction has suspicious signals.');
            Vibration.vibrate(500);
            setHasWarned(true);
          }
          startAnimations();
        }, 800);
      }
    } catch (error) {
      console.error('Analysis Error:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Initial and dynamic analysis
    const delayDebounceFn = setTimeout(() => {
      performAnalysis(editableAmount);
    }, 600); // 600ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [editableAmount]);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(ringAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(riskSectionAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };

  if (loading) {
    return (
      <ScreenContainer style={styles.loadingContainer}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#0066FF" />
          <Text style={styles.loadingTitle}>Analyzing AI Risk...</Text>
          <Text style={styles.loadingSubtitle}>Scanning merchant database</Text>
        </View>
      </ScreenContainer>
    );
  }

  // Safely extract analysis data
  const risk_score = analysis?.risk_score || 0;
  const status = analysis?.status || '';
  const reasons = analysis?.reasons || [];
  const confidence = analysis?.confidence || 0;
  const risk_type = analysis?.risk_type || '';
  const riskType = analysis?.riskType || '';
  
  const normalizedStatus = String(status || '').toUpperCase();
  const isSafe = normalizedStatus === 'SAFE' || normalizedStatus === 'LOW';
  const isHighRisk = normalizedStatus === 'HIGH_RISK' || normalizedStatus === 'HIGH RISK' || normalizedStatus === 'HIGH';
  const isSuspicious = normalizedStatus === 'SUSPICIOUS' || normalizedStatus === 'MEDIUM';
  const shouldShowEducationCTA = isHighRisk || isSuspicious;
  
  const getStatusColor = () => {
    if (!analysis) return '#94A3B8';
    if (isSafe) return '#00C853';
    if (isHighRisk) return '#FF1744';
    return '#FF9100'; // SUSPICIOUS = orange
  };

  const getStatusLabel = () => {
    if (!analysis) return 'PENDING';
    if (isSafe) return simpleMode ? 'SAFE' : 'SAFE';
    if (isHighRisk) return simpleMode ? 'DANGER!' : 'HIGH RISK';
    return simpleMode ? 'WARNING!' : 'SUSPICIOUS';
  };

  const getRelatedLessonIndex = () => {
    const combinedSignals = [
      risk_type,
      riskType,
      ...(reasons || []),
      parsedData?.upiId,
      parsedData?.name,
      scanData,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    // Contextual education mapping: risk warning -> specific micro lesson
    if (combinedSignals.includes('qr scam') || combinedSignals.includes('qr fraud') || combinedSignals.includes('qr')) return 1;
    if (combinedSignals.includes('fake merchant') || combinedSignals.includes('merchant mismatch') || combinedSignals.includes('merchant') || combinedSignals.includes('verif')) return 7;
    if (combinedSignals.includes('phishing') || combinedSignals.includes('link') || combinedSignals.includes('url')) return 4;
    if (combinedSignals.includes('pin') || combinedSignals.includes('upi pin')) return 2;
    if (combinedSignals.includes('otp')) return 0;
    if (combinedSignals.includes('kyc')) return 6;
    if (combinedSignals.includes('customer care')) return 3;

    return 0;
  };

  const navigateToEducation = () => {
    navigation.navigate('Learn', { initialLessonIndex: getRelatedLessonIndex() });
  };

  const getStatusIcon = () => {
    if (isSafe) return <ShieldCheck color="#00C853" size={40} />;
    if (isHighRisk) return <ShieldAlert color="#FF1744" size={40} />;
    return <AlertTriangle color="#FF9100" size={40} />;
  };

  const handleProceed = () => {
    navigation.navigate('PaymentOptions', { 
      paymentData: { 
        ...parsedData, 
        amount: editableAmount 
      } 
    });
  };

  return (
    <ScreenContainer>
      <Header title="Analysis Result" showBack onBack={() => navigation.goBack()} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Basic Details Section */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsHeader}>Basic Details</Text>
          <View style={styles.detailRow}>
            <View style={styles.detailIconBg}>
              <User size={18} color="#0066FF" />
            </View>
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>Receiver Name</Text>
              <Text style={styles.detailValue}>{parsedData?.name || 'Unknown Merchant'}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailIconBg}>
              <CreditCard size={18} color="#0066FF" />
            </View>
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>UPI ID</Text>
              <Text style={styles.detailValue}>{parsedData?.upiId || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailIconBg}>
              <Wallet size={18} color="#0066FF" />
            </View>
            <View style={styles.detailInfo}>
              <Text style={styles.detailLabel}>Amount (₹)</Text>
              <TextInput 
                style={styles.amountInput}
                value={String(editableAmount)}
                onChangeText={setEditableAmount}
                keyboardType="numeric"
                placeholder="Enter Amount"
                placeholderTextColor="#CBD5E1"
              />
            </View>
          </View>
        </View>

        <View style={styles.riskHeaderContainer}>
          <View style={styles.riskLine} />
          <Text style={styles.riskAnalysisHeader}>RISK ANALYSIS</Text>
          <View style={styles.riskLine} />
        </View>

        {!analysis ? (
          <View style={styles.waitingContainer}>
             <LinearGradient
               colors={['#F8FAFF', '#F1F5F9']}
               style={styles.waitingCard}
             >
                <Smartphone size={32} color="#94A3B8" />
                <Text style={styles.waitingTitle}>Waiting for Amount</Text>
                <Text style={styles.waitingSubtitle}>Enter an amount above to begin AI risk assessment</Text>
             </LinearGradient>
          </View>
        ) : (
          <Animated.View style={{ 
            width: '100%',
            alignItems: 'center',
            opacity: riskSectionAnim,
            transform: [{ translateY: riskSectionAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }]
          }}>
            <View style={[styles.meterContainer, isRefreshing && { opacity: 0.5 }]}>
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
                    {isRefreshing ? (
                      <ActivityIndicator size="large" color={getStatusColor()} />
                    ) : (
                      <>
                        {getStatusIcon()}
                        <Text style={[styles.scoreText, { color: getStatusColor() }]}>{risk_score}%</Text>
                        <Text style={styles.scoreLabel}>Risk Level</Text>
                      </>
                    )}
                </LinearGradient>
              </View>
            </View>

            <Animated.View style={{ opacity: opacityAnim }}>
              <View style={styles.statusBadgeContainer}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '15', borderColor: getStatusColor() }]}>
                  <Text style={[styles.statusText, { color: getStatusColor() }, simpleMode && { fontSize: 24, fontWeight: '900' }]}>{getStatusLabel()}</Text>
                </View>
              </View>

              {confidence > 0 && !simpleMode && (
                <Text style={styles.confidenceText}>AI Confidence: {Math.round(confidence * 100)}%</Text>
              )}

              <RiskCard 
                score={risk_score} 
                status={getStatusLabel()} 
                reasons={reasons || []}
              />

              <View style={styles.actionContainer}>
                {isSafe ? (
                  <PrimaryButton 
                    title={simpleMode ? "Pay Now" : "Proceed to Pay"}
                    onPress={handleProceed} 
                  />
                ) : (
                  <>
                    <PrimaryButton 
                      title={simpleMode ? "STOP & REPORT SCAM" : "Report this Scam"}
                      onPress={() => navigation.navigate('ReportScam', { 
                        upiId: parsedData?.upiId 
                      })} 
                      style={{ backgroundColor: '#FF1744', marginBottom: 15 }}
                    />
                    {shouldShowEducationCTA && (
                      <SecondaryButton 
                        title="Learn Why This Is Risky" 
                        onPress={navigateToEducation} 
                        style={{ borderColor: '#0066FF', marginBottom: 15 }}
                        textStyle={{ color: '#0066FF' }}
                      />
                    )}
                    <SecondaryButton 
                      title={simpleMode ? "GO BACK" : "Cancel Payment"}
                      onPress={() => navigation.navigate('Home')} 
                    />
                  </>
                )}
              </View>
            </Animated.View>
          </Animated.View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    alignItems: 'center',
  },
  loadingTitle: {
    marginTop: 20,
    fontSize: 18,
    color: '#0066FF',
    fontWeight: '700',
  },
  loadingSubtitle: {
    marginTop: 8,
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
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
  },
  statusBadgeContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: {
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
  },
  confidenceText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 15,
  },
  actionContainer: {
    width: width - 48,
    marginTop: 20,
  },
  detailsCard: {
    width: width - 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  detailsHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  detailIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  amountInput: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0066FF',
    padding: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#E2E8F0',
    width: '60%',
  },
  riskHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 48,
    marginBottom: 20,
  },
  riskLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  riskAnalysisHeader: {
    marginHorizontal: 15,
    fontSize: 14,
    fontWeight: '900',
    color: '#1A1A1A',
    letterSpacing: 1,
  },
  waitingContainer: {
    width: width - 48,
    height: 200,
  },
  waitingCard: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  waitingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#475569',
    marginTop: 15,
    marginBottom: 5,
  },
  waitingSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 18,
  }
});

export default ResultScreen;
