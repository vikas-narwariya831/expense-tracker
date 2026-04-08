import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { parseSms, Transaction } from '../lib/parser';
import { getTransactions, saveTransaction } from '../lib/storage';

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    getTransactions().then((data) => {
      setTransactions(data);
      setLoading(false);
    });

    if (Platform.OS !== 'android' || !SmsListener) {
      console.log('Sms Tracking is only available on Android.');
      return;
    }

    const subscription = SmsListener.addListener((message: any) => {
      console.log('Incoming SMS:', message.body);
      const transaction = parseSms(message.body);
      
      if (transaction) {
        saveTransaction(transaction).then(updatedList => {
          setTransactions(updatedList);
        });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // For testing: Simulate receiving an SMS
  const mockSms = (body: string) => {
    const transaction = parseSms(body);
    if (transaction) {
      saveTransaction(transaction).then(updatedList => {
        setTransactions(updatedList);
      });
    }
  };

  return { transactions, loading, mockSms };
};
