import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  ShieldCheck, 
  Zap, 
  PieChart, 
  Users,
  ArrowRight
} from 'lucide-react-native';
import Animated, { 
  FadeInUp, 
  FadeInDown, 
  useAnimatedStyle, 
  useSharedValue,
  interpolate,
  Extrapolate,
  interpolateColor,
  useAnimatedScrollHandler,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Precision Tracking',
    description: 'Experience the next-gen glassmorphism interface for your personal finance.',
    icon: Zap,
    colors: ['#6366F1', '#4F46E5'],
    bgColors: ['#F8FAFC', '#EEF2FF', '#6366F120'],
  },
  {
    id: '2',
    title: 'Auto SMS Detection',
    description: 'We automatically detect and categorize your bank transactions securely.',
    icon: ShieldCheck,
    colors: ['#10B981', '#059669'],
    bgColors: ['#F0FDF4', '#DCFCE7', '#10B98120'],
  },
  {
    id: '3',
    title: 'Digital Khatabook',
    description: 'Manage your customers and shop udhaar with automated WhatsApp reminders.',
    icon: Users,
    colors: ['#F43F5E', '#E11D48'],
    bgColors: ['#FFF1F2', '#FFE4E6', '#F43F5E20'],
  },
  {
    id: '4',
    title: 'Smart Analytics',
    description: 'Deep dive into your spending habits with interactive glass-style charts.',
    icon: PieChart,
    colors: ['#8B5CF6', '#7C3AED'],
    bgColors: ['#F5F3FF', '#EDE9FE', '#8B5CF620'],
  },
];

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const handleNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/(tabs)');
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    router.replace('/(tabs)');
  };

  const dynamicBgStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollX.value,
      SLIDES.map((_, i) => i * width),
      SLIDES.map((s) => s.bgColors[1])
    );
    return { backgroundColor };
  });

  return (
    <Animated.View style={[styles.container, dynamicBgStyle]}>
      <SafeAreaView style={styles.content}>
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <Animated.FlatList
          ref={flatListRef}
          data={SLIDES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          renderItem={({ item, index }) => <Slide item={item} index={index} scrollX={scrollX} />}
          keyExtractor={(item) => item.id}
        />

        <View style={styles.footer}>
          <View style={styles.pagination}>
            {SLIDES.map((_, i) => (
              <PaginationDot key={i} index={i} scrollX={scrollX} color={SLIDES[currentIndex].colors[0]} />
            ))}
          </View>

          <TouchableOpacity 
            style={styles.nextBtn} 
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <AnimatedLinearGradient
              colors={SLIDES[currentIndex].colors as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextBtnGradient}
            >
              <Text style={styles.nextBtnText}>
                {currentIndex === SLIDES.length - 1 ? 'Start Tracking' : 'Next'}
              </Text>
              <ArrowRight size={20} color="#FFF" style={{ marginLeft: 8 }} />
            </AnimatedLinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

function Slide({ item, index, scrollX }: any) {
  const iconScale = useSharedValue(1);

  React.useEffect(() => {
    iconScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  return (
    <View style={styles.slide}>
      <Animated.View 
        entering={FadeInUp.delay(200).duration(800)}
        style={styles.imageContainer}
      >
        <View style={styles.glassCircle}>
          <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
          <Animated.View style={animatedIconStyle}>
            <LinearGradient
              colors={item.colors}
              style={styles.iconGradient}
            >
              <item.icon size={64} color="#FFF" strokeWidth={2.5} />
            </LinearGradient>
          </Animated.View>
        </View>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.delay(400).duration(800)}
        style={styles.textContainer}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>
    </View>
  );
}

function PaginationDot({ index, scrollX, color }: any) {
  const animatedDotStyle = useAnimatedStyle(() => {
    const dotWidth = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [10, 28, 10],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.3, 1, 0.3],
      Extrapolate.CLAMP
    );
    return {
      width: dotWidth,
      opacity,
      backgroundColor: color,
    };
  });

  return <Animated.View style={[styles.dot, animatedDotStyle]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  skipBtn: {
    padding: 24,
    alignSelf: 'flex-end',
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  imageContainer: {
    marginBottom: 60,
  },
  glassCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -1.5,
  },
  description: {
    fontSize: 17,
    lineHeight: 26,
    color: '#475569',
    textAlign: 'center',
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  footer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextBtn: {
    height: 64,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  nextBtnGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});
