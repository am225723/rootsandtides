import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Switch } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import GlassCard from '../components/GlassCard';
import { colors, radius, typography } from '../theme';
import { useApp } from '../context/AppContext';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'CopingPlan'> };

const DEFAULT_STEPS = [
  { id: '1', text: 'Allow yourself to feel without judgment — grief is not weakness.', active: true },
  { id: '2', text: "Reach out to one trusted person today, even just to say 'I'm having a hard day.'", active: true },
  { id: '3', text: 'Do one small act of self-care: a walk, a warm drink, a few minutes of stillness.', active: true },
  { id: '4', text: 'Limit social media and news if they feel overwhelming.', active: false },
  { id: '5', text: 'Use the grounding or breathing tools if a wave hits.', active: false },
];

export default function CopingPlanScreen({ navigation }: Props) {
  const { settings, updateSettings, userProfile, updateProfile } = useApp();
  const [steps, setSteps] = useState(DEFAULT_STEPS);
  const [newStep, setNewStep] = useState('');
  const [anniversaryLabel, setAnniversaryLabel] = useState('');
  const [anniversaryDate, setAnniversaryDate] = useState('');

  const toggleStep = (id: string) => setSteps(steps.map(s => s.id === id ? { ...s, active: !s.active } : s));
  const addStep = () => { if (!newStep.trim()) return; setSteps([...steps, { id: Date.now().toString(), text: newStep.trim(), active: true }]); setNewStep(''); };
  const removeStep = (id: string) => setSteps(steps.filter(s => s.id !== id));
  const activeCount = steps.filter(s => s.active).length;

  const handleAddAnniversary = async () => {
    if (!anniversaryLabel.trim() || !anniversaryDate.trim()) return;
    await updateProfile({ anniversaryDates: [...(userProfile.anniversaryDates || []), { id: Date.now().toString(), label: anniversaryLabel.trim(), date: anniversaryDate.trim() }] });
    setAnniversaryLabel(''); setAnniversaryDate('');
  };

  const handleRemoveAnniversary = async (id: string) => {
    await updateProfile({ anniversaryDates: (userProfile.anniversaryDates || []).filter(d => d.id !== id) });
  };

  return (
    <View style={styles.fullScreen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Coping Plan</Text>
          <View style={{ width: 40 }} />
        </View>

        <GlassCard variant="warm">
          <View style={styles.modeRow}>
            <View style={styles.modeLeft}><Text style={styles.modeIcon}>📅</Text><View><Text style={styles.modeTitle}>Anniversary Mode</Text><Text style={styles.modeSub}>Activate on significant dates</Text></View></View>
            <Switch value={settings.anniversaryModeActive} onValueChange={(v) => updateSettings({ anniversaryModeActive: v })} trackColor={{ false: 'rgba(255,255,255,0.1)', true: colors.coral }} thumbColor="#FFFFFF" />
          </View>
          {settings.anniversaryModeActive && <View style={styles.modeActiveInfo}><Text style={styles.modeActiveText}>✓ Anniversary Mode is active. {activeCount} coping steps are ready.</Text></View>}
        </GlassCard>

        <GlassCard variant="default">
          <View style={styles.pauseRow}>
            <View style={styles.pauseLeft}><Text style={styles.pauseIcon}>⊘</Text><View><Text style={styles.pauseTitle}>Pause Everything</Text><Text style={styles.pauseSub}>MUTE NOTIFICATIONS & SOCIAL</Text></View></View>
            <Switch value={settings.pauseNotifications} onValueChange={(v) => updateSettings({ pauseNotifications: v })} trackColor={{ false: 'rgba(255,255,255,0.1)', true: colors.blue }} thumbColor="#FFFFFF" />
          </View>
        </GlassCard>

        <GlassCard variant="elevated">
          <Text style={styles.sectionLabel}>YOUR COPING STEPS</Text>
          <Text style={styles.sectionSub}>{activeCount} steps active today</Text>
          {steps.map((step) => (
            <View key={step.id} style={styles.stepRow}>
              <TouchableOpacity style={[styles.stepCheck, step.active && styles.stepCheckActive]} onPress={() => toggleStep(step.id)}>
                {step.active && <Text style={styles.stepCheckIcon}>✓</Text>}
              </TouchableOpacity>
              <Text style={[styles.stepText, !step.active && styles.stepTextInactive]}>{step.text}</Text>
              <TouchableOpacity onPress={() => removeStep(step.id)}><Text style={styles.removeIcon}>✕</Text></TouchableOpacity>
            </View>
          ))}
          <View style={styles.addStepRow}>
            <TextInput style={styles.addStepInput} value={newStep} onChangeText={setNewStep} placeholder="Add a coping step…" placeholderTextColor={colors.textMuted} returnKeyType="done" onSubmitEditing={addStep} />
            <TouchableOpacity style={styles.addStepBtn} onPress={addStep}><Text style={styles.addStepBtnText}>+</Text></TouchableOpacity>
          </View>
        </GlassCard>

        <GlassCard variant="default">
          <Text style={styles.sectionLabel}>SIGNIFICANT DATES</Text>
          <Text style={styles.sectionSub}>Dates of loss, birthdays, holidays</Text>
          {(userProfile.anniversaryDates || []).length === 0 ? <Text style={styles.noDatesText}>No dates added yet.</Text> : (
            (userProfile.anniversaryDates || []).map((d) => (
              <View key={d.id} style={styles.dateRow}>
                <Text style={styles.dateIcon}>📅</Text>
                <View style={styles.dateInfo}><Text style={styles.dateLabel}>{d.label}</Text><Text style={styles.dateValue}>{d.date}</Text></View>
                <TouchableOpacity onPress={() => handleRemoveAnniversary(d.id)}><Text style={styles.removeIcon}>✕</Text></TouchableOpacity>
              </View>
            ))
          )}
          <View style={styles.addDateSection}>
            <TextInput style={styles.dateInput} value={anniversaryLabel} onChangeText={setAnniversaryLabel} placeholder="Label (e.g. Dad's Birthday)" placeholderTextColor={colors.textMuted} />
            <TextInput style={styles.dateInput} value={anniversaryDate} onChangeText={setAnniversaryDate} placeholder="Date (e.g. March 15)" placeholderTextColor={colors.textMuted} />
            <TouchableOpacity style={styles.addDateBtn} onPress={handleAddAnniversary}><Text style={styles.addDateBtnText}>+ Add Date</Text></TouchableOpacity>
          </View>
        </GlassCard>

        <GlassCard variant="accent">
          <Text style={styles.sectionLabel}>QUICK ACCESS TOOLS</Text>
          <TouchableOpacity style={styles.quickToolRow} onPress={() => navigation.navigate('Grounding')}>
            <Text style={styles.quickToolIcon}>👋</Text><Text style={styles.quickToolText}>5-4-3-2-1 Grounding</Text><Text style={styles.quickToolChevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickToolRow} onPress={() => navigation.navigate('Breathing')}>
            <Text style={styles.quickToolIcon}>⋋</Text><Text style={styles.quickToolText}>Box Breathing</Text><Text style={styles.quickToolChevron}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickToolRow} onPress={() => navigation.navigate('Escalation')}>
            <Text style={styles.quickToolIcon}>⚓</Text><Text style={styles.quickToolText}>SOS Center</Text><Text style={styles.quickToolChevron}>›</Text>
          </TouchableOpacity>
        </GlassCard>
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 56, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.backgroundCard, justifyContent: 'center', alignItems: 'center' },
  backIcon: { color: colors.textPrimary, fontSize: 20 },
  headerTitle: { ...typography.subtitle, fontSize: 18 },
  modeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modeLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  modeIcon: { fontSize: 20 },
  modeTitle: { ...typography.subtitle, fontSize: 15 },
  modeSub: { ...typography.bodySmall, color: colors.textMuted, fontSize: 12 },
  modeActiveInfo: { marginTop: 12, backgroundColor: 'rgba(232,116,97,0.1)', borderRadius: radius.md, padding: 10 },
  modeActiveText: { ...typography.bodySmall, color: colors.coral },
  pauseRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pauseLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pauseIcon: { fontSize: 18, color: colors.coral },
  pauseTitle: { ...typography.subtitle, fontSize: 15 },
  pauseSub: { ...typography.label, fontSize: 10, color: colors.textMuted },
  sectionLabel: { ...typography.label, color: colors.textMuted, marginBottom: 4 },
  sectionSub: { ...typography.bodySmall, color: colors.coral, marginBottom: 16 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  stepCheck: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  stepCheckActive: { backgroundColor: colors.green, borderColor: colors.green },
  stepCheckIcon: { fontSize: 12, color: '#FFFFFF', fontWeight: '700' },
  stepText: { ...typography.bodySmall, flex: 1, lineHeight: 20 },
  stepTextInactive: { color: colors.textMuted, textDecorationLine: 'line-through' },
  removeIcon: { fontSize: 12, color: colors.textMuted, padding: 4 },
  addStepRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  addStepInput: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: colors.textPrimary },
  addStepBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.coral, justifyContent: 'center', alignItems: 'center' },
  addStepBtnText: { fontSize: 22, color: '#FFFFFF', fontWeight: '700', lineHeight: 26 },
  noDatesText: { ...typography.bodySmall, color: colors.textMuted, marginBottom: 12 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  dateIcon: { fontSize: 16 },
  dateInfo: { flex: 1 },
  dateLabel: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '600' },
  dateValue: { ...typography.bodySmall, color: colors.textMuted, fontSize: 12 },
  addDateSection: { marginTop: 8, gap: 8 },
  dateInput: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: colors.textPrimary },
  addDateBtn: { backgroundColor: 'rgba(232,116,97,0.15)', borderRadius: radius.md, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(232,116,97,0.3)' },
  addDateBtnText: { fontSize: 14, fontWeight: '700', color: colors.coral },
  quickToolRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  quickToolIcon: { fontSize: 18, width: 24, textAlign: 'center' },
  quickToolText: { ...typography.bodySmall, flex: 1, color: colors.textPrimary, fontWeight: '600' },
  quickToolChevron: { fontSize: 20, color: colors.textMuted },
});
