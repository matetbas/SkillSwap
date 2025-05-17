import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface AnimatedHeaderProps {
  title: string;
  scrollY: Animated.Value;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
}

export default function AnimatedHeader({
  title,
  scrollY,
  showBackButton = true,
  rightComponent,
}: AnimatedHeaderProps) {
  const router = useRouter();

  // Header animation values
  const headerHeight = 60;
  const headerBackgroundOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 30, 50],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.header,
        {
          backgroundColor: scrollY.interpolate({
            inputRange: [0, 50],
            outputRange: ['rgba(255,255,255,0)', 'rgba(255,255,255,1)'],
            extrapolate: 'clamp',
          }),
          shadowOpacity: headerBackgroundOpacity,
        },
      ]}
    >
      <View style={styles.headerContent}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <ArrowLeft size={24} color={Colors.light.secondary} />
          </TouchableOpacity>
        )}
        
        <Animated.Text
          style={[
            styles.headerTitle,
            { opacity: titleOpacity },
          ]}
          numberOfLines={1}
        >
          {title}
        </Animated.Text>
        
        {rightComponent && (
          <View style={styles.rightComponent}>
            {rightComponent}
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.secondary,
    textAlign: 'center',
    maxWidth: '60%',
  },
  rightComponent: {
    position: 'absolute',
    right: 16,
  },
});