import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer, getCustomers, saveCustomer, addLedgerEntry, deleteCustomer } from '../lib/ledger_storage';

interface LedgerContextType {
  customers: Customer[];
  addCustomer: (name: string, phone: string) => Promise<void>;
  addEntry: (customerId: string, amount: number, type: 'gave' | 'got', note: string) => Promise<void>;
  removeCustomer: (id: string) => Promise<void>;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const LedgerContext = createContext<LedgerContextType | undefined>(undefined);

export function LedgerProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = async () => {
    const data = await getCustomers();
    setCustomers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAddCustomer = async (name: string, phone: string) => {
    const updated = await saveCustomer(name, phone);
    setCustomers(updated);
  };

  const handleAddEntry = async (customerId: string, amount: number, type: 'gave' | 'got', note: string) => {
    const updated = await addLedgerEntry(customerId, amount, type, note);
    setCustomers(updated);
  };

  const handleRemoveCustomer = async (id: string) => {
    const updated = await deleteCustomer(id);
    setCustomers(updated);
  };

  return (
    <LedgerContext.Provider value={{ 
      customers, 
      addCustomer: handleAddCustomer, 
      addEntry: handleAddEntry, 
      removeCustomer: handleRemoveCustomer,
      isLoading,
      refresh 
    }}>
      {children}
    </LedgerContext.Provider>
  );
}

export function useLedger() {
  const context = useContext(LedgerContext);
  if (context === undefined) {
    throw new Error('useLedger must be used within a LedgerProvider');
  }
  return context;
}
