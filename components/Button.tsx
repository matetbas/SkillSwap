import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'accent' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function Button({
  title,
  onPress,
  type = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const isPrimary = type === 'primary';
  const isOutline = type === 'outline';

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator
          color={isOutline ? Colors.light.primary : '#FFFFFF'}
          size="small"
        />
      ) : (
        <Text style={[
          styles.text,
          styles[`${type}Text`],
          disabled && styles.disabledText,
          textStyle,
        ]}>
          {title}
        </Text>
      )}
    </>
  );

  const buttonStyles = [
    styles.button,
    styles[`${type}Button`],
    disabled && styles.disabledButton,
    style,
  ];

  if (Platform.OS === 'web' || !isPrimary) {
    return (
      <TouchableOpacity
        style={buttonStyles}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[style, { borderRadius: 16 }]}
    >
      <LinearGradient
        colors={[Colors.light.gradientStart, Colors.light.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button, styles.primaryButton, disabled && styles.disabledButton]}
      >
        {renderContent()}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 50,
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  accentButton: {
    backgroundColor: Colors.light.accent,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.light.primary,
    elevation: 0,
    shadowOpacity: 0,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: Colors.light.secondary,
  },
  accentText: {
    color: Colors.light.secondary,
  },
  outlineText: {
    color: Colors.light.primary,
  },
  disabledButton: {
    backgroundColor: Colors.light.border,
    borderColor: Colors.light.border,
    elevation: 0,
    shadowOpacity: 0,
  },
  disabledText: {
    color: Colors.light.textLight,
  },
});