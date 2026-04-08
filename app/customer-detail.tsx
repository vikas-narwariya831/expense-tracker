import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  MessageCircle, 
  Plus, 
  Minus,
  Calendar,
  Trash2,
  X
} from 'lucide-react-native';
import { useLedger } from '../context/LedgerContext';
import Animated, { FadeInUp, SlideInDown } from 'react-native-reanimated';

export default function CustomerDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { customers, addEntry, removeCustomer } = useLedger();
  
  const customer = customers.find(c => c.id === id);
  const [isEntryMode, setIsEntryMode] = useState<'gave' | 'got' | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  if (!customer) return null;

  const handleSaveEntry = async () => {
    if (!amount || !isEntryMode) return;
    await addEntry(customer.id, parseFloat(amount), isEntryMode, note);
    setAmount('');
    setNote('');
    setIsEntryMode(null);
  };

  const handleWhatsApp = () => {
    if (!customer.phone) {
      Alert.alert('No Phone Number', 'Please add a phone number for this customer first.');
      return;
    }
    const balanceMsg = customer.netBalance > 0 
      ? `Dear ${customer.name}, your pending balance is ₹${customer.netBalance}. Please clear it soon.`
      : `Dear ${customer.name}, I owe you ₹${Math.abs(customer.netBalance)}. I will clear it soon.`;
    
    const url = `whatsapp://send?phone=91${customer.phone}&text=${encodeURIComponent(balanceMsg)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'WhatsApp is not installed on your device.');
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Customer',
      'Are you sure you want to delete this customer and all history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            await removeCustomer(customer.id);
            router.back();
          } 
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={24} color="#1E293B" />
          </TouchableOpacity>
          <View style={styles.customerHeaderInfo}>
            <Text style={styles.customerName}>{customer.name}</Text>
            <Text style={styles.customerPhone}>{customer.phone || 'No phone added'}</Text>
          </View>
          <TouchableOpacity onPress={handleDelete} style={styles.moreBtn}>
            <Trash2 size={20} color="#F43F5E" />
          </TouchableOpacity>
        </View>

        <View style={styles.totalBalanceBox}>
          <View>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={[
              styles.balanceValue,
              { color: customer.netBalance >= 0 ? '#F43F5E' : '#10B981' }
            ]}>
              ₹{Math.abs(customer.netBalance).toLocaleString()}
            </Text>
            <Text style={styles.balanceSub}>
              {customer.netBalance >= 0 ? 'You will get' : 'You will give'}
            </Text>
          </View>
          <TouchableOpacity style={styles.reminderBtn} onPress={handleWhatsApp}>
            <MessageCircle size={20} color="#FFF" />
            <Text style={styles.reminderText}>Reminder</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={[...customer.entries].reverse()}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.entryItem}>
            <View style={styles.entryDate}>
              <Calendar size={14} color="#94A3B8" />
              <Text style={styles.dateText}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.entryRow}>
              <View style={styles.entryInfo}>
                <Text style={styles.entryNote}>{item.note || 'No note'}</Text>
                <Text style={styles.entryTime}>
                  {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              <View style={styles.entryAmountContainer}>
                <Text style={[
                  styles.entryAmount,
                  { color: item.type === 'gave' ? '#F43F5E' : '#10B981' }
                ]}>
                  {item.type === 'gave' ? '+' : '-'} ₹{item.amount.toLocaleString()}
                </Text>
                <Text style={styles.entryTypeLabel}>
                  {item.type === 'gave' ? 'You Gave' : 'You Got'}
                </Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions yet.</Text>
          </View>
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.bottomActions}
      >
        {isEntryMode ? (
          <Animated.View entering={SlideInDown} style={styles.entryForm}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                {isEntryMode === 'gave' ? 'You Gave Money' : 'You Got Money'}
              </Text>
              <TouchableOpacity onPress={() => setIsEntryMode(null)}>
                <XCircle size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.amountInput}
              placeholder="Enter Amount"
              keyboardType="decimal-pad"
              autoFocus
              value={amount}
              onChangeText={setAmount}
            />
            <TextInput
              style={styles.noteInput}
              placeholder="Add a note (e.g. for lunch)"
              value={note}
              onChangeText={setNote}
            />
            <TouchableOpacity 
              style={[styles.saveBtn, { backgroundColor: isEntryMode === 'gave' ? '#F43F5E' : '#10B981' }]}
              onPress={handleSaveEntry}
            >
              <Text style={styles.saveBtnText}>Save Entry</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.btnGave]}
              onPress={() => setIsEntryMode('gave')}
            >
              <Minus size={20} color="#FFF" />
              <Text style={styles.actionBtnText}>YOU GAVE</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.btnGot]}
              onPress={() => setIsEntryMode('got')}
            >
              <Plus size={20} color="#FFF" />
              <Text style={styles.actionBtnText}>YOU GOT</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const XCircle = ({ size, color }: { size: number, color: string }) => (
  <TouchableOpacity onPress={() => {}}>
    <X size={size} color={color} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customerHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  customerPhone: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  moreBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalBalanceBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  balanceLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: '800',
    marginVertical: 4,
  },
  balanceSub: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  reminderBtn: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 12,
  },
  reminderText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  entryItem: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  entryDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    opacity: 0.6,
  },
  dateText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 6,
    fontWeight: '600',
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryInfo: {
    flex: 1,
  },
  entryNote: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  entryTime: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  entryAmountContainer: {
    alignItems: 'flex-end',
  },
  entryAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
  entryTypeLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGave: {
    backgroundColor: '#F43F5E',
  },
  btnGot: {
    backgroundColor: '#10B981',
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8,
  },
  entryForm: {
    backgroundColor: '#FFF',
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  amountInput: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  noteInput: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  saveBtn: {
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
  },
});
