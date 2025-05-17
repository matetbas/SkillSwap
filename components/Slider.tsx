import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';

interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue: number;
  maximumValue: number;
  step?: number;
}

export default function Slider({
  value,
  onValueChange,
  minimumValue,
  maximumValue,
  step = 1,
}: SliderProps) {
  const translateX = useSharedValue(0);
  const sliderWidth = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      let newX = e.translationX + translateX.value;
      newX = Math.max(0, Math.min(newX, sliderWidth.value));
      
      const percentage = newX / sliderWidth.value;
      const range = maximumValue - minimumValue;
      let newValue = minimumValue + (range * percentage);
      
      if (step) {
        newValue = Math.round(newValue / step) * step;
      }
      
      onValueChange(newValue);
    });

  const animatedStyle = useAnimatedStyle(() => {
    const percentage = (value - minimumValue) / (maximumValue - minimumValue);
    return {
      width: `${percentage * 100}%`,
    };
  });

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        sliderWidth.value = e.nativeEvent.layout.width;
      }}
    >
      <GestureDetector gesture={gesture}>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, animatedStyle]} />
          <View style={styles.thumb} />
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    position: 'absolute',
  },
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: Colors.light.primary,
    borderRadius: 10,
    position: 'absolute',
    top: -8,
    right: -10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});