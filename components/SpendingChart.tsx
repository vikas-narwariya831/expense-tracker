import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withDelay,
  FadeIn
} from 'react-native-reanimated';
import { CATEGORIES } from '../constants/categories';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_HEIGHT = 200;

interface ChartData {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  color: string;
  bg: string;
}

export default function SpendingChart({ data }: { data: ChartData[] }) {
  const chartData = data.slice(0, 5); // Show top 5 for clarity
  const maxAmount = Math.max(...chartData.map(d => d.amount), 1);

  return (
    <Animated.View entering={FadeIn.duration(800)} style={styles.container}>
      <View style={styles.chartArea}>
        {chartData.map((item, index) => (
          <Bar 
            key={item.id} 
            item={item} 
            index={index} 
            maxAmount={maxAmount} 
          />
        ))}
      </View>
      
      <View style={styles.labelsArea}>
        {chartData.map((item) => (
          <View key={item.id} style={styles.labelItem}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={styles.labelName} numberOfLines={1}>{item.name}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

function Bar({ item, index, maxAmount }: { item: ChartData, index: number, maxAmount: number }) {
  const height = useSharedValue(0);
  const targetHeight = (item.amount / maxAmount) * (CHART_HEIGHT - 40);

  useEffect(() => {
    height.value = withDelay(index * 100, withSpring(targetHeight, { damping: 15 }));
  }, [targetHeight, index, height]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <View style={styles.barContainer}>
      <Animated.View style={[styles.barWrapper, animatedStyle]}>
        <View style={[styles.bar, { backgroundColor: item.color }]}>
          <View style={styles.barGloss} />
        </View>
        <Text style={styles.barAmount}>₹{(item.amount / 1000).toFixed(1)}k</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 32,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  chartArea: {
    height: CHART_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barWrapper: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 8,
    minHeight: 4,
    overflow: 'hidden',
  },
  barGloss: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: '30%',
    marginLeft: '10%',
  },
  barAmount: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 4,
    position: 'absolute',
    top: -20,
  },
  labelsArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    justifyContent: 'center',
  },
  labelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  labelName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    maxWidth: 60,
  },
});
