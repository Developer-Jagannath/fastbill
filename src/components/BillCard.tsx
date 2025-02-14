import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Rect} from 'react-native-safe-area-context';

interface IProps {
  name?: string;
  invoice?: string;
  data?: string;
  amount?: number;
  date: string;
  paymentStatus?: 'Paid' | 'Unpaid' | 'Partial';
}

const BillCard: React.FC<IProps> = ({
  name,
  invoice,
  data,
  amount,
  date,
  paymentStatus = 'Paid',
}) => {
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', gap: 20}}>
        <View style={styles.invoiceWrapper}>
          <Icon name="file-invoice" size={30} color="dark" />
        </View>
        <View style={styles.detailsWrapper}>
          <Text style={styles.titleText}>{name}</Text>
          <Text style={styles.invoiceText}>{invoice}</Text>
          <Text style={styles.timeText}>{data}</Text>
          <Text style={styles.dateText}>{date}</Text>
        </View>
      </View>

      <View style={styles.amountWrapper}>
        <Text style={styles.amountText}>₹ {amount}</Text>
        <View style={styles.paymentWrapper}>
          <Text style={styles.paymentText}>{paymentStatus}</Text>
        </View>
      </View>
    </View>
  );
};

export default BillCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginHorizontal: 10,
    marginTop: 5,
    borderRadius: 5,
  },
  invoiceWrapper: {
    backgroundColor: '#e5e7eb',
    padding: 10,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  detailsWrapper: {
    flexDirection: 'column',
    gap: 5,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  invoiceText: {
    fontSize: 14,
    fontWeight: 400,
    color: '#60a5fa',
  },
  timeText: {
    fontSize: 13,
    fontWeight: 400,
    // color: '#4b5563',
    color: '#9ca3af',
  },
  dateText: {
    fontSize: 13,
    fontWeight: 400,
    color: '#9ca3af',
  },
  amountWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 10,
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  paymentWrapper: {
    backgroundColor: '#bbf7d0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
  },
  paymentText: {
    color: '#16a34a',
  },
});