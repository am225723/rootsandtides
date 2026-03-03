import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ActionButton from '../components/ActionButton';
import { colors, radius, typography } from '../theme';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Grounding'> };

const STEPS = [
  { count: 5, sense: 'See', icon: '👁️', color: colors.blue, prompt: 'Name 5 things you can see right now.', placeholder: 'e.g. a lamp, my hands, the ceiling…' },
  { count: 4, sense: 'Touch', icon: '✋', color: colors.green, prompt: 'Name 4 things you can physically touch or feel.', placeholder: 'e.g. the chair beneath me, my shirt…' },
  { count: 3, sense: 'Hear', icon: '👂', color: colors.gold, prompt: 'Name 3 things you can hear right now.', placeholder: 'e.g. traffic outside, my breathing…' },
  { count: 2, sense: 'Smell', icon: '👃', color: colors.coral, prompt: 'Name 2 things you can smell (or recently smelled).', placeholder: 'e.g. coffee, fresh air…' },
  { count: 1, sense: 'Taste', icon: '👅', color: colors.purple, prompt: 'Name 1 thing you can taste right now.', placeholder: 'e.g. toothpaste, water…' },
];

export default function GroundingScreen({ navigation }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState<string[][]>(STEPS.map(s => Array(s.count).fill('')));
  const [completed, setCompleted] = useState(false);
  const step = STEPS[currentStep];
  const stepInputs = inputs[currentStep];
  const updateInput = (idx: number, value: string) => {
    setInputs(inputs.map((arr, si) => si === currentStep ? arr.map((v, i) => i === idx ? value : v) : arr));
  };
  const canAdvance = stepInputs.some(v => v.trim().length > 0);
  const handleNext = () => { if (currentStep < STEPS.length - 1) { setCurrentStep(currentStep + 1); } else { setCompleted(true); } };

  if (completed) {
    return (
      <View style={styles.fullScreen}>
        <View style={styles.completedContent}>
          <Text style={styles.completedEmoji}>🌿</Text>
          <Text style={styles.completedTitle}>You're grounded.</Text>
          <Text style={styles.completedSubtitle}>You've reconnected with the present moment. Take a slow breath and notice how you feel.</Text>
          <ActionButton title="Return to Safety" onPress={() => navigation.goBack()} variant="primary" style={{ backgroundColor: colors.green }} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fullScreen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>5-4-3-2-1 Grounding</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.progressDots}>
          {STEPS.map((s, i) => <View key={i} style={[styles.dot, i === currentStep && { backgroundColor: step.color, width: 24 }, i < currentStep && { backgroundColor: colors.green }]} />)}
        </View>
        <View style={[styles.stepCard, { borderColor: step.color + '40' }]}>
          <View style={[styles.stepIconCircle, { backgroundColor: step.color + '20' }]}><Text style={styles.stepIcon}>{step.icon}</Text></View>
          <Text style={[styles.stepCount, { color: step.color }]}>{step.count}</Text>
          <Text style={styles.stepSense}>things you can {step.sense.toLowerCase()}</Text>
          <Text style={styles.stepPrompt}>{step.prompt}</Text>
        </View>
        <View style={styles.inputsContainer}>
          {stepInputs.map((val, idx) => (
            <View key={idx} style={styles.inputRow}>
              <View style={[styles.inputNum, { backgroundColor: step.color + '20' }]}><Text style={[styles.inputNumText, { color: step.color }]}>{idx + 1}</Text></View>
              <TextInput style={styles.input} value={val} onChangeText={(v) => updateInput(idx, v)} placeholder={idx === 0 ? step.placeholder : `Item ${idx + 1}…`} placeholderTextColor={colors.textMuted} returnKeyType="next" />
              {val.trim().length > 0 && <Text style={[styles.checkmark, { color: step.color }]}>✓</Text>}
            </View>
          ))}
        </View>
        <View style={styles.navRow}>
          {currentStep > 0 && <TouchableOpacity style={styles.prevBtn} onPress={() => setCurrentStep(currentStep - 1)}><Text style={styles.prevBtnText}>← Back</Text></TouchableOpacity>}
          <TouchableOpacity style={[styles.nextBtn, { backgroundColor: canAdvance ? step.color : 'rgba(255,255,255,0.1)', marginLeft: currentStep === 0 ? 'auto' : 0 } as any]} onPress={handleNext} disabled={!canAdvance} activeOpacity={0.8}>
            <Text style={styles.nextBtnText}>{currentStep === STEPS.length - 1 ? 'Complete ✓' : 'Next →'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tipBox}><Text style={styles.tipText}>💡 You don't need to fill every field. Even one answer per step helps anchor you to the present.</Text></View>
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
  progressDots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 28 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.15)' },
  stepCard: { borderRadius: radius.xl, borderWidth: 1, padding: 24, backgroundColor: 'rgba(255,255,255,0.04)', alignItems: 'center', marginBottom: 24 },
  stepIconCircle: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  stepIcon: { fontSize: 30 },
  stepCount: { fontSize: 56, fontWeight: '700', lineHeight: 64 },
  stepSense: { fontSize: 18, color: colors.textSecondary, marginBottom: 8 },
  stepPrompt: { ...typography.body, textAlign: 'center', color: colors.textMuted, lineHeight: 22 },
  inputsContainer: { gap: 10, marginBottom: 24 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  inputNum: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  inputNumText: { fontSize: 14, fontWeight: '700' },
  input: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: colors.textPrimary },
  checkmark: { fontSize: 18, fontWeight: '700' },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  prevBtn: { paddingVertical: 12, paddingHorizontal: 20 },
  prevBtnText: { ...typography.body, color: colors.textMuted },
  nextBtn: { paddingVertical: 14, paddingHorizontal: 28, borderRadius: radius.xl },
  nextBtnText: { ...typography.buttonText, fontSize: 15 },
  tipBox: { backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.border },
  tipText: { ...typography.bodySmall, color: colors.textMuted, lineHeight: 20 },
  completedContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  completedEmoji: { fontSize: 64, marginBottom: 20 },
  completedTitle: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  completedSubtitle: { ...typography.body, textAlign: 'center', color: colors.textSecondary, lineHeight: 26, marginBottom: 32 },
});
