import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, radius } from '../theme';

type Props = {
  icon?: string;
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
};

export default function EmptyState({ icon = '🌱', title, subtitle, actionText, onAction }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionText && onAction && (
        <TouchableOpacity style={styles.button} onPress={onAction} activeOpacity={0.8}>
          <Text style={styles.buttonText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24 },
  icon: { fontSize: 48, marginBottom: 16 },
  title: { ...typography.subtitle, textAlign: 'center', marginBottom: 8 },
  subtitle: { ...typography.body, color: colors.textMuted, textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: colors.coral, paddingVertical: 12, paddingHorizontal: 28, borderRadius: radius.full },
  buttonText: { ...typography.buttonText, fontSize: 15 },
});