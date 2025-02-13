import { NativeModules } from 'react-native';

type BluetoothPrinter = {
  deviceName: string;
  macAddress: string;
};

type NativeModuleType = typeof NativeModules & {
  ThermalPrinterModule: {
    printTcp(
      ip: string,
      port: number,
      payload: string,
      autoCut: boolean,
      openCashbox: boolean,
      mmFeedPaper: number,
      printerDpi: number,
      printerWidthMM: number,
      printerNbrCharactersPerLine: number,
      timeout: number
    ): Promise<void>;
    printBluetooth(
      macAddress: string,
      payload: string,
      autoCut: boolean,
      openCashbox: boolean,
      mmFeedPaper: number,
      printerDpi: number,
      printerWidthMM: number,
      printerNbrCharactersPerLine: number
    ): Promise<void>;
    getBluetoothDeviceList(): Promise<BluetoothPrinter[]>;
  };
};

const { ThermalPrinterModule }: NativeModuleType =
  NativeModules as NativeModuleType;

const defaultConfig = {
  macAddress: '',
  ip: '192.168.0.100',
  port: 9100,
  payload: '',
  autoCut: true,
  openCashbox: false,
  mmFeedPaper: 5,
  printerDpi: 203,
  printerWidthMM: 80,
  printerNbrCharactersPerLine: 42,
  timeout: 30000,
};

const getConfig = (args: Partial<typeof defaultConfig>) => {
  return { ...defaultConfig, ...args };
};

const printBluetooth = async (args: Partial<typeof defaultConfig>) => {
  const {
    macAddress,
    payload,
    autoCut,
    openCashbox,
    mmFeedPaper,
    printerDpi,
    printerWidthMM,
    printerNbrCharactersPerLine,
  } = getConfig(args);

  if (!macAddress) {
    throw new Error('Bluetooth MAC address is required.');
  }

  return ThermalPrinterModule.printBluetooth(
    macAddress,
    payload,
    autoCut,
    openCashbox,
    mmFeedPaper,
    printerDpi,
    printerWidthMM,
    printerNbrCharactersPerLine
  );
};

const getBluetoothDeviceList = (): Promise<BluetoothPrinter[]> => {
  return ThermalPrinterModule.getBluetoothDeviceList();
};

export default {
  printBluetooth,
  getBluetoothDeviceList,
};