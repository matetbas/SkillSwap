import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  StyleProp,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import Colors from '@/constants/Colors';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  maxLength?: number;
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'none',
  style,
  inputStyle,
  maxLength,
}: InputProps) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        error ? styles.inputError : null,
        multiline ? { height: 24 * Math.max(2, numberOfLines) } : null
      ]}>
        <TextInput
          style={[
            styles.input,
            multiline ? styles.multilineInput : null,
            inputStyle
          ]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : undefined}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
        />
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      {maxLength && (
        <Text style={styles.charCount}>
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: Colors.light.text,
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  input: {
    fontSize: 16,
    paddingVertical: 8,
    color: Colors.light.text,
  },
  multilineInput: {
    height: 'auto',
    paddingTop: 8,
    paddingBottom: 8,
  },
  inputError: {
    borderBottomColor: Colors.light.error,
  },
  errorText: {
    color: Colors.light.error,
    fontSize: 12,
    marginTop: 4,
  },
  charCount: {
    fontSize: 12,
    color: Colors.light.textLight,
    textAlign: 'right',
    marginTop: 4,
  },
});