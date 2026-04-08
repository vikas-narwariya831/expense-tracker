import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Transaction } from '../lib/parser';
import { CATEGORIES, getCategoryByTransaction } from '../constants/categories';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface TransactionListProps {
  transactions: Transaction[];
  onRefresh?: () => void;
  refreshing?: boolean;
}

export const TransactionItem = ({ item, index }: { item: Transaction, index: number }) => {
  const isExpense = item.type === 'expense';
  
  // Use manually selected category or auto-detect
  const category = item.category 
    ? CATEGORIES.find(c => c.id === item.category) || getCategoryByTransaction(item.merchant, item.type)
    : getCategoryByTransaction(item.merchant, item.type);

  const Icon = category?.icon || CATEGORIES[CATEGORIES.length - 1].icon;
  const color = category?.color || '#94A3B8';
  const bg = category?.bg || '#F8FAFC';

  return (
    <Animated.View 
      entering={FadeInRight.delay(index * 100).duration(500)}
      style={styles.item}
    >
      <View style={[styles.iconContainer, { backgroundColor: bg }]}>
        <Icon size={22} color={color} />
      </View>
      <View style={styles.info}>
        <Text style={styles.merchant} numberOfLines={1}>{item.merchant}</Text>
        <Text style={styles.date}>
          {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: isExpense ? '#111827' : '#059669' }]}>
          {isExpense ? '-' : '+'}₹{item.amount.toLocaleString()}
        </Text>
      </View>
    </Animated.View>
  );
};

export default function TransactionList({ transactions }: TransactionListProps) {
  return (
    <View style={styles.container}>
      {transactions.map((item, index) => (
        <TransactionItem key={item.id || index} item={item} index={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  merchant: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  date: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
