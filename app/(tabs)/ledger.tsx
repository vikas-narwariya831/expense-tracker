import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  UserPlus, 
  Search, 
  ChevronRight, 
  X
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useLedger } from '../../context/LedgerContext';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function LedgerScreen() {
  const router = useRouter();
  const { customers, addCustomer } = useLedger();
  const [search, setSearch] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const netGet = customers.reduce((sum, c) => c.netBalance > 0 ? sum + c.netBalance : sum, 0);
  const netGive = customers.reduce((sum, c) => c.netBalance < 0 ? sum + Math.abs(c.netBalance) : sum, 0);

  const handleAdd = async () => {
    if (!newName) return;
    await addCustomer(newName, newPhone);
    setNewName('');
    setNewPhone('');
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Ledger Book</Text>
          <Text style={styles.subtitle}>Digital Udhaar Khata</Text>
        </View>
        <TouchableOpacity 
          style={styles.addBtn} 
          onPress={() => setIsModalVisible(true)}
        >
          <LinearGradient
            colors={['#6366F1', '#4F46E5']}
            style={styles.addBtnGradient}
          >
            <UserPlus size={22} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <LinearGradient
          colors={['#ECFDF5', '#D1FAE5']}
          style={styles.summaryCard}
        >
          <Text style={[styles.summaryLabel, { color: '#059669' }]}>You'll Get</Text>
          <Text style={[styles.summaryAmount, { color: '#059669' }]}>₹{netGet.toLocaleString()}</Text>
          <View style={[styles.summaryIndicator, { backgroundColor: '#10B981' }]} />
        </LinearGradient>

        <LinearGradient
          colors={['#FFF1F2', '#FFE4E6']}
          style={styles.summaryCard}
        >
          <Text style={[styles.summaryLabel, { color: '#E11D48' }]}>You'll Give</Text>
          <Text style={[styles.summaryAmount, { color: '#E11D48' }]}>₹{netGive.toLocaleString()}</Text>
          <View style={[styles.summaryIndicator, { backgroundColor: '#F43F5E' }]} />
        </LinearGradient>
      </View>

      <View style={styles.searchBar}>
        <Search size={20} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#94A3B8"
        />
      </View>

      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.delay(index * 100)}>
            <TouchableOpacity 
              style={styles.customerCard}
              onPress={() => router.push({
                pathname: '/customer-detail',
                params: { id: item.id }
              })}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name[0].toUpperCase()}</Text>
              </View>
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{item.name}</Text>
                <Text style={styles.lastActivity}>Click to see history</Text>
              </View>
              <View style={styles.balanceContainer}>
                <Text style={[
                  styles.balanceAmount,
                  { color: item.netBalance >= 0 ? '#10B981' : '#F43F5E' }
                ]}>
                  ₹{Math.abs(item.netBalance).toLocaleString()}
                </Text>
                <Text style={styles.balanceLabel}>
                  {item.netBalance >= 0 ? 'Get' : 'Give'}
                </Text>
              </View>
              <ChevronRight size={20} color="#CBD5E1" />
            </TouchableOpacity>
          </Animated.View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No customers added yet.</Text>
            <TouchableOpacity style={styles.emptyAddBtn} onPress={() => setIsModalVisible(true)}>
              <Text style={styles.emptyAddText}>Add Your First Customer</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Customer</Text>
                <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                  <X size={24} color="#1E293B" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter name"
                  value={newName}
                  onChangeText={setNewName}
                  autoFocus
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="9876543210"
                  value={newPhone}
                  onChangeText={setNewPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
                <LinearGradient
                  colors={['#6366F1', '#4F46E5']}
                  style={styles.saveBtnGradient}
                >
                  <Text style={styles.saveBtnText}>Save Now</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    overflow: 'hidden',
  },
  addBtnGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 24,
    marginBottom: 27,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: '900',
  },
  summaryIndicator: {
    width: 20,
    height: 3,
    borderRadius: 2,
    marginTop: 8,
    opacity: 0.3,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 24,
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#1E293B',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 22,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6366F1',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  lastActivity: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  balanceContainer: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: '800',
  },
  balanceLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 16,
  },
  emptyAddBtn: {
    marginTop: 16,
  },
  emptyAddText: {
    color: '#6366F1',
    fontWeight: '700',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 10,
    marginLeft: 4,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    paddingHorizontal: 18,
    height: 58,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    color: '#1E293B',
  },
  saveBtn: {
    height: 58,
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  saveBtnGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
