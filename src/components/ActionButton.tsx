import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, typography } from '../theme';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  icon?: string;
  style?: ViewStyle;
  fullWidth?: boolean;
};

export default function ActionButton({ title, onPress, variant = 'primary', icon, style, fullWidth = true }: Props) {
  const variantStyles: Record<string, ViewStyle> = {
    primary: {
      backgroundColor: colors.coral,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    danger: {
      backgroundColor: colors.red,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyles[variant],
        fullWidth && styles.fullWidth,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.text,
        variant === 'ghost' && { color: colors.coral },
      ]}>
        {icon ? `${icon}  ${title}` : title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    ...typography.buttonText,
  },
});
