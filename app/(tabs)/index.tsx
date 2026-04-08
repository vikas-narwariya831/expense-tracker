import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShoppingBag, 
  Utensils, 
  Zap, 
  MoreHorizontal,
  Bell,
  RefreshCw,
  Plus
} from 'lucide-react-native';
import { useSmsTracker } from '../../hooks/useSmsTracker';
import { Transaction } from '../../lib/parser';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { transactions, loading, mockSms } = useSmsTracker();
  const [activeTab, setActiveTab] = useState('All');

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const filteredTransactions = activeTab === 'All' 
    ? transactions 
    : transactions.filter(t => t.type === (activeTab === 'Expense' ? 'expense' : 'income'));

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const isExpense = item.type === 'expense';
    
    // Choose icon based on merchant name
    const getIcon = (merchant: string) => {
      const name = merchant.toLowerCase();
      if (name.includes('zomato') || name.includes('swiggy') || name.includes('restaurant')) return <Utensils size={20} color="#FF6B6B" />;
      if (name.includes('amazon') || name.includes('flipkart') || name.includes('store')) return <ShoppingBag size={20} color="#4D96FF" />;
      if (name.includes('bill') || name.includes('jio') || name.includes('electricity')) return <Zap size={20} color="#FFD93D" />;
      return isExpense ? <ArrowUpRight size={20} color="#FF6B6B" /> : <ArrowDownLeft size={20} color="#6BCB77" />;
    };

    return (
      <View style={styles.transactionItem}>
        <View style={[styles.iconContainer, { backgroundColor: isExpense ? '#FFF5F5' : '#F2FFF5' }]}>
          {getIcon(item.merchant)}
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.merchantName} numberOfLines={1}>{item.merchant}</Text>
          <Text style={styles.transactionDate}>{new Date(item.date).toLocaleDateString()} • {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
        </View>
        <View style={styles.amountContainer}>
          <Text style={[styles.amountText, { color: isExpense ? '#E63946' : '#2A9D8F' }]}>
            {isExpense ? '-' : '+'}₹{item.amount.toLocaleString()}
          </Text>
        </View>
      </View>
    );
  };

  const testSms = () => {
    const samples = [
      "Rs.500.00 debited from A/c XXXX via UPI to Zomato on 08-Apr-26.",
      "INR 1200 debited at Amazon Store on 08-Apr-26. Ref: 12345",
      "Your A/c XXXX is credited with Rs.15000.00 on 08-Apr-26 by Salary.",
      "Paid Rs. 250 to StarBucks via PhonePe."
    ];
    const randomSms = samples[Math.floor(Math.random() * samples.length)];
    mockSms(randomSms);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hello, User</Text>
          <Text style={styles.subHeaderText}>Your smart wallet is ready</Text>
        </View>
        <TouchableOpacity style={styles.bellButton} onPress={testSms} activeOpacity={0.7}>
          <Plus size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <View style={styles.cardWrapper}>
        <LinearGradient
          colors={['#1A1A1A', '#333333']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>Current Balance</Text>
            <CreditCard size={20} color="rgba(255,255,255,0.6)" />
          </View>
          <Text style={styles.balanceAmount}>₹{balance.toLocaleString()}</Text>
          
          <View style={styles.cardFooter}>
            <View style={styles.statsItem}>
              <View style={[styles.statsIcon, { backgroundColor: 'rgba(107, 203, 119, 0.2)' }]}>
                <ArrowDownLeft size={14} color="#6BCB77" />
              </View>
              <View>
                <Text style={styles.statsLabel}>Income</Text>
                <Text style={styles.incomeAmount}>₹{totalIncome.toLocaleString()}</Text>
              </View>
            </View>
            
            <View style={styles.statsItem}>
              <View style={[styles.statsIcon, { backgroundColor: 'rgba(255, 107, 107, 0.2)' }]}>
                <ArrowUpRight size={14} color="#FF6B6B" />
              </View>
              <View>
                <Text style={styles.statsLabel}>Expenses</Text>
                <Text style={styles.expenseAmount}>₹{totalExpense.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {['All', 'Income', 'Expense'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transactions List */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Recent Activity</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <RefreshCw size={40} color="#E0E0E0" />
            </View>
            <Text style={styles.emptyTitle}>No transactions tracked yet</Text>
            <Text style={styles.emptySubtitle}>Your bank SMS notifications will automatically appear here.</Text>
            <TouchableOpacity style={styles.testButton} onPress={testSms}>
              <Text style={styles.testButtonText}>Test with Sample SMS</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  subHeaderText: {
    fontSize: 14,
    color: '#95A5A6',
    marginTop: 2,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardWrapper: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  balanceCard: {
    borderRadius: 28,
    padding: 24,
    height: 190,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 16,
  },
  statsItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  statsLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '500',
  },
  incomeAmount: {
    color: '#6BCB77',
    fontSize: 15,
    fontWeight: '700',
  },
  expenseAmount: {
    color: '#FF6B6B',
    fontSize: 15,
    fontWeight: '700',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  activeTab: {
    backgroundColor: '#1A1A1A',
    borderColor: '#1A1A1A',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#95A5A6',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  seeAll: {
    fontSize: 14,
    color: '#4D96FF',
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  transactionDate: {
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#95A5A6',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  testButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#1A1A1A',
  },
  testButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  }
});
