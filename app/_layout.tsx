import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { TransactionProvider } from '../context/TransactionContext';
import { LedgerProvider } from '../context/LedgerContext';
import BrandedSplash from '../components/BrandedSplash';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();
  const { isLoading } = useAuth(); // Keeping isLoading for Auth context readiness
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

  useEffect(() => {
    if (isLoading || showSplash || hasSeenOnboarding === null) return;

    const inOnboardingGroup = segments[0] === 'onboarding';

    // Direct redirection logic without Auth/Login check
    if (!hasSeenOnboarding) {
      if (!inOnboardingGroup) {
        router.replace('/onboarding');
      }
    } else {
      // If onboarding seen, always ensure we land on (tabs) 
      // This bypasses login completely as requested
      if (inOnboardingGroup || segments[0] === 'login' || !segments[0]) {
        router.replace('/(tabs)');
      }
    }
  }, [segments, isLoading, showSplash, router, hasSeenOnboarding]);

  if (isLoading || hasSeenOnboarding === null) return null;

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
    <AuthProvider>
      <TransactionProvider>
        <LedgerProvider>
          <RootLayoutContent />
        </LedgerProvider>
      </TransactionProvider>
    </AuthProvider>
  );
}
