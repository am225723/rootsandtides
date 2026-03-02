import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius } from '../theme';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'warm' | 'accent' | 'elevated';
};

export default function GlassCard({ children, style, variant = 'default' }: Props) {
  const variantStyles: Record<string, ViewStyle> = {
    default: {
      backgroundColor: colors.backgroundCard,
      borderColor: colors.border,
    },
    warm: {
      backgroundColor: 'rgba(196, 162, 101, 0.08)',
      borderColor: 'rgba(196, 162, 101, 0.15)',
    },
    accent: {
      backgroundColor: 'rgba(232, 116, 97, 0.08)',
      borderColor: colors.borderAccent,
    },
    elevated: {
      backgroundColor: colors.backgroundCardHover,
      borderColor: colors.borderLight,
    },
  };

  return (
    <View style={[styles.card, variantStyles[variant], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
});
