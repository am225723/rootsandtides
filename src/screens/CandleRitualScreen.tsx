import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ActionButton from '../components/ActionButton';
import GlassCard from '../components/GlassCard';
import { colors, radius, typography } from '../theme';
import { useApp } from '../context/AppContext';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'CandleRitual'> };

export default function CandleRitualScreen({ navigation }: Props) {
  const { candleCount, lightCandle, addVaultEntry, vaultCollections, createCollection } = useApp();
  const [isLit, setIsLit] = useState(false);
  const [reflection, setReflection] = useState('');
  const [saved, setSaved] = useState(false);
  const flameScale = useRef(new Animated.Value(1)).current;
  const flameOpacity = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const flickerRef = useRef<Animated.CompositeAnimation | null>(null);

  const startFlicker = () => {
    flickerRef.current = Animated.loop(Animated.sequence([
      Animated.timing(flameScale, { toValue: 1.08, duration: 300, useNativeDriver: true }),
      Animated.timing(flameScale, { toValue: 0.95, duration: 250, useNativeDriver: true }),
      Animated.timing(flameScale, { toValue: 1.05, duration: 200, useNativeDriver: true }),
      Animated.timing(flameScale, { toValue: 0.98, duration: 350, useNativeDriver: true }),
    ]));
    flickerRef.current.start();
  };

  const handleLightCandle = async () => {
    await lightCandle();
    setIsLit(true);
    Animated.parallel([
      Animated.timing(flameOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(glowOpacity, { toValue: 0.6, duration: 800, useNativeDriver: true }),
    ]).start(() => startFlicker());
  };

  const handleSaveReflection = async () => {
    if (!reflection.trim()) return;
    let col = vaultCollections.find(c => c.title === 'Candle Reflections');
    if (!col) col = await createCollection('Candle Reflections', '🕯️');
    await addVaultEntry({ collectionId: col.id, title: `Candle Reflection — ${new Date().toLocaleDateString()}`, content: reflection.trim(), type: 'ritual' });
    setSaved(true);
  };

  useEffect(() => { return () => { if (flickerRef.current) flickerRef.current.stop(); }; }, []);

  return (
    <View style={styles.fullScreen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Digital Candle</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.sectionLabel}>RITUAL OF RELEASE</Text>
        <Text style={styles.pageTitle}>Carrying Their Light</Text>
        <Text style={styles.pageSubtitle}>In this ritual, we acknowledge the reality of our loss and find ways to integrate their memory into our new life.</Text>

        <View style={styles.candleContainer}>
          <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />
          <Animated.View style={[styles.flameContainer, { opacity: flameOpacity, transform: [{ scale: flameScale }] }]}>
            <View style={styles.flameOuter}><View style={styles.flameInner} /></View>
          </Animated.View>
          <View style={styles.candleBody}>{isLit && <View style={styles.candleShine} />}</View>
          <View style={styles.candleBase} />
          {!isLit && <Text style={styles.unlitPrompt}>Tap to light a candle for them</Text>}
        </View>

        <View style={styles.counterRow}>
          <Text style={styles.counterIcon}>🕯️</Text>
          <Text style={styles.counterText}>{candleCount.toLocaleString()} candles lit today</Text>
        </View>

        {!isLit ? (
          <ActionButton title="🕯️  Light Candle" onPress={handleLightCandle} variant="primary" style={styles.lightBtn} />
        ) : (
          <View style={styles.litMessage}><Text style={styles.litIcon}>✨</Text><Text style={styles.litText}>Your candle is lit. They are remembered.</Text></View>
        )}

        <GlassCard variant="warm" style={styles.reflectionCard}>
          <Text style={styles.reflectionLabel}>LEGACY INTEGRATION</Text>
          <Text style={styles.reflectionTitle}>How does their light live in you today?</Text>
          {saved ? (
            <View style={styles.savedRow}><Text style={styles.savedIcon}>✓</Text><Text style={styles.savedText}>Reflection saved to your Vault</Text></View>
          ) : (
            <>
              <TextInput style={styles.reflectionInput} multiline placeholder="Write your reflections here…" placeholderTextColor={colors.textMuted} value={reflection} onChangeText={setReflection} textAlignVertical="top" />
              <ActionButton title="Save to My Roots" onPress={handleSaveReflection} variant="secondary" style={styles.saveBtn} />
            </>
          )}
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 56, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.backgroundCard, justifyContent: 'center', alignItems: 'center' },
  backIcon: { color: colors.textPrimary, fontSize: 20 },
  headerTitle: { ...typography.subtitle, fontSize: 17 },
  sectionLabel: { ...typography.label, color: colors.gold, marginBottom: 6 },
  pageTitle: { fontSize: 26, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  pageSubtitle: { ...typography.body, color: colors.textSecondary, lineHeight: 24, marginBottom: 32 },
  candleContainer: { alignItems: 'center', justifyContent: 'flex-end', height: 220, marginBottom: 16, position: 'relative' },
  glow: { position: 'absolute', top: 20, width: 120, height: 120, borderRadius: 60, backgroundColor: colors.gold, shadowColor: colors.gold, shadowOpacity: 1, shadowRadius: 40, shadowOffset: { width: 0, height: 0 } },
  flameContainer: { position: 'absolute', top: 30, alignItems: 'center', zIndex: 2 },
  flameOuter: { width: 28, height: 44, backgroundColor: colors.gold, borderRadius: 14, alignItems: 'center', justifyContent: 'center', shadowColor: colors.gold, shadowOpacity: 0.8, shadowRadius: 12, shadowOffset: { width: 0, height: 0 } },
  flameInner: { width: 12, height: 20, backgroundColor: '#FFF9C4', borderRadius: 6 },
  candleBody: { width: 40, height: 100, backgroundColor: '#F5F0E8', borderRadius: 4, overflow: 'hidden', zIndex: 1 },
  candleShine: { position: 'absolute', left: 8, top: 0, bottom: 0, width: 4, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 2 },
  candleBase: { width: 56, height: 10, backgroundColor: '#E8E0D0', borderRadius: 4, marginTop: 2 },
  unlitPrompt: { position: 'absolute', bottom: -28, ...typography.bodySmall, color: colors.textMuted, fontStyle: 'italic' },
  counterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 },
  counterIcon: { fontSize: 16 },
  counterText: { ...typography.bodySmall, color: colors.textMuted },
  lightBtn: { backgroundColor: colors.gold, marginBottom: 24 },
  litMessage: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24, backgroundColor: 'rgba(196,162,101,0.12)', borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: 'rgba(196,162,101,0.2)' },
  litIcon: { fontSize: 20 },
  litText: { ...typography.body, color: colors.gold, fontWeight: '600' },
  reflectionCard: {},
  reflectionLabel: { ...typography.label, color: colors.gold, marginBottom: 8 },
  reflectionTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  reflectionInput: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 14, minHeight: 100, fontSize: 15, color: colors.textPrimary, lineHeight: 22, marginBottom: 12 },
  saveBtn: { borderColor: colors.gold },
  savedRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  savedIcon: { fontSize: 20, color: colors.green },
  savedText: { ...typography.body, color: colors.green },
});
