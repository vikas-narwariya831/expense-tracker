import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { Home, BarChart3, BookUser } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

const TAB_BAR_WIDTH = 340;
const SCREEN_WIDTH = Dimensions.get('window').width;
// Right side center: screen ka 75% pe center karo
const TAB_LEFT = SCREEN_WIDTH * 0.75 - TAB_BAR_WIDTH / 2;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarItemStyle: {
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: 0,
          paddingTop: 0,
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 30,
          left: TAB_LEFT,   // ✅ right side mein precisely placed
          width: TAB_BAR_WIDTH,
          height: 60,
          borderRadius: 30,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.12,
          shadowRadius: 20,
          paddingBottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        },
        tabBarBackground: () => (
          <View style={styles.tabBarContainer}>
            <BlurView
              intensity={Platform.OS === 'ios' ? 30 : 60}
              tint={isDark ? 'dark' : 'default'}
              style={StyleSheet.absoluteFill}
            />
            <View
              style={[
                styles.glassBorder,
                {
                  borderColor: isDark
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.06)',
                },
              ]}
            />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={Home} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={BarChart3} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="ledger"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={BookUser} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({
  icon: Icon,
  color,
  focused,
}: {
  icon: any;
  color: string;
  focused: boolean;
}) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.2 : 1, {
      damping: 12,
      stiffness: 180,
    });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.iconWrapper}>
      <Animated.View style={animatedStyle}>
        <Icon size={22} color={color} strokeWidth={focused ? 2.5 : 1.8} />
      </Animated.View>
      {focused && (
        <View style={[styles.activeDot, { backgroundColor: color }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  glassBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
    borderWidth: 1,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    position: 'absolute',
    bottom: -10,
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
});