import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radius, shadows } from '../theme';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'warm' | 'accent' | 'elevated';
};

export default function GlassCard({ children, style, variant = 'default' }: Props) {
  const variants: Record<string, ViewStyle> = {
    default: { borderColor: colors.border },
    warm: { borderColor: 'rgba(196, 162, 101, 0.20)' },
    accent: { borderColor: colors.borderAccent },
    elevated: { borderColor: colors.borderLight },
  };
  const tint = variant === 'warm' ? 'light' : 'dark';
  const intensity = variant === 'elevated' ? 55 : 38;

  return (
    <View style={[styles.shell, variants[variant], style]}>
      {Platform.OS === 'web' ? (
        <View style={styles.webGlass}>{children}</View>
      ) : (
        <BlurView intensity={intensity} tint={tint} style={styles.blur}>
          {children}
        </BlurView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
    ...shadows.card,
  },
  blur: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  webGlass: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    // @ts-ignore react-native-web forwards this style key.
    backdropFilter: 'blur(14px)',
  },
});
