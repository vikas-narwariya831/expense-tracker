import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeIn, 
  FadeInUp, 
  FadeOut, 
  ZoomIn,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  useSharedValue,
} from 'react-native-reanimated';

export default function BrandedSplash() {
  const glowValue = useSharedValue(0.5);

  useEffect(() => {
    glowValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.5, { duration: 1500 })
      ),
      -1,
      true
    );
  }, [glowValue]);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    opacity: glowValue.value * 0.3 + 0.2,
    transform: [{ scale: glowValue.value * 0.1 + 1 }]
  }));

  return (
    <Animated.View 
      exiting={FadeOut.duration(800)}
      style={styles.container}
    >
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#0F172A']}
        style={styles.background}
      />
      
      <View style={styles.content}>
        <Animated.View 
          entering={ZoomIn.duration(1000).springify()}
          style={styles.logoContainer}
        >
          <LinearGradient
            colors={['#6366F1', '#4F46E5']}
            style={styles.logoGradient}
          >
            <View style={styles.monogramBox}>
              <Text style={styles.etLogo}>ET</Text>
              <View style={styles.monogramLine} />
            </View>
          </LinearGradient>
          <Animated.View style={[styles.glow, animatedLogoStyle]} />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(500).duration(800)}>
          <Text style={styles.brandName}>EXPENSE PRO</Text>
          <Text style={styles.tagline}>Smart Financial Management</Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInUp.delay(1200).duration(800)}
          style={styles.divider}
        />

        <Animated.View entering={FadeInUp.delay(1500).duration(800)}>
          <Text style={styles.developedBy}>Premium Edition</Text>
          <Text style={styles.userName}>Developed by Vikas</Text>
        </Animated.View>
      </View>

      <Animated.View 
        entering={FadeIn.delay(2000)}
        style={styles.footer}
      >
        <Text style={styles.versionText}>v2.0.0 • AI POWERED</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 40,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  monogramBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  etLogo: {
    fontSize: 56,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: -4,
    includeFontPadding: false,
  },
  monogramLine: {
    width: 30,
    height: 3,
    backgroundColor: '#FFF',
    marginTop: -4,
    borderRadius: 2,
    opacity: 0.8,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#6366F1',
    borderRadius: 40,
    opacity: 0.5,
    transform: [{ scale: 1.3 }],
    filter: 'blur(30px)',
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 4,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    letterSpacing: 2,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  divider: {
    width: 50,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 30,
  },
  developedBy: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
  },
  versionText: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
