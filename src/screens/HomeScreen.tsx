import {
  Button,
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../navigations/StackNavigator';
import BillCard from '../components/BillCard';
import RoundButton from '../components/RoundButton';
import SearchBox from '../components/UI/SearchBox';
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from '@react-native-firebase/firestore'; // Import Firestore methods

type HomeScreenProps = {
  navigation: StackNavigationProp<MainStackParamList, 'Home'>;
};

// Define the type for the bill item
interface BillItem {
  id: string;
  name: string;
  invoice: string;
  amount: number;
  updatedAt: any; // Keep as 'any' for Firestore timestamp
  profit: number;
}

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const [bills, setBills] = useState<BillItem[]>([]); // State to hold bills data
  const [todayTotal, setTodayTotal] = useState<number>(0); // State to hold today's total amount
  const [extraProfit, setExtraProfit] = useState<number>(0); // State to hold today's total amount
  const [refreshing, setRefreshing] = useState<boolean>(false); // State for refreshing

  const handleCalculatore = () => {
    navigation.navigate('calculator');
  };

  // Fetch today's bills data from Firestore
  const fetchTodaysBills = async () => {
    try {
      const db = getFirestore();
      const billsCollection = collection(db, 'bills');

      // Calculate the start and end of today
      const today = new Date();
      const todayStart = new Date(
        Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate(),
        ),
      );
      const todayEnd = new Date(todayStart);
      todayEnd.setUTCDate(todayEnd.getUTCDate() + 1); // End of today

      // Create a query to fetch bills updated today
      const billsQuery = query(
        billsCollection,
        where('updatedAt', '>=', todayStart),
        where('updatedAt', '<', todayEnd),
      );
      const billSnapshot = await getDocs(billsQuery);
      const billList = billSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          invoice: data.invoice,
          amount: data.total,
          profit: data.profit,
          updatedAt: data.updatedAt, // Keep as Firestore timestamp
        } as BillItem; // Cast to BillItem type
      });
      setBills(billList);
      calculateTodayTotal(billList); // Calculate today's total after fetching bills
      calculateExtraProfit(billList); // Calculate today's total after fetching bills
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  // Calculate total amount of today's bills
  const calculateTodayTotal = (bills: BillItem[]) => {
    const total = bills.reduce((sum, bill) => {
      return sum + bill.amount;
    }, 0);

    setTodayTotal(total);
  };

  // Calculate total amount of today's bills
  const calculateExtraProfit = (bills: BillItem[]) => {
    const total = bills.reduce((sum, bill) => {
      return sum + bill.profit;
    }, 0);
    setExtraProfit(total);
  };
  // Refresh function
  const onRefresh = () => {
    setRefreshing(true);
    fetchTodaysBills().then(() => setRefreshing(false)); // Fetch bills and stop refreshing
  };

  useEffect(() => {
    fetchTodaysBills(); // Fetch today's bills when the component mounts
  }, []);

  const renderItem = ({item}: {item: BillItem}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('CalculatorUpdate', {invoice: item.invoice})
      }>
      <BillCard
        name={item.name}
        invoice={item.invoice}
        amount={item.amount}
        profit={item.profit}
        date={item.updatedAt.toDate().toLocaleString()} // Format the date for display
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SearchBox
        placeholder="Search invoice number..."
        // onSearch={handleSearch}
        // value={searchText}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 10,
          backgroundColor:"white",
          padding:10,
          borderRadius:10
        }}>
        <Text style={styles.todayTotalText}>
          Today's Total: ₹ {todayTotal.toString()}
        </Text>
        <Text style={{...styles.todayTotalText,color:"green"}}>
          Extra Profit: ₹ {extraProfit.toString()}
        </Text>
      </View>
      <FlatList
        data={[...bills].reverse()}
        renderItem={renderItem}
        keyExtractor={item => item.invoice}
        contentContainerStyle={{paddingBottom: 100}} // Add padding for bottom
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
  todayTotalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
});
