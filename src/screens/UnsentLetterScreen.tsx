import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Animated, Easing } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ActionButton from '../components/ActionButton';
import { colors, radius, typography } from '../theme';
import { useApp } from '../context/AppContext';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'UnsentLetter'> };

const STAGES = [
  { key: 'anger', label: 'Anger', icon: '🔥', color: colors.coral, title: 'Let the Anger Speak', prompt: 'What are you angry about? What felt unfair, unfinished, or unjust? Let it out without judgment.', placeholder: 'I am angry that…' },
  { key: 'grief', label: 'Grief', icon: '🌧️', color: colors.blue, title: 'Feel the Grief', prompt: 'What do you miss most? What aches when you think of them? Let the sadness have its voice.', placeholder: 'I miss…' },
  { key: 'love', label: 'Love', icon: '💛', color: colors.gold, title: 'Honor the Love', prompt: 'What did you love about them? What are you grateful for? What do you want them to know about how they mattered?', placeholder: 'I loved…' },
  { key: 'release', label: 'Release', icon: '🌿', color: colors.green, title: 'Release & Ground', prompt: 'What do you want to release? What are you ready to let go of — not the love, but the weight?', placeholder: 'I release…' },
];

export default function UnsentLetterScreen({ navigation }: Props) {
  const { addVaultEntry, vaultCollections, createCollection } = useApp();
  const [currentStage, setCurrentStage] = useState(0);
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const stage = STAGES[currentStage];

  const handleNext = () => {
    if (currentStage < STAGES.length - 1) {
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setCurrentStage(currentStage + 1);
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      });
    } else { handleSave(); }
  };

  const handleSave = async () => {
    let col = vaultCollections.find(c => c.title === 'Unsent Letters');
    if (!col) col = await createCollection('Unsent Letters', '✉️');
    const fullText = STAGES.map(s => `--- ${s.label.toUpperCase()} ---\n${texts[s.key] || '(left blank)'}`).join('\n\n');
    await addVaultEntry({ collectionId: col.id, title: `Unsent Letter — ${new Date().toLocaleDateString()}`, content: fullText, type: 'letter' });
    setSaved(true);
  };

  if (saved) {
    return (
      <View style={styles.fullScreen}>
        <View style={styles.savedContent}>
          <Text style={styles.savedEmoji}>🌿</Text>
          <Text style={styles.savedTitle}>Released & Saved</Text>
          <Text style={styles.savedSub}>Your letter has been saved to your Vault. You've done something brave today.</Text>
          <ActionButton title="Return to Vault" onPress={() => navigation.goBack()} variant="primary" style={{ backgroundColor: colors.green }} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fullScreen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Unsent Letter</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.stageRow}>
          {STAGES.map((s, i) => (
            <TouchableOpacity key={s.key} style={styles.stageItem} onPress={() => i <= currentStage && setCurrentStage(i)}>
              <View style={[styles.stageDot, i === currentStage && { backgroundColor: stage.color, width: 28, height: 28, borderRadius: 14 }, i < currentStage && { backgroundColor: colors.green }]}>
                {i === currentStage && <Text style={styles.stageDotIcon}>{s.icon}</Text>}
                {i < currentStage && <Text style={styles.stageDotCheck}>✓</Text>}
              </View>
              <Text style={[styles.stageLabel, i === currentStage && { color: stage.color }, i < currentStage && { color: colors.green }]}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Animated.View style={[styles.stageContent, { opacity: fadeAnim }]}>
          <View style={[styles.stageHeader, { borderColor: stage.color + '40' }]}>
            <Text style={styles.stageIcon}>{stage.icon}</Text>
            <Text style={[styles.stageTitle, { color: stage.color }]}>{stage.title}</Text>
            <Text style={styles.stagePrompt}>{stage.prompt}</Text>
          </View>
          <TextInput style={styles.textArea} multiline placeholder={stage.placeholder} placeholderTextColor={colors.textMuted} value={texts[stage.key] || ''} onChangeText={(v) => setTexts({ ...texts, [stage.key]: v })} textAlignVertical="top" />
        </Animated.View>
        <View style={styles.navRow}>
          {currentStage > 0 && <TouchableOpacity style={styles.prevBtn} onPress={() => setCurrentStage(currentStage - 1)}><Text style={styles.prevBtnText}>← Back</Text></TouchableOpacity>}
          <TouchableOpacity style={[styles.nextBtn, { backgroundColor: stage.color }]} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.nextBtnText}>{currentStage === STAGES.length - 1 ? '🌿 Release & Ground' : `${STAGES[currentStage + 1].label} →`}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tipBox}><Text style={styles.tipText}>💡 There are no right words. Write whatever comes — even fragments, even silence.</Text></View>
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
  stageRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, paddingHorizontal: 8 },
  stageItem: { alignItems: 'center', gap: 6, flex: 1 },
  stageDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  stageDotIcon: { fontSize: 12 },
  stageDotCheck: { fontSize: 10, color: '#FFFFFF', fontWeight: '700' },
  stageLabel: { fontSize: 11, fontWeight: '600', color: colors.textMuted, textAlign: 'center' },
  stageContent: { marginBottom: 20 },
  stageHeader: { borderRadius: radius.xl, borderWidth: 1, padding: 20, backgroundColor: 'rgba(255,255,255,0.04)', marginBottom: 16, alignItems: 'center' },
  stageIcon: { fontSize: 36, marginBottom: 8 },
  stageTitle: { fontSize: 22, fontWeight: '700', marginBottom: 10 },
  stagePrompt: { ...typography.body, textAlign: 'center', color: colors.textSecondary, lineHeight: 24 },
  textArea: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 20, minHeight: 180, color: colors.textPrimary, fontSize: 16, lineHeight: 26 },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  prevBtn: { paddingVertical: 12, paddingHorizontal: 16 },
  prevBtnText: { ...typography.body, color: colors.textMuted },
  nextBtn: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: radius.xl, marginLeft: 'auto' },
  nextBtnText: { ...typography.buttonText, fontSize: 15 },
  tipBox: { backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.border },
  tipText: { ...typography.bodySmall, color: colors.textMuted, lineHeight: 20 },
  savedContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  savedEmoji: { fontSize: 64, marginBottom: 20 },
  savedTitle: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  savedSub: { ...typography.body, textAlign: 'center', color: colors.textSecondary, lineHeight: 26, marginBottom: 32 },
});
