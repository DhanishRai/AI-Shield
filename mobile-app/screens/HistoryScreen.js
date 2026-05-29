import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Header from '../components/Header';
import ListItem from '../components/ListItem';

const HistoryScreen = ({ navigation }) => {
  const historyData = [
    { id: '1', title: 'Unknown Merchant', subtitle: 'upi://pay?pa=scammer@okaxis', status: 'High Risk', date: '24 Apr 2026, 10:30 PM' },
    { id: '2', title: 'Reliance Digital', subtitle: 'reliance@okhdfc', status: 'Safe', date: '22 Apr 2026, 04:15 PM' },
    { id: '3', title: 'Local Tea Stall', subtitle: 'chaiwala@upi', status: 'Safe', date: '21 Apr 2026, 08:45 AM' },
    { id: '4', title: 'Lottery Winner Dept', subtitle: 'win10000@paytm', status: 'Risk', date: '20 Apr 2026, 12:20 PM' },
    { id: '5', title: 'Amazon Pay', subtitle: 'amazon@apl', status: 'Safe', date: '18 Apr 2026, 06:10 PM' },
  ];

  return (
    <ScreenContainer>
      <Header title="Scan History" showBack onBack={() => navigation.goBack()} />
      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <ListItem 
            title={item.title}
            subtitle={item.subtitle}
            status={item.status}
            date={item.date}
            onPress={() => navigation.navigate('Result', { historyId: item.id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No scan history found.</Text>
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
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});

export default HistoryScreen;
