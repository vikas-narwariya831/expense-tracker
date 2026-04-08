import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { X, Calendar as CalendarIcon, Tag, IndianRupee, Check, AlertCircle } from 'lucide-react-native';
import { useTransactions } from '../context/TransactionContext';
import { Transaction } from '../lib/parser';
import { CATEGORIES } from '../constants/categories';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function AddExpenseScreen() {
  const router = useRouter();
  const { addTransaction } = useTransactions();
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [selectedCategory, setSelectedCategory] = useState('other');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ amount?: string, merchant?: string }>({});

  const validate = () => {
    const newErrors: { amount?: string, merchant?: string } = {};
    const parsedAmount = parseFloat(amount);

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    if (!merchant.trim()) {
      newErrors.merchant = 'Merchant name/description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const newTransaction: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        amount: parseFloat(amount),
        merchant: merchant.trim(),
        date: new Date().toISOString(),
        type: type,
        category: selectedCategory,
        rawSms: `Manual Entry: ${type} at ${merchant} (Category: ${selectedCategory})`,
      };

      await addTransaction(newTransaction);
      router.back();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if button should be disabled
  const isInvalid = !amount || !merchant.trim() || parseFloat(amount) <= 0;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <X size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Transaction</Text>
          <View style={{ width: 44 }} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
        >
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Animated.View entering={FadeIn.delay(100)} style={styles.typeSelector}>
              <TouchableOpacity 
                style={[styles.typeBtn, type === 'expense' && styles.activeTypeBtnExpense]}
                onPress={() => { setType('expense'); setSelectedCategory('other'); }}
              >
                <Text style={[styles.typeText, type === 'expense' && styles.activeTypeText]}>Expense</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.typeBtn, type === 'income' && styles.activeTypeBtnIncome]}
                onPress={() => { setType('income'); setSelectedCategory('income'); }}
              >
                <Text style={[styles.typeText, type === 'income' && styles.activeTypeText]}>Income</Text>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.amountContainer}>
              <View style={styles.amountInputRow}>
                <IndianRupee size={32} color={errors.amount ? '#F43F5E' : '#64748B'} />
                <TextInput
                  style={[styles.amountInput, errors.amount && styles.errorText]}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  autoFocus
                  value={amount}
                  onChangeText={(val) => {
                    setAmount(val);
                    if (errors.amount) setErrors({ ...errors, amount: undefined });
                  }}
                  placeholderTextColor="#CBD5E1"
                />
              </View>
              {errors.amount && (
                <View style={styles.errorContainer}>
                  <AlertCircle size={14} color="#F43F5E" />
                  <Text style={styles.errorMessage}>{errors.amount}</Text>
                </View>
              )}
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Details</Text>
              <View style={[styles.inputWrapper, errors.merchant && styles.errorBorder]}>
                <Tag size={20} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Where did you spend?"
                  value={merchant}
                  onChangeText={(val) => {
                    setMerchant(val);
                    if (errors.merchant) setErrors({ ...errors, merchant: undefined });
                  }}
                  placeholderTextColor="#94A3B8"
                />
              </View>
              {errors.merchant && <Text style={styles.inlineErrorText}>{errors.merchant}</Text>}

              <Text style={styles.label}>Category</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={styles.categoryPicker}
                contentContainerStyle={styles.categoryPickerContent}
              >
                {CATEGORIES.filter(c => type === 'income' ? c.id === 'income' || c.id === 'other' : c.id !== 'income').map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryItem,
                      selectedCategory === cat.id && { backgroundColor: cat.bg, borderColor: cat.color }
                    ]}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <View style={[styles.categoryIconCircle, { backgroundColor: cat.bg }]}>
                      <cat.icon size={20} color={cat.color} />
                    </View>
                    <Text style={[styles.categoryName, selectedCategory === cat.id && { color: cat.color }]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.inputWrapper}>
                <CalendarIcon size={20} color="#94A3B8" style={styles.inputIcon} />
                <Text style={styles.dateText}>Today, {new Date().toLocaleDateString()}</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.saveButton, isInvalid && styles.disabledButton]} 
              onPress={handleSave}
              disabled={isLoading || isInvalid}
            >
              <LinearGradient
                colors={isInvalid ? ['#94A3B8', '#64748B'] : ['#6366F1', '#4F46E5']}
                style={styles.saveGradient}
              >
                <Text style={styles.saveText}>{isLoading ? 'Saving...' : 'Save Transaction'}</Text>
                {!isLoading && <Check size={20} color="#FFF" style={{ marginLeft: 8 }} />}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 6,
    marginBottom: 30,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTypeBtnExpense: {
    backgroundColor: '#F43F5E',
  },
  activeTypeBtnIncome: {
    backgroundColor: '#10B981',
  },
  typeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
  },
  activeTypeText: {
    color: '#FFF',
  },
  amountContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInput: {
    fontSize: 48,
    fontWeight: '800',
    color: '#1E293B',
    marginLeft: 8,
    minWidth: 100,
  },
  errorText: {
    color: '#F43F5E',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  errorMessage: {
    color: '#F43F5E',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 12,
    marginLeft: 4,
  },
  form: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  errorBorder: {
    borderColor: '#F43F5E',
  },
  inlineErrorText: {
    color: '#F43F5E',
    fontSize: 12,
    marginBottom: 16,
    marginLeft: 4,
    fontWeight: '500',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  categoryPicker: {
    marginBottom: 24,
    marginHorizontal: -24,
  },
  categoryPickerContent: {
    paddingHorizontal: 24,
  },
  categoryItem: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    width: 90,
  },
  categoryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  dateText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  saveButton: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
