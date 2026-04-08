import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp } from 'lucide-react-native';
import { useTransactions } from '../../context/TransactionContext';
import { CATEGORIES } from '../../constants/categories';
import Animated, { FadeInUp } from 'react-native-reanimated';
import AnimatedCard from '../../components/AnimatedCard';
import SpendingChart from '../../components/SpendingChart';

export default function StatisticsScreen() {
  const { transactions } = useTransactions();

  const expenses = transactions.filter(t => t.type === 'expense');
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

  // Group by our centralized categories
  const categoryData = CATEGORIES.filter(c => c.id !== 'income').map(cat => {
    const amount = expenses.filter(t => {
      if (t.category === cat.id) return true;
      if (!t.category || t.category === 'other') {
        return cat.keywords.some(k => t.merchant.toLowerCase().includes(k));
      }
      return false;
    }).reduce((sum, t) => sum + t.amount, 0);
    
    return {
      ...cat,
      amount,
      percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0
    };
  })
  .filter(c => c.amount > 0 || c.id === 'other')
  .sort((a, b) => b.amount - a.amount);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInUp.duration(800)}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Visual spending breakdown</Text>
        </Animated.View>

        {/* New Graphical Chart */}
        <SpendingChart data={categoryData} />

        <AnimatedCard delay={200} style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Monthly Spending</Text>
          <Text style={styles.summaryAmount}>₹{totalExpense.toLocaleString()}</Text>
          <View style={styles.trendContainer}>
            <TrendingUp size={16} color="#10B981" />
            <Text style={styles.trendText}>Live insights active</Text>
          </View>
        </AnimatedCard>

        <Text style={styles.sectionTitle}>Breakdown by Category</Text>
        
        <View style={styles.categoryList}>
          {categoryData.map((item, index) => (
            <Animated.View 
              key={item.id} 
              entering={FadeInUp.delay(400 + index * 100).duration(600)}
              style={styles.categoryItem}
            >
              <View style={[styles.categoryIcon, { backgroundColor: item.bg }]}>
                <item.icon size={22} color={item.color} />
              </View>
              
              <View style={styles.categoryInfo}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{item.name}</Text>
                  <Text style={styles.categoryAmount}>₹{item.amount.toLocaleString()}</Text>
                </View>
                
                <View style={styles.progressBarBg}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { width: `${item.percentage}%`, backgroundColor: item.color }
                    ]} 
                  />
                </View>
              </View>
            </Animated.View>
          ))}
        </View>

        <AnimatedCard delay={1000} style={styles.tipCard}>
          <LinearGradient
            colors={['#6366F1', '#818CF8']}
            style={styles.tipGradient}
          >
            <Text style={styles.tipTitle}>Savings Tip</Text>
            <Text style={styles.tipDescription}>
              Detailed tagging helps our AI provide more accurate charts. Keep up the good work, Vikas!
            </Text>
          </LinearGradient>
        </AnimatedCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: '#FFF',
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 32,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 8,
    letterSpacing: -1,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  trendText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
  },
  categoryList: {
    marginBottom: 24,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  tipCard: {
    padding: 0,
    overflow: 'hidden',
    borderRadius: 24,
  },
  tipGradient: {
    padding: 24,
  },
  tipTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  tipDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    lineHeight: 22,
  },
});
