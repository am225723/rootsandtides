import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ActionButton from '../components/ActionButton';
import { colors, radius, typography } from '../theme';
import { useApp } from '../context/AppContext';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Intake'> };

const RELATIONSHIP_OPTIONS = [
  { label: 'Mother' }, { label: 'Father' }, { label: 'Stepparent' },
  { label: 'Grandparent' }, { label: 'Complicated', subtitle: 'SENSITIVE PATH' },
];
const MOODS = [
  { label: 'Raw & Heavy', emoji: '🌊' }, { label: 'Numb & Foggy', emoji: '🌫️' },
  { label: 'Anxious & Restless', emoji: '⚡' }, { label: 'Quietly Sad', emoji: '🌧️' },
  { label: 'Seeking Meaning', emoji: '🌱' },
];

export default function IntakeScreen({ navigation }: Props) {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [relationship, setRelationship] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [mood, setMood] = useState<string | null>(null);
  const progressWidths = ['25%', '55%', '85%'];

  const handleContinue = async () => {
    if (step === 0 && relationship) { setStep(1); }
    else if (step === 1) { setStep(2); }
    else if (step === 2 && mood) {
      await completeOnboarding({ name: name.trim() || 'Friend', relationship: relationship!, initialMood: mood });
      if (mood === 'Raw & Heavy') { navigation.replace('Escalation'); }
      else { navigation.replace('Main'); }
    }
  };

  return (
    <KeyboardAvoidingView style={styles.fullScreen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={StyleSheet.absoluteFillObject}>
          <View style={styles.forestBackground} />
          <View style={styles.forestGradient} />
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: progressWidths[step] as any }]} />
        </View>
        {step === 0 && (
          <>
            <Text style={styles.heroTitle}>{'Who did you '}<Text style={styles.heroTitleItalic}>lose?</Text></Text>
            <Text style={styles.heroSubtitle}>We'll tailor your journey based on this unique bond.</Text>
            <View style={styles.optionsContainer}>
              {RELATIONSHIP_OPTIONS.map((option) => (
                <TouchableOpacity key={option.label} style={[styles.optionCard, relationship === option.label && styles.optionCardSelected]} onPress={() => setRelationship(option.label)} activeOpacity={0.8}>
                  <View>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    {option.subtitle && <Text style={styles.optionSubtitle}>{option.subtitle}</Text>}
                  </View>
                  <View style={[styles.radio, relationship === option.label && styles.radioSelected]}>
                    {relationship === option.label && <Text style={styles.radioCheck}>✓</Text>}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        {step === 1 && (
          <>
            <Text style={styles.heroTitle}>{'What should we '}<Text style={styles.heroTitleItalic}>call you?</Text></Text>
            <Text style={styles.heroSubtitle}>This is your safe space. We'll greet you by name.</Text>
            <TextInput style={styles.nameInput} placeholder="Your first name…" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} autoFocus returnKeyType="next" onSubmitEditing={handleContinue} />
            <Text style={styles.skipHint}>You can skip this — we'll call you "Friend"</Text>
          </>
        )}
        {step === 2 && (
          <>
            <Text style={styles.heroTitle}>{'How are you '}<Text style={styles.heroTitleItalic}>arriving?</Text></Text>
            <Text style={styles.heroSubtitle}>There's no wrong answer. This helps us meet you where you are.</Text>
            <View style={styles.moodContainer}>
              {MOODS.map((m) => (
                <TouchableOpacity key={m.label} style={[styles.moodCard, mood === m.label && styles.moodCardSelected]} onPress={() => setMood(m.label)} activeOpacity={0.8}>
                  <Text style={styles.moodEmoji}>{m.emoji}</Text>
                  <Text style={styles.moodLabel}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        <View style={styles.bottomActions}>
          <ActionButton title={step === 2 ? 'Begin Your Journey  →' : 'Continue  →'} onPress={handleContinue} variant={(step === 0 && relationship) || step === 1 || (step === 2 && mood) ? 'primary' : 'secondary'} style={(step === 0 && relationship) || step === 1 || (step === 2 && mood) ? { backgroundColor: step === 2 ? colors.coral : colors.blue } : {}} />
          {step > 0 && <TouchableOpacity style={styles.backBtn} onPress={() => setStep(step - 1)}><Text style={styles.backBtnText}>← Back</Text></TouchableOpacity>}
          <Text style={styles.footerText}>ROOTS & TIDES — GENTLE ONBOARDING</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, padding: 24, paddingTop: 60, paddingBottom: 40 },
  forestBackground: { ...StyleSheet.absoluteFillObject, backgroundColor: '#0A1A12' },
  forestGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', backgroundColor: 'rgba(13,17,23,0.85)' },
  progressBar: { height: 3, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, marginBottom: 40 },
  progressFill: { height: '100%', backgroundColor: colors.blue, borderRadius: 2 },
  heroTitle: { fontSize: 36, fontWeight: '300', color: colors.textPrimary, marginBottom: 12, lineHeight: 44 },
  heroTitleItalic: { fontStyle: 'italic', fontWeight: '400' },
  heroSubtitle: { ...typography.body, color: colors.textSecondary, marginBottom: 36, lineHeight: 24 },
  optionsContainer: { gap: 12 },
  optionCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: radius.lg, padding: 20, marginBottom: 4 },
  optionCardSelected: { borderColor: colors.blue, backgroundColor: 'rgba(74,144,217,0.08)' },
  optionLabel: { fontSize: 20, fontWeight: '600', color: colors.textPrimary },
  optionSubtitle: { ...typography.label, color: colors.blue, marginTop: 4 },
  radio: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  radioSelected: { backgroundColor: colors.blue, borderColor: colors.blue },
  radioCheck: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  nameInput: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: radius.lg, padding: 20, fontSize: 22, color: colors.textPrimary, fontWeight: '300', marginBottom: 12 },
  skipHint: { ...typography.bodySmall, color: colors.textMuted, textAlign: 'center', marginBottom: 8 },
  moodContainer: { gap: 10 },
  moodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: radius.md, padding: 16, marginBottom: 4 },
  moodCardSelected: { borderColor: colors.coral, backgroundColor: 'rgba(232,116,97,0.08)' },
  moodEmoji: { fontSize: 24, marginRight: 16 },
  moodLabel: { fontSize: 17, fontWeight: '500', color: colors.textPrimary },
  bottomActions: { marginTop: 'auto', paddingTop: 32 },
  backBtn: { alignItems: 'center', paddingVertical: 12 },
  backBtnText: { ...typography.body, color: colors.textMuted },
  footerText: { ...typography.label, textAlign: 'center', marginTop: 16, color: colors.textMuted },
});
