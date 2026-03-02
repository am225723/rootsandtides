import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, typography } from '../theme';

type Props = {
  quote: string;
  icon?: string;
};

export default function QuoteCard({ quote, icon = '✦' }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.quote}>{quote}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(232, 116, 97, 0.06)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(232, 116, 97, 0.12)',
    padding: 20,
    marginVertical: 16,
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    color: colors.coral,
    marginBottom: 12,
  },
  quote: {
    ...typography.quote,
    textAlign: 'center',
  },
});
