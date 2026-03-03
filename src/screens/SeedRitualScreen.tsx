import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ActionButton from '../components/ActionButton';
import GlassCard from '../components/GlassCard';
import { colors, radius, typography } from '../theme';
import { useApp } from '../context/AppContext';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'SeedRitual'> };

const STEPS = [
  { key: 'intention', icon: '🌱', title: 'Set Your Intention', prompt: 'What do you want this seed to represent? What are you planting in their memory?', placeholder: 'I plant this seed to represent…', color: colors.green },
  { key: 'naming', icon: '🏷️', title: 'Name Your Seed', prompt: 'Give your seed a name — a word, a quality, or a hope that you want to grow.', placeholder: 'My seed is called…', color: colors.gold },
  { key: 'visualization', icon: '☀️', title: 'Visualize Its Growth', prompt: 'Close your eyes for a moment. Imagine this seed growing. What does it become? What does it look like when it blooms?', placeholder: 'When this seed blooms, I see…', color: colors.blue },
  { key: 'commitment', icon: '🤲', title: 'Make a Commitment', prompt: 'What small action will you take this week to tend to this seed — to honor what it represents?', placeholder: 'This week, I will…', color: colors.coral },
];

export default function SeedRitualScreen({ navigation }: Props) {
  const { addVaultEntry, vaultCollections, createCollection } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const step = STEPS[currentStep];

  const handleNext = () => { if (currentStep < STEPS.length - 1) { setCurrentStep(currentStep + 1); } else { handleComplete(); } };

  const handleComplete = async () => {
    let col = vaultCollections.find(c => c.title === 'Rituals');
    if (!col) col = await createCollection('Rituals', '🌱');
    const seedName = inputs['naming'] || 'Unnamed Seed';
    const content = STEPS.map(s => `${s.title.toUpperCase()}\n${inputs[s.key] || '(left blank)'}`).join('\n\n');
    await addVaultEntry({ collectionId: col.id, title: `Seed Ritual: "${seedName}" — ${new Date().toLocaleDateString()}`, content, type: 'ritual' });
    setCompleted(true);
  };

  if (completed) {
    const seedName = inputs['naming'] || 'your seed';
    return (
      <View style={styles.fullScreen}>
        <View style={styles.completedContent}>
          <Text style={styles.completedEmoji}>🌱</Text>
          <Text style={styles.completedTitle}>"{seedName}" is planted.</Text>
          <Text style={styles.completedSub}>Your ritual has been recorded in your Vault. May this seed grow in the light of their memory.</Text>
          <ActionButton title="Return to Rituals" onPress={() => navigation.goBack()} variant="primary" style={{ backgroundColor: colors.green }} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fullScreen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Planting a Seed</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.progressRow}>
          {STEPS.map((s, i) => (
            <View key={s.key} style={styles.progressItem}>
              <View style={[styles.progressDot, i === currentStep && { backgroundColor: step.color, width: 32, height: 32, borderRadius: 16 }, i < currentStep && { backgroundColor: colors.green }]}>
                {i === currentStep && <Text style={styles.progressDotIcon}>{s.icon}</Text>}
                {i < currentStep && <Text style={styles.progressCheck}>✓</Text>}
              </View>
              {i < STEPS.length - 1 && <View style={[styles.progressLine, i < currentStep && { backgroundColor: colors.green }]} />}
            </View>
          ))}
        </View>
        <GlassCard variant="elevated" style={[styles.stepCard, { borderColor: step.color + '40' }]}>
          <Text style={styles.stepNum}>Step {currentStep + 1} of {STEPS.length}</Text>
          <View style={[styles.stepIconCircle, { backgroundColor: step.color + '20' }]}><Text style={styles.stepIcon}>{step.icon}</Text></View>
          <Text style={[styles.stepTitle, { color: step.color }]}>{step.title}</Text>
          <Text style={styles.stepPrompt}>{step.prompt}</Text>
        </GlassCard>
        <TextInput style={styles.input} multiline placeholder={step.placeholder} placeholderTextColor={colors.textMuted} value={inputs[step.key] || ''} onChangeText={(v) => setInputs({ ...inputs, [step.key]: v })} textAlignVertical="top" />
        {step.key === 'visualization' && (
          <GlassCard variant="default" style={styles.mindfulCard}>
            <Text style={styles.mindfulIcon}>🧘</Text>
            <Text style={styles.mindfulText}>Take a slow breath. Close your eyes for 30 seconds. Let the image come naturally.</Text>
          </GlassCard>
        )}
        <View style={styles.navRow}>
          {currentStep > 0 && <TouchableOpacity style={styles.prevBtn} onPress={() => setCurrentStep(currentStep - 1)}><Text style={styles.prevBtnText}>← Back</Text></TouchableOpacity>}
          <TouchableOpacity style={[styles.nextBtn, { backgroundColor: step.color }]} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.nextBtnText}>{currentStep === STEPS.length - 1 ? '🌱 Plant the Seed' : 'Next →'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 56, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.backgroundCard, justifyContent: 'center', alignItems: 'center' },
  backIcon: { color: colors.textPrimary, fontSize: 20 },
  headerTitle: { ...typography.subtitle, fontSize: 17 },
  progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 28, paddingHorizontal: 16 },
  progressItem: { flexDirection: 'row', alignItems: 'center' },
  progressDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  progressDotIcon: { fontSize: 14 },
  progressCheck: { fontSize: 10, color: '#FFFFFF', fontWeight: '700' },
  progressLine: { width: 32, height: 2, backgroundColor: 'rgba(255,255,255,0.15)', marginHorizontal: 4 },
  stepCard: { marginBottom: 16, alignItems: 'center' },
  stepNum: { ...typography.label, color: colors.textMuted, marginBottom: 12 },
  stepIconCircle: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  stepIcon: { fontSize: 30 },
  stepTitle: { fontSize: 22, fontWeight: '700', marginBottom: 10 },
  stepPrompt: { ...typography.body, textAlign: 'center', color: colors.textSecondary, lineHeight: 24 },
  input: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 18, minHeight: 140, fontSize: 16, color: colors.textPrimary, lineHeight: 26, marginBottom: 16 },
  mindfulCard: { marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  mindfulIcon: { fontSize: 24 },
  mindfulText: { ...typography.bodySmall, color: colors.textMuted, flex: 1, lineHeight: 20 },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  prevBtn: { paddingVertical: 12, paddingHorizontal: 16 },
  prevBtnText: { ...typography.body, color: colors.textMuted },
  nextBtn: { paddingVertical: 14, paddingHorizontal: 28, borderRadius: radius.xl, marginLeft: 'auto' },
  nextBtnText: { ...typography.buttonText, fontSize: 15 },
  completedContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  completedEmoji: { fontSize: 72, marginBottom: 20 },
  completedTitle: { fontSize: 24, fontWeight: '700', color: colors.textPrimary, marginBottom: 12, textAlign: 'center' },
  completedSub: { ...typography.body, textAlign: 'center', color: colors.textSecondary, lineHeight: 26, marginBottom: 32 },
});
