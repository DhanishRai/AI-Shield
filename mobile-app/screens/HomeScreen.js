import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated, Image, Platform } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { Scan, History, ShieldAlert, Search, ArrowRight, User, Wallet, CreditCard, Smartphone, ShieldCheck, Bell } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const people = [
    { id: 'p1', name: 'Rajesh', color: '#FF6B6B' },
    { id: 'p2', name: 'Sneha', color: '#4ECDC4' },
    { id: 'p3', name: 'Amit', color: '#45B7D1' },
    { id: 'p4', name: 'Priya', color: '#F7D794' },
    { id: 'p5', name: 'Rahul', color: '#786FA6' },
  ];

  const transactions = [
    { id: 't1', name: 'Amazon India', amount: '- ₹1,299', status: 'Safe', icon: '🛒' },
    { id: 't2', name: 'Starbucks', amount: '- ₹350', status: 'Safe', icon: '☕' },
    { id: 't3', name: 'Unknown User', amount: '- ₹5,000', status: 'Risk', icon: '❓' },
  ];

  return (
    <ScreenContainer style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileBtn}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80' }} 
            style={styles.profileImg} 
          />
        </TouchableOpacity>
        
        <View style={styles.headerLogo}>
          <LinearGradient
            colors={['#0066FF', '#00D1FF']}
            style={styles.smallLogo}
          >
            <ShieldCheck color="#FFFFFF" size={18} strokeWidth={2.5} />
          </LinearGradient>
          <Text style={styles.logoText}>PAYNOVA</Text>
        </View>

        <TouchableOpacity style={styles.notifBtn}>
          <Bell color="#003366" size={24} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color="#94A3B8" size={20} />
          <Text style={styles.searchInput}>Pay anyone on UPI</Text>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={true}
          alwaysBounceVertical={true}
          scrollEnabled={true}
        >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <LinearGradient
            colors={['#1A237E', '#0D47A1']}
            style={styles.mainCard}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Protection Shield Active</Text>
              <ShieldAlert color="#00E5FF" size={20} />
            </View>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>₹24,850.00</Text>
            
            <View style={styles.cardFooter}>
              <View style={styles.footerItem}>
                <ShieldCheck color="#00E5FF" size={14} />
                <Text style={styles.footerText}>AI Secured</Text>
              </View>
              <View style={[styles.footerItem, { marginLeft: 15 }]}>
                <Text style={styles.footerText}>Last scan: 2m ago</Text>
              </View>
            </View>
          </LinearGradient>

          <Text style={styles.sectionTitle}>Security Insights</Text>
          <ScrollView 
            horizontal={true} 
            showsHorizontalScrollIndicator={false} 
            pagingEnabled={true}
            style={styles.bannerCarousel}
          >
            <LinearGradient colors={['#FF9966', '#FF5E62']} style={styles.promoBanner}>
              <View style={styles.bannerInfo}>
                <Text style={styles.bannerText}>AI Link Checker</Text>
                <Text style={styles.bannerSub}>Scan links before clicking to stay safe.</Text>
              </View>
              <ShieldCheck color="#FFFFFF" size={40} opacity={0.8} />
            </LinearGradient>
            <LinearGradient colors={['#00F260', '#0575E6']} style={styles.promoBanner}>
              <View style={styles.bannerInfo}>
                <Text style={styles.bannerText}>Secure Rewards</Text>
                <Text style={styles.bannerSub}>Earn cashback on safe transactions.</Text>
              </View>
              <Smartphone color="#FFFFFF" size={40} opacity={0.8} />
            </LinearGradient>
            <LinearGradient colors={['#8E2DE2', '#4A00E0']} style={styles.promoBanner}>
              <View style={styles.bannerInfo}>
                <Text style={styles.bannerText}>24/7 Monitoring</Text>
                <Text style={styles.bannerSub}>Real-time protection for your wallet.</Text>
              </View>
              <ShieldAlert color="#FFFFFF" size={40} opacity={0.8} />
            </LinearGradient>
          </ScrollView>

          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Scanner')}>
              <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
                <Scan color="#1976D2" size={24} />
              </View>
              <Text style={styles.actionLabel}>Scan QR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('History')}>
              <View style={[styles.actionIcon, { backgroundColor: '#F3E5F5' }]}>
                <History color="#7B1FA2" size={24} />
              </View>
              <Text style={styles.actionLabel}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
                <Smartphone color="#388E3C" size={24} />
              </View>
              <Text style={styles.actionLabel}>Recharge</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
                <ShieldAlert color="#F57C00" size={24} />
              </View>
              <Text style={styles.actionLabel}>Reports</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>People & Contacts</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.peopleScroll}>
            {people.map((person) => (
              <TouchableOpacity key={person.id} style={styles.personItem} onPress={() => navigation.navigate('PaymentOptions', { person: person.name })}>
                <View style={[styles.avatar, { backgroundColor: person.color }]}>
                  <Text style={styles.avatarText}>{person.name.charAt(0)}</Text>
                </View>
                <Text style={styles.personName}>{person.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.personItem}>
              <View style={[styles.avatar, { backgroundColor: '#F0F0F0' }]}>
                <ArrowRight color="#666" size={20} />
              </View>
              <Text style={styles.personName}>More</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.txHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {transactions.map((tx) => (
            <TouchableOpacity key={tx.id} style={styles.txItem} onPress={() => navigation.navigate('Result', { scanData: tx.name })}>
              <View style={styles.txIconBg}>
                <Text style={styles.txEmoji}>{tx.icon}</Text>
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txName}>{tx.name}</Text>
                <View style={styles.txStatusRow}>
                  <View style={[styles.statusDot, { backgroundColor: tx.status === 'Safe' ? '#00C853' : '#FF1744' }]} />
                  <Text style={styles.txStatusText}>{tx.status} Payment</Text>
                </View>
              </View>
              <Text style={[styles.txAmount, { color: tx.status === 'Safe' ? '#1A1A1A' : '#FF1744' }]}>
                {tx.amount}
              </Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.sectionTitle}>Help & Support</Text>
          <View style={styles.supportGrid}>
            <TouchableOpacity style={styles.supportItem}>
              <View style={styles.supportIcon}>
                <ShieldCheck color="#666" size={20} />
              </View>
              <Text style={styles.supportLabel}>Security Center</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.supportItem}>
              <View style={styles.supportIcon}>
                <ShieldAlert color="#666" size={20} />
              </View>
              <Text style={styles.supportLabel}>Report Fraud</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.supportItem}>
              <View style={styles.supportIcon}>
                <Smartphone color="#666" size={20} />
              </View>
              <Text style={styles.supportLabel}>Contact Us</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>More Options</Text>
          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionContent}>
              <Wallet color="#666" size={20} />
              <Text style={styles.optionText}>Manage Bank Accounts</Text>
            </View>
            <ArrowRight color="#CCC" size={18} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionContent}>
              <User color="#666" size={20} />
              <Text style={styles.optionText}>Profile Settings</Text>
            </View>
            <ArrowRight color="#CCC" size={18} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem}>
            <View style={styles.optionContent}>
              <ShieldCheck color="#666" size={20} />
              <Text style={styles.optionText}>Privacy Policy</Text>
            </View>
            <ArrowRight color="#CCC" size={18} />
          </TouchableOpacity>

        </Animated.View>
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>

      <TouchableOpacity 
        style={styles.scanFab}
        onPress={() => navigation.navigate('Scanner')}
      >
        <LinearGradient
          colors={['#0066FF', '#00D1FF']}
          style={styles.fabGradient}
        >
          <Scan color="#FFFFFF" size={28} strokeWidth={2.5} />
          <Text style={styles.fabText}>SCAN & PAY</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'transparent',
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    marginLeft: 12,
    color: '#94A3B8',
    fontSize: 15,
    fontWeight: '600',
  },
  smallLogo: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#003366',
    letterSpacing: 1,
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  profileImg: {
    width: '100%',
    height: '100%',
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100,
  },
  mainCard: {
    borderRadius: 30,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#1A237E',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    color: '#00E5FF',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  balanceLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginTop: 5,
  },
  cardFooter: {
    flexDirection: 'row',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  peopleScroll: {
    marginBottom: 20,
    marginLeft: -5,
  },
  personItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  personName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionCard: {
    width: (width - 60) / 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1A1A1A',
    textTransform: 'uppercase',
  },
  txHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeAll: {
    color: '#0066FF',
    fontWeight: '700',
    fontSize: 13,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  txIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  txEmoji: {
    fontSize: 20,
  },
  txInfo: {
    flex: 1,
  },
  txName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  txStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  txStatusText: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '800',
  },
  bannerCarousel: {
    marginBottom: 20,
    marginHorizontal: -20,
    paddingLeft: 20,
  },
  promoBanner: {
    width: width - 80,
    height: 80,
    borderRadius: 20,
    marginRight: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  bannerInfo: {
    flex: 1,
    marginRight: 10,
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  bannerSub: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  scanFab: {
    position: 'absolute',
    bottom: 25,
    alignSelf: 'center',
    borderRadius: 30,
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30,
  },
  fabText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
    marginLeft: 10,
    letterSpacing: 1,
  },
  supportGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  supportItem: {
    width: (width - 60) / 3.2,
    backgroundColor: '#F8FAFC',
    borderRadius: 15,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  supportIcon: {
    marginBottom: 6,
  },
  supportLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginLeft: 12,
  },
});

export default HomeScreen;
