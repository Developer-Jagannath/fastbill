import {Button, StyleSheet, View, FlatList} from 'react-native';
import React from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../navigations/StackNavigator';
import BillCard from '../components/BillCard';
import RoundButton from '../components/RoundButton';
import SearchBox from '../components/UI/SearchBox';

type HomeScreenProps = {
  navigation: StackNavigationProp<MainStackParamList, 'Main'>;
};

// Define the type for the bill item
interface BillItem {
  id: string;
  userName: string;
  invoiceNumber: string;
  amount: number;
  date: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const handleCalculatore = () => {
    navigation.navigate('calculator');
  };

  // Sample data for 30 users
  const sampleData: BillItem[] = Array.from({length: 30}, (_, index) => ({
    id: index.toString(),
    userName: `User ${index + 1}`,
    invoiceNumber: `INV-${index + 1}`,
    amount: Math.floor(Math.random() * 1000) + 100, // Random amount between 100 and 1100
    date: `25, May 2024, ${Math.floor(Math.random() * 12) + 1}:00 PM`, // Random date and time
  }));

  const renderItem = ({item}: {item: BillItem}) => (
    <BillCard
      name={item.userName}
      invoice={item.invoiceNumber}
      amount={item.amount}
      data={item.date}
    />
  );

  return (
    <View style={styles.container}>
      <SearchBox
        placeholder="Search invoice number..."
        // onSearch={handleSearch}
        // value={searchText}
      />
      <FlatList
        data={sampleData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingBottom: 100}} // Add padding for bottom
      />
      <View style={styles.toggleWrapper}>
        <RoundButton onPress={handleCalculatore} />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggleWrapper: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
});