/**
 * SMS Parser for Bank Transactions
 * Extracts Amount, Merchant, and Transaction Type (Debit/Credit)
 */

export interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  type: 'expense' | 'income';
  date: string;
  rawSms: string;
}

export const parseSms = (body: string): Transaction | null => {
  const sms = body.toLowerCase();
  
  // Basic check to see if it's a transaction message
  const isTransaction = 
    sms.includes('debited') || 
    sms.includes('credited') || 
    sms.includes('spent') || 
    sms.includes('paid') ||
    sms.includes('received');

  if (!isTransaction) return null;

  // 1. Extract Amount
  // Matches: Rs. 500, Rs.500, INR 500, Rs 500.50, ₹ 500
  const amountMatch = body.match(/(?:Rs|INR|₹)\.?\s?([\d,]+\.?\d*)/i);
  if (!amountMatch) return null;
  
  const amount = parseFloat(amountMatch[1].replace(/,/g, ''));

  // 2. Determine Type
  let type: 'expense' | 'income' = 'expense';
  if (sms.includes('credited') || sms.includes('received')) {
    type = 'income';
  }

  // 3. Extract Merchant/Recipient
  // Common patterns: "via UPI to [Merchant]", "at [Merchant]", "to [Merchant]"
  let merchant = 'Unknown';
  
  const upiMatch = body.match(/to\s+([^on\s]+)/i);
  const atMatch = body.match(/at\s+([^on\s]+)/i);
  const vpaMatch = body.match(/vpa\s([^\s]+)/i);

  if (upiMatch) merchant = upiMatch[1].trim();
  else if (atMatch) merchant = atMatch[1].trim();
  else if (vpaMatch) merchant = vpaMatch[1].trim();

  // Clean up merchant name (remove trailing dots, etc)
  merchant = merchant.replace(/[.,]$/, '');

  return {
    id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
    amount,
    merchant,
    type,
    date: new Date().toISOString(),
    rawSms: body,
  };
};
