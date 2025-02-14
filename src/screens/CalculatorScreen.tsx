import React, {FC, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import CalculatorButton from '../components/UI/CalcultorButton';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from "../navigations/StackNavigator";
import { getFirestore, collection, doc, setDoc } from '@react-native-firebase/firestore'; // Import Firestore methods

type IScreenProps = {
  navigation: StackNavigationProp<MainStackParamList, 'Main'>;
};
const CalculatorScreen: FC<IScreenProps> = ({navigation}) => {
  const [currentInput, setCurrentInput] = useState('0'); // Current input displayed to the user
  const [items, setItems] = useState<number[]>([]); // List of entered items
  const [total, setTotal] = useState(0); // Total amount
  const flatListRef = useRef<FlatList>(null);
  useEffect(() => {
    // Scroll to the end of the FlatList when items change
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  }, [items]);
  const handlePress = (value: string) => {
    if (value === 'C') {
      // Clear all items and reset total
      setCurrentInput('0');
      setItems([]);
      setTotal(0);
    } else if (value === 'AC') {
      // Clear the current input
      setCurrentInput('0');
    } else if (value === '+') {
      // Add current input to the list
      const numericValue = parseFloat(currentInput);
      if (!isNaN(numericValue) && numericValue !== 0) {
        setItems(prevItems => [...prevItems, numericValue]);
        setTotal(prevTotal => prevTotal + numericValue);
        setCurrentInput('0'); // Reset current input
      }
    } else {
      // Update the current input
      setCurrentInput(prev => (prev === '0' ? value : prev + value));
    }
  };

  const handleLongPress = (index: number) => {
    Alert.alert(
      'Remove Item',
      `Do you want to remove ₹${items[index]} from the list?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => {
            setItems(prevItems => prevItems.filter((_, i) => i !== index));
            setTotal(prevTotal => prevTotal - items[index]);
          },
        },
      ],
    );
  };

  const renderItem = ({item, index}: {item: number; index: number}) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.listItem}
      onLongPress={() => handleLongPress(index)}>
      <Text style={styles.listItemText}>₹ {item}</Text>
    </TouchableOpacity>
  );

  // Function to save data to Firestore
  const saveToFirestore = async () => {
    try {
      const uid = Date.now(); // Use a unique ID for the document
      const billData = {
        items,
        total,
        createdAt: new Date(),
        name:"unknown",
        invoice:Date.now(),
        updatedAt:new Date(),
        paymentStatus:"paid",
      };

      const db = getFirestore(); // Get Firestore instance
      await setDoc(doc(collection(db, 'bills'), uid.toString()), billData); // Save the bill data

      Alert.alert('Success', 'Bill saved successfully!');
    } catch (error) {
      console.error('Error saving bill:', error);
      Alert.alert('Error', 'Failed to save bill. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Display Section */}
      <View style={styles.billWrapper}>
        <FlatList
          data={items}
          ref={flatListRef} // Attach the ref to the FlatList
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No items added</Text>
          }
          contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}}
        />
      </View>

      {/* Total Section */}
      <View style={styles.totalWrapper}>
        <Text style={{fontSize: 18}}>Total:</Text>
        <Text style={{fontSize: 28, fontWeight: '600'}}>₹ {total}</Text>
      </View>
      {/* Current Input Display */}
      <View style={styles.currentInputWrapper}>
        <Text style={{fontSize: 16}}>Total Items: {items.length}</Text>
        <Text style={styles.currentInputText}>{currentInput}</Text>
      </View>
     
      {/* Buttons Section */}
      <View style={styles.buttons}>
        {/* Row 1 */}
        <View style={styles.row}>
          <CalculatorButton
            label="C"
            onPress={() => handlePress('C')}
            backgroundColor="#FF4C4C"
            textColor="#fff"
          />
          <CalculatorButton
            label="AC"
            onPress={() => handlePress('AC')}
            backgroundColor="#FFA500"
            textColor="#fff"
          />
          <CalculatorButton
            label="S"
            onPress={() =>saveToFirestore()}
            backgroundColor="#4C6FFF"
            textColor="#fff"
          />
        </View>
        {/* Row 2 */}
        <View style={styles.row}>
          <CalculatorButton label="7" onPress={() => handlePress('7')} />
          <CalculatorButton label="8" onPress={() => handlePress('8')} />
          <CalculatorButton label="9" onPress={() => handlePress('9')} />
        </View>
        {/* Row 3 */}
        <View style={styles.row}>
          <CalculatorButton label="4" onPress={() => handlePress('4')} />
          <CalculatorButton label="5" onPress={() => handlePress('5')} />
          <CalculatorButton label="6" onPress={() => handlePress('6')} />
        </View>
        {/* Row 4 */}
        <View style={styles.row}>
          <CalculatorButton label="1" onPress={() => handlePress('1')} />
          <CalculatorButton label="2" onPress={() => handlePress('2')} />
          <CalculatorButton label="3" onPress={() => handlePress('3')} />
        </View>
        {/* Row 5 */}
        <View style={styles.row}>
          <CalculatorButton
            label="PR"
            onPress={()=>navigation.navigate('Print',{bill:items})}
          />
          <CalculatorButton label="0" onPress={() => handlePress('0')} />
          <CalculatorButton
            label="+"
            onPress={() => handlePress('+')}
            backgroundColor="#4C6FFF"
            textColor="#fff"
          />
        </View>
       
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  currentInputWrapper: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    // alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currentInputText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  billWrapper: {
    flex: 1,
    padding: 16,
  },
  emptyListText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
  listItem: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginVertical: 4,
  },
  listItemText: {
    fontSize: 18,
    color: '#000',
  },
  totalWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  buttons: {
    backgroundColor: '#eaeaea',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default CalculatorScreen;