import React, {FC, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Button,
  Modal,
  TextInput,
} from 'react-native';
import CalculatorButton from '../components/UI/CalcultorButton';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import {MainStackParamList} from '../navigations/StackNavigator';
import firestore, {
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from '@react-native-firebase/firestore'; // Import Firestore

// Define the props type for CalculatorUpdateScreen
type CalculatorUpdateScreenProps = StackScreenProps<
  MainStackParamList,
  'CalculatorUpdate'
>;
const CalculatorUpdateScreen: React.FC<CalculatorUpdateScreenProps> = ({
  navigation,
  route,
}) => {
  const [currentInput, setCurrentInput] = useState('0'); // Current input displayed to the user
  const [items, setItems] = useState<number[]>([]); // List of entered items
  const [total, setTotal] = useState(0); // Total amount
  const flatListRef = useRef<FlatList>(null);
  const {invoice} = route.params;
  const [profitInput, setProfitInput] = useState(''); // State for profit input
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  useEffect(() => {
    // Scroll to the end of the FlatList when items change
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  }, [items]);
  useLayoutEffect(() => {
    fetchBillData();
  }, []);
  const fetchBillData = async () => {
    try {
      if (!invoice) {
        console.error('Invoice ID is missing or invalid');
        return;
      }
      const db = getFirestore();
      const billDocRef = db.collection('bills');
      const querySnapshot = await getDocs(billDocRef);
      querySnapshot.forEach(doc => {
        if (doc.id == invoice) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, ' => ', doc.data());
          setItems(doc.data().items);
          setTotal(doc.data().total);
          setProfitInput(doc.data().profit.toString());
        }
      });
    } catch (error) {
      console.error('Error fetching bill data:', error);
    }
  };
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
  const saveToFirestore = async (profit: number) => {
    try {
      const db = getFirestore();
      // const billDocRef = doc(db, 'bills', invoice); // Reference to the document
      // Check if invoice is defined and is a string
      // if (typeof invoice !== 'string' || !invoice) {
      //   Alert.alert('Error', 'Invalid invoice ID');
      //   return; // Exit the function if invoice is invalid
      // }
      const uid = invoice.toString();
      // Update the document with new values
      console.log("invoice",typeof uid)
      await firestore()
        .collection('bills')
        .doc(uid) // Ensure invoice is a valid string
        .update(
          {
            total,
            profit,
            items, // Ensure items is an array or a valid field
            updatedAt: new Date(), // Update the timestamp
          }
        );

      Alert.alert('Success', 'Bill updated successfully!');
    } catch (error) {
      console.error('Error saving bill:', error);
      Alert.alert('Error', 'Failed to save bill. Please try again.');
    }
  };
  // Function to handle the "S" button click
  const handleProfitInput = () => {
    setModalVisible(true); // Show the modal
  };

  // Function to handle profit submission
  const handleProfitSubmit = () => {
    console.log('Profit saved:', profitInput);
    setProfitInput(''); // Clear the input
    setModalVisible(false); // Hide the modal
    const profitAmount = profitInput.trim() === '' ? 0 : Number(profitInput);
    saveToFirestore(profitAmount);
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
            onPress={handleProfitInput} // Call the profit input function
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
            onPress={() => navigation.navigate('Print', {bill: items})}
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
      {/* Profit Input Modal */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Enter Profit</Text>
          <TextInput
            style={styles.input}
            placeholder="Profit Amount"
            keyboardType="numeric"
            value={profitInput}
            onChangeText={setProfitInput}
            placeholderTextColor="#bfbfbf"
          />
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
            <Button title="Save" onPress={handleProfitSubmit} />
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 20,
    width: '80%',
    paddingHorizontal: 10,
    color: '#000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
});

export default CalculatorUpdateScreen;
