import { useEffect } from 'react';
import { Platform } from 'react-native';
import { parseSms } from '../lib/parser';
import { useTransactions } from '../context/TransactionContext';

// Conditional import for the native module
let SmsListener: any = null;
if (Platform.OS === 'android') {
  try {
    SmsListener = require('react-native-android-sms-listener').default;
  } catch (e) {
    console.warn('SmsListener not found, native module might not be linked yet.');
  }
}

export const useSmsTracker = () => {
  const { transactions, isLoading: loading, addTransaction } = useTransactions();

  useEffect(() => {
    if (Platform.OS !== 'android' || !SmsListener) {
      return;
    }

    const subscription = SmsListener.addListener(async (message: any) => {
      console.log('Incoming SMS:', message.body);
      const transaction = parseSms(message.body);
      
      if (transaction) {
        await addTransaction(transaction);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [addTransaction]);

  // For testing: Simulate receiving an SMS
  const mockSms = async (body: string) => {
    const transaction = parseSms(body);
    if (transaction) {
      await addTransaction(transaction);
    }
  };

  return { transactions, loading, mockSms };
};
