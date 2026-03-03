import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import GlassCard from '../components/GlassCard';
import ActionButton from '../components/ActionButton';
import { colors, radius, typography } from '../theme';
import { useApp } from '../context/AppContext';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'LegacyBuilder'> };

const SUGGESTED_PAST = ['Resilience', 'Kindness', 'Hard Work', 'Humor', 'Loyalty', 'Wisdom', 'Courage', 'Patience'];
const SUGGESTED_FUTURE = ['Presence', 'Creativity', 'Compassion', 'Growth', 'Joy', 'Service', 'Authenticity', 'Connection'];

export default function LegacyBuilderScreen({ navigation }: Props) {
  const { addVaultEntry, vaultCollections, createCollection } = useApp();
  const [pastValues, setPastValues] = useState<string[]>([]);
  const [futureValues, setFutureValues] = useState<string[]>([]);
  const [pastInput, setPastInput] = useState('');
  const [futureInput, setFutureInput] = useState('');
  const [reflection, setReflection] = useState('');
  const [saved, setSaved] = useState(false);

  const toggle = (list: string[], setList: (v: string[]) => void, value: string) => {
    setList(list.includes(value) ? list.filter(v => v !== value) : [...list, value]);
  };
  const addCustom = (input: string, setInput: (v: string) => void, list: string[], setList: (v: string[]) => void) => {
    const t = input.trim();
    if (t && !list.includes(t)) setList([...list, t]);
    setInput('');
  };

  const handleSave = async () => {
    let col = vaultCollections.find(c => c.title === 'Legacy Plans');
    if (!col) col = await createCollection('Legacy Plans', '✦');
    const content = ['=== VALUES LEARNED ===', pastValues.join(', ') || '(none)', '', '=== VALUES CHOSEN ===', futureValues.join(', ') || '(none)', '', '=== REFLECTION ===', reflection || '(none)'].join('\n');
    await addVaultEntry({ collectionId: col.id, title: `Legacy Plan — ${new Date().toLocaleDateString()}`, content, type: 'legacy' });
    setSaved(true);
  };

  if (saved) {
    return (
      <View style={styles.fullScreen}>
        <View style={styles.savedContent}>
          <Text style={styles.savedEmoji}>✦</Text>
          <Text style={styles.savedTitle}>Legacy Plan Saved</Text>
          <Text style={styles.savedSub}>Your values and intentions have been preserved in your Vault.</Text>
          <ActionButton title="Return to Vault" onPress={() => navigation.goBack()} variant="primary" style={{ backgroundColor: colors.gold }} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fullScreen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Legacy Builder</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.sectionLabel}>LEGACY PROJECT BUILDER</Text>
        <Text style={styles.pageTitle}>What do you carry forward?</Text>
        <Text style={styles.pageSubtitle}>Identify the values you inherited and the values you choose — building a bridge between who they were and who you're becoming.</Text>

        <GlassCard variant="warm">
          <Text style={styles.cardLabel}>VALUES LEARNED</Text>
          <Text style={styles.cardTitle}>Their Past Presence</Text>
          <Text style={styles.cardSub}>What values, traits, or gifts did they pass on to you?</Text>
          <View style={styles.tagsContainer}>
            {[...SUGGESTED_PAST, ...pastValues.filter(v => !SUGGESTED_PAST.includes(v))].map((v) => (
              <TouchableOpacity key={v} style={[styles.tag, pastValues.includes(v) && styles.tagActive]} onPress={() => toggle(pastValues, setPastValues, v)}>
                <Text style={[styles.tagText, pastValues.includes(v) && { color: colors.gold }]}>{v}{pastValues.includes(v) && !SUGGESTED_PAST.includes(v) ? ' ✕' : ''}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.addRow}>
            <TextInput style={styles.addInput} value={pastInput} onChangeText={setPastInput} placeholder="Add your own…" placeholderTextColor={colors.textMuted} returnKeyType="done" onSubmitEditing={() => addCustom(pastInput, setPastInput, pastValues, setPastValues)} />
            <TouchableOpacity style={styles.addBtn} onPress={() => addCustom(pastInput, setPastInput, pastValues, setPastValues)}><Text style={styles.addBtnText}>+</Text></TouchableOpacity>
          </View>
        </GlassCard>

        <GlassCard variant="accent">
          <Text style={styles.cardLabel}>VALUES CHOSEN</Text>
          <Text style={styles.cardTitle}>Your Future Growth</Text>
          <Text style={styles.cardSub}>What values do you consciously choose to cultivate going forward?</Text>
          <View style={styles.tagsContainer}>
            {[...SUGGESTED_FUTURE, ...futureValues.filter(v => !SUGGESTED_FUTURE.includes(v))].map((v) => (
              <TouchableOpacity key={v} style={[styles.tagFuture, futureValues.includes(v) && styles.tagFutureActive]} onPress={() => toggle(futureValues, setFutureValues, v)}>
                <Text style={[styles.tagText, futureValues.includes(v) && { color: colors.coral }]}>{v}{futureValues.includes(v) && !SUGGESTED_FUTURE.includes(v) ? ' ✕' : ''}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.addRow}>
            <TextInput style={styles.addInput} value={futureInput} onChangeText={setFutureInput} placeholder="Add your own…" placeholderTextColor={colors.textMuted} returnKeyType="done" onSubmitEditing={() => addCustom(futureInput, setFutureInput, futureValues, setFutureValues)} />
            <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.coral }]} onPress={() => addCustom(futureInput, setFutureInput, futureValues, setFutureValues)}><Text style={styles.addBtnText}>+</Text></TouchableOpacity>
          </View>
        </GlassCard>

        <GlassCard variant="default">
          <Text style={styles.cardLabel}>REFLECTION</Text>
          <Text style={styles.cardTitle}>How does their light live in you?</Text>
          <TextInput style={styles.reflectionInput} multiline placeholder="Write your reflections here…" placeholderTextColor={colors.textMuted} value={reflection} onChangeText={setReflection} textAlignVertical="top" />
        </GlassCard>

        {(pastValues.length > 0 || futureValues.length > 0) && (
          <GlassCard variant="elevated">
            <Text style={styles.summaryLabel}>YOUR LEGACY BRIDGE</Text>
            {pastValues.length > 0 && <View style={styles.summaryRow}><Text style={styles.summaryIcon}>🌳</Text><Text style={styles.summaryText}><Text style={{ color: colors.gold }}>Inherited: </Text>{pastValues.join(' · ')}</Text></View>}
            {futureValues.length > 0 && <View style={styles.summaryRow}><Text style={styles.summaryIcon}>🌱</Text><Text style={styles.summaryText}><Text style={{ color: colors.coral }}>Chosen: </Text>{futureValues.join(' · ')}</Text></View>}
          </GlassCard>
        )}

        <ActionButton title="✦  Finalize Legacy Plan" onPress={handleSave} variant="primary" style={{ backgroundColor: colors.gold, marginTop: 8 }} />
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
  sectionLabel: { ...typography.label, color: colors.gold, marginBottom: 6 },
  pageTitle: { fontSize: 26, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 },
  pageSubtitle: { ...typography.body, color: colors.textSecondary, lineHeight: 24, marginBottom: 24 },
  cardLabel: { ...typography.label, color: colors.textMuted, marginBottom: 4 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  cardSub: { ...typography.bodySmall, color: colors.textMuted, marginBottom: 16 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  tag: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.04)' },
  tagActive: { backgroundColor: 'rgba(196,162,101,0.2)', borderColor: colors.gold },
  tagFuture: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.04)' },
  tagFutureActive: { backgroundColor: 'rgba(232,116,97,0.2)', borderColor: colors.coral },
  tagText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  addRow: { flexDirection: 'row', gap: 8 },
  addInput: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: colors.textPrimary },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.gold, justifyContent: 'center', alignItems: 'center' },
  addBtnText: { fontSize: 22, color: '#FFFFFF', fontWeight: '700', lineHeight: 26 },
  reflectionInput: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 16, minHeight: 120, color: colors.textPrimary, fontSize: 15, lineHeight: 24, marginTop: 8 },
  summaryLabel: { ...typography.label, color: colors.textMuted, marginBottom: 12 },
  summaryRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  summaryIcon: { fontSize: 18 },
  summaryText: { ...typography.bodySmall, flex: 1, lineHeight: 20 },
  savedContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  savedEmoji: { fontSize: 64, color: colors.gold, marginBottom: 20 },
  savedTitle: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  savedSub: { ...typography.body, textAlign: 'center', color: colors.textSecondary, lineHeight: 26, marginBottom: 32 },
});
