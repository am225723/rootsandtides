import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import GlassCard from '../components/GlassCard';
import ActionButton from '../components/ActionButton';
import { colors, radius, typography } from '../theme';
import { useApp } from '../context/AppContext';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'ResponsibilityPie'> };
type Factor = { id: string; label: string; percentage: number; color: string };
const FACTOR_COLORS = [colors.blue, colors.coral, colors.green, colors.gold, colors.purple, '#E91E63', '#00BCD4', '#FF9800'];
const DEFAULT_FACTORS: Factor[] = [
  { id: '1', label: 'My Actions', percentage: 20, color: FACTOR_COLORS[0] },
  { id: '2', label: 'Nature of Illness', percentage: 30, color: FACTOR_COLORS[1] },
  { id: '3', label: 'External Factors', percentage: 25, color: FACTOR_COLORS[2] },
  { id: '4', label: 'Timing & Circumstance', percentage: 25, color: FACTOR_COLORS[3] },
];

export default function ResponsibilityPieScreen({ navigation }: Props) {
  const { addVaultEntry, vaultCollections, createCollection } = useApp();
  const [factors, setFactors] = useState<Factor[]>(DEFAULT_FACTORS);
  const [newLabel, setNewLabel] = useState('');
  const [reframing, setReframing] = useState('');
  const [saved, setSaved] = useState(false);
  const total = factors.reduce((sum, f) => sum + f.percentage, 0);

  const updatePct = (id: string, delta: number) => setFactors(factors.map(f => f.id === id ? { ...f, percentage: Math.max(0, Math.min(100, f.percentage + delta)) } : f));
  const addFactor = () => { if (!newLabel.trim()) return; setFactors([...factors, { id: Date.now().toString(), label: newLabel.trim(), percentage: 10, color: FACTOR_COLORS[factors.length % FACTOR_COLORS.length] }]); setNewLabel(''); };
  const removeFactor = (id: string) => setFactors(factors.filter(f => f.id !== id));

  const handleSave = async () => {
    let col = vaultCollections.find(c => c.title === 'Processing Work');
    if (!col) col = await createCollection('Processing Work', '🔄');
    const content = ['=== RESPONSIBILITY PIE ===', ...factors.map(f => `${f.label}: ${f.percentage}%`), `Total: ${total}%`, '', '=== REFRAMING ===', reframing || '(none)'].join('\n');
    await addVaultEntry({ collectionId: col.id, title: `Responsibility Pie — ${new Date().toLocaleDateString()}`, content, type: 'responsibility' });
    setSaved(true);
  };

  if (saved) {
    return (
      <View style={styles.fullScreen}>
        <View style={styles.savedContent}>
          <Text style={styles.savedEmoji}>🔄</Text>
          <Text style={styles.savedTitle}>Saved to Vault</Text>
          <Text style={styles.savedSub}>Your responsibility pie has been saved. Remember: you are not the only factor.</Text>
          <ActionButton title="Return" onPress={() => navigation.goBack()} variant="primary" style={{ backgroundColor: colors.coral }} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fullScreen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Responsibility Pie</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.sectionLabel}>PROCESSING GUILT</Text>
        <Text style={styles.pageTitle}>The Responsibility Pie</Text>
        <Text style={styles.pageSubtitle}>Map out the different factors that contributed to your loss. No single person bears full responsibility.</Text>

        <GlassCard variant="elevated">
          <View style={styles.pieBarContainer}>
            {factors.map((f) => <View key={f.id} style={[styles.pieSegment, { backgroundColor: f.color, width: `${(f.percentage / Math.max(total, 100)) * 100}%` as any }]} />)}
          </View>
          <View style={styles.pieLegend}>
            {factors.map((f) => (
              <View key={f.id} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: f.color }]} />
                <Text style={styles.legendText}>{f.label}</Text>
                <Text style={[styles.legendPct, { color: f.color }]}>{f.percentage}%</Text>
              </View>
            ))}
          </View>
          <Text style={[styles.totalText, total > 100 && { color: colors.red }]}>Total: {total}% {total === 100 ? '✓' : total > 100 ? '(over 100%)' : ''}</Text>
        </GlassCard>

        <GlassCard variant="default">
          <Text style={styles.cardLabel}>CONTRIBUTING FACTORS</Text>
          {factors.map((f) => (
            <View key={f.id} style={styles.factorRow}>
              <View style={[styles.factorDot, { backgroundColor: f.color }]} />
              <Text style={styles.factorLabel}>{f.label}</Text>
              <View style={styles.factorControls}>
                <TouchableOpacity style={styles.controlBtn} onPress={() => updatePct(f.id, -5)}><Text style={styles.controlBtnText}>−</Text></TouchableOpacity>
                <Text style={[styles.factorPct, { color: f.color }]}>{f.percentage}%</Text>
                <TouchableOpacity style={styles.controlBtn} onPress={() => updatePct(f.id, 5)}><Text style={styles.controlBtnText}>+</Text></TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => removeFactor(f.id)}><Text style={styles.removeIcon}>✕</Text></TouchableOpacity>
            </View>
          ))}
          <View style={styles.addRow}>
            <TextInput style={styles.addInput} value={newLabel} onChangeText={setNewLabel} placeholder="Add a factor…" placeholderTextColor={colors.textMuted} returnKeyType="done" onSubmitEditing={addFactor} />
            <TouchableOpacity style={styles.addBtn} onPress={addFactor}><Text style={styles.addBtnText}>+</Text></TouchableOpacity>
          </View>
        </GlassCard>

        <GlassCard variant="accent">
          <Text style={styles.cardLabel}>COURTROOM → GARDEN</Text>
          <Text style={styles.reframingTitle}>From Judgment to Cultivation</Text>
          <Text style={styles.reframingDesc}>The Courtroom asks: "What did I do wrong?" The Garden asks: "What can I tend to now?"</Text>
          <Text style={styles.reframingPrompt}>Write your own reframe:</Text>
          <TextInput style={styles.reframingInput} multiline placeholder="Instead of judging myself, I choose to…" placeholderTextColor={colors.textMuted} value={reframing} onChangeText={setReframing} textAlignVertical="top" />
        </GlassCard>

        <ActionButton title="Save to Vault" onPress={handleSave} variant="primary" style={{ marginTop: 8 }} />
        <View style={{ height: 20 }} />
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
  sectionLabel: { ...typography.label, color: colors.coral, marginBottom: 6 },
  pageTitle: { fontSize: 26, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  pageSubtitle: { ...typography.body, color: colors.textSecondary, lineHeight: 24, marginBottom: 24 },
  pieBarContainer: { flexDirection: 'row', height: 24, borderRadius: 12, overflow: 'hidden', marginBottom: 16 },
  pieSegment: { height: '100%' },
  pieLegend: { gap: 6, marginBottom: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { ...typography.bodySmall, flex: 1 },
  legendPct: { fontSize: 13, fontWeight: '700' },
  totalText: { ...typography.label, color: colors.textMuted, textAlign: 'right' },
  cardLabel: { ...typography.label, color: colors.textMuted, marginBottom: 12 },
  factorRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  factorDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  factorLabel: { ...typography.bodySmall, flex: 1 },
  factorControls: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  controlBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center' },
  controlBtnText: { fontSize: 16, color: colors.textPrimary, fontWeight: '700' },
  factorPct: { fontSize: 14, fontWeight: '700', minWidth: 36, textAlign: 'center' },
  removeIcon: { fontSize: 12, color: colors.textMuted, padding: 4 },
  addRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  addInput: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: colors.textPrimary },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.coral, justifyContent: 'center', alignItems: 'center' },
  addBtnText: { fontSize: 22, color: '#FFFFFF', fontWeight: '700', lineHeight: 26 },
  reframingTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  reframingDesc: { ...typography.bodySmall, color: colors.textMuted, lineHeight: 20, marginBottom: 16 },
  reframingPrompt: { ...typography.label, color: colors.textMuted, marginBottom: 8 },
  reframingInput: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 14, minHeight: 100, fontSize: 15, color: colors.textPrimary, lineHeight: 22 },
  savedContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  savedEmoji: { fontSize: 64, marginBottom: 20 },
  savedTitle: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  savedSub: { ...typography.body, textAlign: 'center', color: colors.textSecondary, lineHeight: 26, marginBottom: 32 },
});
