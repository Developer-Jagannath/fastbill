import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThermalPrinter from '../utils/ThermalPrinter';
import {
  printLine,
  rearrangeArray,
  repeatTextToFitLine,
} from '../utils/charachterAllign';
import {getFormattedDateTime} from '../utils/dateAndTime';

const DEFAULT_PRINTER_KEY = 'defaultPrinter';

const PrintScreen = ({route}) => {
  const { bill } = route.params;
  const totalAmount = bill.reduce((total, item) => total + item, 0);
  const [devices, setDevices] = useState([]); // Available devices
  const [connectedDevice, setConnectedDevice] = useState(null); // Currently connected device
  const [defaultPrinter, setDefaultPrinter] = useState(null); // Default printer
  const [loading, setLoading] = useState(false); // Loading state for device discovery
  const [connecting, setConnecting] = useState(false); // Loading state for connecting
  // const data = [10, 11, 12, 13, 14, 15, 16, 17, 18];
  const {date, time} = getFormattedDateTime();
  const billData =
    printLine({
      textLeft: 'SARASWATI GENERAL STORE',
      fontSize: 'tall',
      alignment: 'center',
      newLine: true,
    }) +
    printLine({textLeft: repeatTextToFitLine('-')}) +
    printLine({
      textLeft: 'DATE:' + date,
      textRight: 'TIME:' + time,
    }) +
    printLine({textLeft: repeatTextToFitLine('-')}) +
    rearrangeArray(bill) +
    printLine({textLeft: repeatTextToFitLine('-')}) +
    printLine({
      textLeft: 'TOTAL AMOUNT:',
      textRight: totalAmount.toString(),
      // bold: true,
      fontSize: 'tall',
    }) +
    printLine({textLeft: repeatTextToFitLine('-')}) +
    printLine({
      textLeft: 'TOTAL ITEMS',
      textRight: `${bill.length}`,
    }) +
    "\n"+
    printLine({textLeft: repeatTextToFitLine('-')}) +
    printLine({textLeft: 'Thanks for vist again!', alignment: 'center'})

  useEffect(() => {
    const initialize = async () => {
      await loadDefaultPrinter();
      await discoverDevices();
    };
    initialize();
  }, []);

  // Load default printer from AsyncStorage
  const loadDefaultPrinter = useCallback(async () => {
    try {
      const savedPrinter = await AsyncStorage.getItem(DEFAULT_PRINTER_KEY);
      if (savedPrinter) {
        const parsedPrinter = JSON.parse(savedPrinter);
        setDefaultPrinter(parsedPrinter);
        await autoConnectToPrinter(parsedPrinter);
      }
    } catch (error) {
      console.error('Error loading default printer:', error);
    }
  }, []);

  // Save the default printer to AsyncStorage
  const saveDefaultPrinter = useCallback(async printer => {
    try {
      setDefaultPrinter(printer);
      await AsyncStorage.setItem(DEFAULT_PRINTER_KEY, JSON.stringify(printer));
    } catch (error) {
      console.error('Error saving default printer:', error);
    }
  }, []);

  // Discover Bluetooth devices
  const discoverDevices = useCallback(async () => {
    setLoading(true);
    try {
      const deviceList = await ThermalPrinter.getBluetoothDeviceList();
      setDevices(deviceList);
    } catch (error) {
      console.error('Error discovering devices:', error);
      Alert.alert(
        'Error',
        'Failed to discover devices. Ensure Bluetooth is enabled.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Automatically connect to the default printer
  const autoConnectToPrinter = useCallback(async device => {
    setConnecting(true);
    try {
      await connectToPrinter(device);
    } catch (error) {
      console.error('Error auto-connecting to printer:', error);
    } finally {
      setConnecting(false);
    }
  }, []);

  // Connect to a selected printer
  const connectToPrinter = useCallback(
    async device => {
      setConnecting(true);
      try {
        if (connectedDevice?.macAddress === device.macAddress) {
          Alert.alert(
            'Already Connected',
            `Device ${device.deviceName} is already connected.`,
          );
          return;
        }

        setConnectedDevice(device); // Replace connected device
        saveDefaultPrinter(device); // Set as default printer
        Alert.alert('Connected', `Connected to ${device.deviceName}`);
      } catch (error) {
        console.error('Error connecting to printer:', error);
        Alert.alert(
          'Connection Error',
          `Could not connect to ${device.deviceName}. Ensure the printer is powered on and within range.`,
        );
      } finally {
        setConnecting(false);
      }
    },
    [connectedDevice, saveDefaultPrinter],
  );

  // Print text to the connected printer
  const handlePrint = useCallback(async () => {
    const printerToUse = connectedDevice || defaultPrinter;

    if (!printerToUse) {
      Alert.alert('Error', 'No printer connected.');
      return;
    }

    try {
      await ThermalPrinter.printBluetooth({
        macAddress: printerToUse.macAddress,
        // payload: 'Hello, this is a test print from Bluetooth.\n',
        payload: billData,
        printerDpi: 203,
        printerWidthMM: 80,
        printerNbrCharactersPerLine: 42,
      });
      Alert.alert('Success', 'Printed successfully.');
    } catch (error) {
      console.error('Error printing:', error);
      Alert.alert('Error', 'Failed to print. Check the printer connection.');
    }
  }, [connectedDevice, defaultPrinter]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          title="Discover Printers"
          onPress={discoverDevices}
          disabled={loading}
        />
      )}

      {/* {defaultPrinter && (
        <View style={styles.defaultPrinterSection}>
          <Text style={styles.sectionTitle}>Default Printer</Text>
          <TouchableOpacity style={styles.deviceItem}>
            <Text style={styles.deviceName}>{defaultPrinter.deviceName}</Text>
            <Text style={styles.deviceAddress}>{defaultPrinter.macAddress}</Text>
          </TouchableOpacity>
        </View>
      )} */}

      <Text style={styles.sectionTitle}>Available Devices</Text>
      <FlatList
        data={devices}
        keyExtractor={item => item.macAddress}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.deviceItem,
              connectedDevice?.macAddress === item.macAddress
                ? styles.selectedDevice
                : null,
            ]}
            onPress={() => connectToPrinter(item)}>
            <Text style={styles.deviceName}>
              {item.deviceName || 'Unknown Device'}
            </Text>
            <Text style={styles.deviceAddress}>{item.macAddress}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No devices found. Discover devices!
          </Text>
        }
      />
      <Text>{totalAmount}</Text>
      <Button
        title="Print Test"
        onPress={handlePrint}
        disabled={!connectedDevice}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  deviceItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  selectedDevice: {
    backgroundColor: '#d1e7ff',
  },
  defaultPrinterSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceAddress: {
    fontSize: 14,
    color: '#555',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
});

export default PrintScreen;