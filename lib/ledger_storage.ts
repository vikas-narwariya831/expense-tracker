import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LedgerEntry {
  id: string;
  amount: number;
  type: 'gave' | 'got';
  date: string;
  note: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  entries: LedgerEntry[];
  netBalance: number; // Positive = You Get (Red), Negative = You Give (Green)
}

const STORAGE_KEY = '@khatabook_customers';

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error fetching customers', e);
    return [];
  }
};

export const saveCustomer = async (name: string, phone: string): Promise<Customer[]> => {
  const customers = await getCustomers();
  const newCustomer: Customer = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    phone,
    entries: [],
    netBalance: 0,
  };
  const updated = [...customers, newCustomer];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const addLedgerEntry = async (customerId: string, amount: number, type: 'gave' | 'got', note: string): Promise<Customer[]> => {
  const customers = await getCustomers();
  const updated = customers.map(c => {
    if (c.id === customerId) {
      const newEntry: LedgerEntry = {
        id: Math.random().toString(36).substr(2, 9),
        amount,
        type,
        date: new Date().toISOString(),
        note,
      };
      const entries = [...c.entries, newEntry];
      // Update balance: Gave increases what we get (positive), Got decreases it (negative)
      const balanceChange = type === 'gave' ? amount : -amount;
      return { ...c, entries, netBalance: c.netBalance + balanceChange };
    }
    return c;
  });
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const deleteCustomer = async (id: string): Promise<Customer[]> => {
  const customers = await getCustomers();
  const updated = customers.filter(c => c.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
    console.log("Entire AsyncStorage cleared!");
  } catch (e) {
    console.error('Error clearing all data', e);
  }
};
