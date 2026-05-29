import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Dimensions, Animated, Image } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { ShieldCheck, Mail, Phone, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [useEmail, setUseEmail] = useState(false);
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleAuth = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Home');
    }, 1500);
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.topBranding}>
            <LinearGradient
              colors={['#0066FF', '#00D1FF']}
              style={styles.logoCircle}
            >
              <ShieldCheck color="#FFFFFF" size={60} strokeWidth={2.5} />
            </LinearGradient>
            <Text style={styles.brandName}>PAYNOVA</Text>
            <Text style={styles.brandTagline}>YOUR SECURE FINTECH PARTNER</Text>
          </View>

          <View style={styles.formSection}>
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tab, !useEmail && styles.activeTab]} 
                onPress={() => setUseEmail(false)}
              >
                <Phone size={18} color={!useEmail ? '#0066FF' : '#94A3B8'} />
                <Text style={[styles.tabText, !useEmail && styles.activeTabText]}>Mobile</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, useEmail && styles.activeTab]} 
                onPress={() => setUseEmail(true)}
              >
                <Mail size={18} color={useEmail ? '#0066FF' : '#94A3B8'} />
                <Text style={[styles.tabText, useEmail && styles.activeTabText]}>Email</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Join Paynova'}</Text>
            
            <View style={styles.form}>
              {useEmail ? (
                <InputField
                  label="Email Address"
                  placeholder="name@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              ) : (
                <InputField
                  label="Mobile Number"
                  placeholder="000 000 0000"
                  value={mobile}
                  onChangeText={setMobile}
                  keyboardType="phone-pad"
                />
              )}

              <PrimaryButton
                title={isLogin ? 'Continue Securely' : 'Create My Account'}
                onPress={handleAuth}
                loading={loading}
                style={styles.button}
              />

              <View style={styles.dividerRow}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.line} />
              </View>

              <TouchableOpacity style={styles.googleBtn} activeOpacity={0.7}>
                <Image 
                  source={{ uri: 'https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png' }} 
                  style={styles.googleIcon} 
                />
                <Text style={styles.googleBtnText}>Continue with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.toggleLinkContainer} 
                onPress={() => setIsLogin(!isLogin)}
              >
                <Text style={styles.toggleText}>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <Text style={styles.toggleLink}>{isLogin ? 'Sign Up' : 'Log In'}</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.exploreSection}>
            <Text style={styles.exploreTitle}>Explore More</Text>
            <TouchableOpacity style={styles.exploreItem}>
              <View style={styles.exploreIcon}>
                 <ShieldCheck size={20} color="#0066FF" />
              </View>
              <Text style={styles.exploreText}>Security Benefits</Text>
              <ChevronRight size={18} color="#94A3B8" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.exploreItem}>
              <View style={styles.exploreIcon}>
                 <Phone size={20} color="#0066FF" />
              </View>
              <Text style={styles.exploreText}>Help & Support</Text>
              <ChevronRight size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>🛡️ SECURED BY ENCRYPTED AI CHANNELS</Text>
            <Text style={styles.footerSub}>By continuing, you agree to our Terms & Privacy Policy</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  topBranding: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.45, // Occupies nearly half the screen to keep logo centered
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
  },
  brandName: {
    fontSize: 36,
    fontWeight: '900',
    color: '#003366',
    letterSpacing: 3,
    marginTop: 20,
  },
  brandTagline: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 8,
  },
  formSection: {
    paddingHorizontal: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 25,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#0066FF',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: 10,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingVertical: 15,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleBtnText: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '700',
  },
  toggleLinkContainer: {
    marginTop: 25,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    color: '#64748B',
  },
  toggleLink: {
    color: '#0066FF',
    fontWeight: '800',
  },
  exploreSection: {
    marginTop: 40,
    paddingHorizontal: 24,
  },
  exploreTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  exploreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  exploreIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  exploreText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  footerText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  footerSub: {
    fontSize: 11,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default AuthScreen;
