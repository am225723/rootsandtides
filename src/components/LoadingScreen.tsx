import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, typography } from '../theme';

export default function LoadingScreen() {
  const opacity = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);
  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.icon, { opacity }]}>⚓</Animated.Text>
      <Text style={styles.text}>Roots & Tides</Text>
      <Text style={styles.sub}>Finding your ground…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 48, marginBottom: 16, color: colors.coral },
  text: { ...typography.title, marginBottom: 8 },
  sub: { ...typography.body, color: colors.textMuted },
});