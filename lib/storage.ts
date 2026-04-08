import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from './parser';

const STORAGE_KEY = '@transactions_data';

export const saveTransaction = async (transaction: Transaction) => {
  try {
    const existingData = await getTransactions();
    // Prevent duplicates based on raw SMS and timestamp (if close together)
    const isDuplicate = existingData.some(
      (t) => t.rawSms === transaction.rawSms && 
      Math.abs(new Date(t.date).getTime() - new Date(transaction.date).getTime()) < 60000
    );

    if (isDuplicate) return existingData;

    const newData = [transaction, ...existingData];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    return newData;
  } catch (e) {
    console.error('Failed to save transaction', e);
    return [];
  }
};

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to fetch transactions', e);
    return [];
  }
};

export const clearTransactions = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear storage', e);
  }
};
