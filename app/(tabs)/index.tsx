import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus,
  Inbox,
  ArrowRightLeft
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTransactions } from '../../context/TransactionContext';
import { useLedger } from '../../context/LedgerContext';
import Animated, { FadeInUp } from 'react-native-reanimated';
import AnimatedCard from '../../components/AnimatedCard';
import TransactionList from '../../components/TransactionList';

export default function DashboardScreen() {
  const router = useRouter();
  const { transactions } = useTransactions();
  const { customers } = useLedger();
  const [activeTab, setActiveTab] = useState('All');

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const netGet = customers.reduce((sum, c) => c.netBalance > 0 ? sum + c.netBalance : sum, 0);
  const netGive = customers.reduce((sum, c) => c.netBalance < 0 ? sum + Math.abs(c.netBalance) : sum, 0);

  const filteredTransactions = activeTab === 'All' 
    ? transactions 
    : transactions.filter(t => t.type === (activeTab === 'Expense' ? 'expense' : 'income'));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Wallet Overview</Text>
            <Text style={styles.subHeaderText}>Smart tracking active</Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => router.push('/add-expense')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#6366F1', '#4F46E5']}
              style={styles.addBtnGradient}
            >
              <Plus size={24} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Glassmorphism Balance Card */}
        <Animated.View entering={FadeInUp.delay(200).duration(800)}>
          <View style={styles.glassCardContainer}>
            <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,255,255,0.7)', 'rgba(255,255,255,0.3)']}
              style={styles.glassGradient}
            >
              <View style={styles.cardInfo}>
                <View>
                  <Text style={styles.cardLabel}>Total Balance</Text>
                  <Text style={styles.balanceAmount}>₹{balance.toLocaleString()}</Text>
                </View>
                <View style={styles.cardIcon}>
                  <CreditCard size={24} color="#6366F1" opacity={0.6} />
                </View>
              </View>
              
              <View style={styles.cardStats}>
                <View style={styles.statItem}>
                  <View style={[styles.statIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                    <ArrowDownLeft size={16} color="#10b981" />
                  </View>
                  <View>
                    <Text style={styles.statLabel}>Income</Text>
                    <Text style={styles.statValue}>₹{totalIncome.toLocaleString()}</Text>
                  </View>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.statItem}>
                  <View style={[styles.statIconBox, { backgroundColor: 'rgba(244, 63, 94, 0.1)' }]}>
                    <ArrowUpRight size={16} color="#f43f5e" />
                  </View>
                  <View>
                    <Text style={styles.statLabel}>Expenses</Text>
                    <Text style={styles.statValue}>₹{totalExpense.toLocaleString()}</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Ledger Summary Section */}
        <Animated.View entering={FadeInUp.delay(300).duration(800)} style={styles.ledgerSection}>
          <Text style={styles.sectionTitle}>Business Ledger</Text>
          <View style={styles.ledgerCards}>
            <TouchableOpacity 
              style={styles.ledgerCard} 
              onPress={() => router.push('/ledger')}
            >
              <View style={[styles.ledgerIconBox, { backgroundColor: '#FEE2E2' }]}>
                <ArrowDownLeft size={18} color="#EF4444" />
              </View>
              <Text style={styles.ledgerLabel}>You&apos;ll Get</Text>
              <Text style={[styles.ledgerAmount, { color: '#EF4444' }]}>₹{netGet.toLocaleString()}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.ledgerCard} 
              onPress={() => router.push('/ledger')}
            >
              <View style={[styles.ledgerIconBox, { backgroundColor: '#DCFCE7' }]}>
                <ArrowUpRight size={18} color="#10B981" />
              </View>
              <Text style={styles.ledgerLabel}>You&apos;ll Give</Text>
              <Text style={[styles.ledgerAmount, { color: '#10B981' }]}>₹{netGive.toLocaleString()}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Quick Actions / Tabs */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.tabContainer}>
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
        </View>

        {/* Transactions List */}
        <Animated.View entering={FadeInUp.delay(400).duration(800)}>
          {filteredTransactions.length > 0 ? (
            <TransactionList transactions={filteredTransactions.slice(0, 5)} />
          ) : (
            <View style={styles.emptyActivity}>
              <Inbox size={40} color="#CBD5E1" />
              <Text style={styles.emptyText}>No activity found</Text>
            </View>
          )}
        </Animated.View>

        <AnimatedCard delay={600} style={styles.analyticsCard}>
          <View style={styles.analyticsHeader}>
            <View style={styles.analyticsIcon}>
              <ArrowRightLeft size={20} color="#6366f1" />
            </View>
            <TouchableOpacity onPress={() => router.push('/ledger')}>
              <Text style={styles.analyticsTitle}>Manage Udhaar</Text>
              <Text style={styles.analyticsSubtitle}>Total customers: {customers.length}</Text>
            </TouchableOpacity>
          </View>
        </AnimatedCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 130,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  subHeaderText: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 2,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addBtnGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassCardContainer: {
    borderRadius: 32,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 5,
  },
  glassGradient: {
    padding: 28,
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  cardLabel: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  balanceAmount: {
    color: '#1E293B',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 24,
    padding: 16,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconBox: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '800',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginHorizontal: 10,
  },
  ledgerSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  ledgerCards: {
    flexDirection: 'row',
    gap: 12,
  },
  ledgerCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  ledgerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  ledgerLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  ledgerAmount: {
    fontSize: 18,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#1E293B',
  },
  emptyActivity: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFF',
    borderRadius: 24,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 12,
    fontWeight: '500',
  },
  analyticsCard: {
    marginTop: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  analyticsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  analyticsIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  analyticsSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
});
