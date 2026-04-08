# 📊 Smart SMS Expense Tracker (Expo)

A premium, automated expense tracking mobile application built with **React Native & Expo**. It automatically listens to incoming bank/UPI SMS notifications, parses transaction details, and updates your dashboard in real-time.

![Premium Dashboard Mockup](https://via.placeholder.com/800x400.png?text=Premium+SMS+Tracker+Dashboard)

## 🚀 Features

- **⚡ Real-time Tracking**: Automatically intercepts bank SMS as they arrive.
- **🔍 Smart Parsing**: Advanced Regex engine to extract Amount, Merchant, and Type (Debit/Credit).
- **💎 Premium UI**: Modern aesthetic with glassmorphism, gradients, and custom icons.
- **🔒 Privacy First**: All data is stored locally on your device using AsyncStorage.
- **📱 Android Optimized**: Configured with proper native permissions and Expo Dev Client.

## 🛠️ Tech Stack

- **Framework**: React Native with Expo Router
- **Logic**: Custom SMS Listener & Regex Parser
- **Icons**: Lucide React Native
- **Styling**: Expo Linear Gradient & Premium CSS-in-JS
- **Storage**: @react-native-async-storage/async-storage

## 📦 Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/vikas-narwariya831/expense-tracker.git
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build Development Client (Required for SMS features)**
   ```bash
   npx expo run:android
   ```

## 🧪 Testing

The app includes a **Mock Mode** for developers without physical Android devices or test SMS:
- Tap the **"+" (Plus icon)** in the top-right header to simulate a sample transaction notification.

## 📄 License
MIT
