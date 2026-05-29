import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import ListItem from '../components/ListItem';
import { getHistory } from '../services/api';

const HistoryScreen = ({ navigation }) => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      const result = await getHistory('demo-user');
      if (result.success && result.data) {
        setHistoryData(result.data);
      }
    } catch (error) {
      console.log('History fetch failed, using local data:', error.message);
      // Fallback to mock data if backend is not reachable
      setHistoryData([
        { _id: '1', merchantName: 'Unknown Merchant', upiId: 'scammer@okaxis', status: 'HIGH_RISK', riskScore: 92, scannedAt: new Date().toISOString() },
        { _id: '2', merchantName: 'Reliance Digital', upiId: 'reliance@okhdfc', status: 'SAFE', riskScore: 5, scannedAt: new Date().toISOString() },
        { _id: '3', merchantName: 'Local Tea Stall', upiId: 'chaiwala@upi', status: 'SAFE', riskScore: 0, scannedAt: new Date().toISOString() },
        { _id: '4', merchantName: 'Lottery Winner Dept', upiId: 'win10000@paytm', status: 'HIGH_RISK', riskScore: 97, scannedAt: new Date().toISOString() },
        { _id: '5', merchantName: 'Amazon Pay', upiId: 'amazon@apl', status: 'SAFE', riskScore: 3, scannedAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHistory();
  }, []);

  const getStatusLabel = (status) => {
    if (status === 'SAFE') return 'Safe';
    if (status === 'SUSPICIOUS') return 'Suspicious';
    return 'Risk';
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { 
        day: 'numeric', month: 'short', year: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
      });
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <ScreenContainer>
        <Header title="Scan History" showBack onBack={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066FF" />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Header title="Scan History" showBack onBack={() => navigation.goBack()} />
      <FlatList
        data={historyData}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0066FF']} />
        }
        renderItem={({ item }) => (
          <ListItem 
            title={item.merchantName || 'Unknown'}
            subtitle={item.upiId}
            status={getStatusLabel(item.status)}
            date={formatDate(item.scannedAt)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No scan history found.</Text>
            <Text style={styles.emptySubtext}>Scan a QR code to get started!</Text>
          </View>
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#CBD5E1',
    fontSize: 13,
    marginTop: 8,
  },
});

export default HistoryScreen;
