import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction } from '../lib/parser';
import { getTransactions, saveTransaction as storageSaveTransaction } from '../lib/storage';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => Promise<void>;
  isLoading: boolean;
  refreshTransactions: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTransactions = async () => {
    const data = await getTransactions();
    setTransactions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshTransactions();
  }, []);

  const addTransaction = async (transaction: Transaction) => {
    // 1. Update Storage
    const updatedList = await storageSaveTransaction(transaction);
    // 2. Update Global State for real-time UI sync
    setTransactions(updatedList);
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, isLoading, refreshTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}
