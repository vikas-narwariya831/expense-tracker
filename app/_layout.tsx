import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { TransactionProvider } from '../context/TransactionContext';
import { LedgerProvider } from '../context/LedgerContext';
import BrandedSplash from '../components/BrandedSplash';
// import { clearAllData } from '../lib/ledger_storage';
export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    // Check onboarding status
    const checkOnboarding = async () => {
      const value = await AsyncStorage.getItem('hasSeenOnboarding');
      setHasSeenOnboarding(value === 'true');
    };
    checkOnboarding();

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);


  // useEffect(() => {
  //   clearAllData();
  // }, []);


  useEffect(() => {
    if (showSplash || hasSeenOnboarding === null) return;

    const inOnboardingGroup = segments[0] === 'onboarding';

    const performRedirection = async () => {
      // Re-fetch status if we're marked as "not seen" to catch real-time changes
      let status = hasSeenOnboarding;
      if (!status) {
        const value = await AsyncStorage.getItem('hasSeenOnboarding');
        if (value === 'true') {
          setHasSeenOnboarding(true);
          status = true;
        }
      }

      if (!status) {
        if (!inOnboardingGroup) {
          router.replace('/onboarding');
        }
      } else {
        if (inOnboardingGroup || !segments[0] || segments[0] === 'login') {
          router.replace('/(tabs)');
        }
      }
    };

    performRedirection();
  }, [segments, showSplash, router, hasSeenOnboarding]);

  if (hasSeenOnboarding === null) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {showSplash && <BrandedSplash />}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
        {/* Login screen commented out as requested */}
        {/* <Stack.Screen name="login" options={{ animation: 'fade' }} /> */}
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-expense" options={{ presentation: 'modal' }} />
        <Stack.Screen name="customer-detail" options={{ presentation: 'card' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <TransactionProvider>
      <LedgerProvider>
        <RootLayoutContent />
      </LedgerProvider>
    </TransactionProvider>
  );
}
