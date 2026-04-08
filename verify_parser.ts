import { parseSms } from './lib/parser';

const tests = [
  {
    sms: "Rs.500.00 debited from A/c XXXX via UPI to Zomato on 08-Apr-26.",
    expected: { amount: 500, merchant: "Zomato", type: "expense" }
  },
  {
    sms: "INR 1200 debited at Amazon Store on 08-Apr-26. Ref: 12345",
    expected: { amount: 1200, merchant: "Amazon Store", type: "expense" }
  },
  {
    sms: "Your A/c XXXX is credited with Rs.15000.00 on 08-Apr-26 by Salary.",
    expected: { amount: 15000, merchant: "Unknown", type: "income" }
  },
  {
    sms: "Paid Rs. 250 to StarBucks via PhonePe.",
    expected: { amount: 250, merchant: "StarBucks", type: "expense" }
  }
];

console.log("Starting Parser Verification...");

tests.forEach((test, i) => {
  const result = parseSms(test.sms);
  if (!result) {
    console.error(`Test ${i} Failed: No result returned`);
    return;
  }
  
  const success = result.amount === test.expected.amount && 
                  result.type === test.expected.type;
  
  if (success) {
    console.log(`Test ${i} Passed: Extracted ₹${result.amount} ${result.type} to ${result.merchant}`);
  } else {
    console.error(`Test ${i} Failed: Got`, result);
  }
});
