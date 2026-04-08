import { 
  Utensils, 
  ShoppingBag, 
  Zap, 
  Car, 
  Heart, 
  Gamepad2, 
  Briefcase, 
  HelpCircle 
} from 'lucide-react-native';

export const CATEGORIES = [
  { id: 'food', name: 'Food', icon: Utensils, color: '#FF6B6B', bg: '#FFF5F5', keywords: ['zomato', 'swiggy', 'restaurant', 'food', 'starbucks', 'coffee'] },
  { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: '#4D96FF', bg: '#F2F7FF', keywords: ['amazon', 'flipkart', 'store', 'mall', 'shopping'] },
  { id: 'bills', name: 'Bills', icon: Zap, color: '#FFD93D', bg: '#FFFDF2', keywords: ['jio', 'electricity', 'bill', 'recharge'] },
  { id: 'transport', name: 'Transport', icon: Car, color: '#454545', bg: '#F5F5F5', keywords: ['uber', 'ola', 'petrol', 'fuel', 'auto'] },
  { id: 'health', name: 'Health', icon: Heart, color: '#FF6B6B', bg: '#FFF5F5', keywords: ['medical', 'hospital', 'pharmacy'] },
  { id: 'fun', name: 'Entertainment', icon: Gamepad2, color: '#A855F7', bg: '#F5F2FF', keywords: ['movie', 'netflix', 'game', 'pvr'] },
  { id: 'income', name: 'Income', icon: Briefcase, color: '#10B981', bg: '#ECFDF5', keywords: ['salary', 'refund', 'interest', 'credited'] },
  { id: 'other', name: 'Other', icon: HelpCircle, color: '#94A3B8', bg: '#F8FAFC', keywords: [] },
];

export const getCategoryByTransaction = (merchant: string, type: 'expense' | 'income') => {
  const name = merchant.toLowerCase();
  
  // First check if it's income
  if (type === 'income') return CATEGORIES.find(c => c.id === 'income');

  // Then check keywords
  const category = CATEGORIES.find(cat => 
    cat.keywords.some(keyword => name.includes(keyword))
  );

  return category || CATEGORIES.find(c => c.id === 'other');
};
