import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import GlassCard from '../components/GlassCard';
import ActionButton from '../components/ActionButton';
import QuoteCard from '../components/QuoteCard';
import { colors, radius, typography } from '../theme';
import { useApp } from '../context/AppContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ModuleDetail'>;
  route: RouteProp<RootStackParamList, 'ModuleDetail'>;
};

const MODULE_CONTENT: Record<string, { title: string; category: string; color: string; icon: string; intro: string; sections: { heading: string; body: string }[]; tools: { title: string; description: string; icon: string }[]; quote: string }> = {
  'biology-of-grief': { title: 'Biology of Grief', category: 'THE RAW EDGE', color: colors.blue, icon: '🧠', intro: 'Grief is not just an emotional experience — it is a full-body neurological event. Understanding what is happening in your brain and body can help you meet your grief with compassion rather than confusion.', sections: [{ heading: 'The Stress Response', body: 'When we lose someone, the brain activates the same threat-response systems as physical danger. Cortisol and adrenaline flood the body, creating the physical symptoms of grief: chest tightness, fatigue, difficulty concentrating, and disrupted sleep.' }, { heading: 'The Attachment System', body: 'Our brains are wired for attachment. When a primary attachment figure is lost, the brain continues to search for them — this is why grief can feel like a constant, low-level alarm. This is not weakness; it is biology.' }, { heading: 'Neuroplasticity & Healing', body: 'The brain can and does adapt. Over time, with support and gentle processing, the nervous system learns to integrate the loss. New neural pathways form that hold both the grief and the continuing bond.' }], tools: [{ title: 'Body Scan', description: 'Notice where you hold grief in your body right now', icon: '🫁' }, { title: 'Grounding', description: '5-4-3-2-1 sensory reconnection', icon: '🌿' }], quote: '"Your body is not betraying you. It is grieving alongside you."' },
  'stabilization': { title: 'Stabilization', category: 'THE RAW EDGE', color: colors.blue, icon: '⋋', intro: 'Before we can process grief deeply, we need a stable foundation. This module focuses on building your window of tolerance — the zone in which you can feel without being overwhelmed.', sections: [{ heading: 'The Window of Tolerance', body: 'Developed by Dr. Dan Siegel, the window of tolerance describes the optimal zone of arousal for processing difficult emotions. Too activated and we become overwhelmed; too shut down and we dissociate. Stabilization helps us widen this window.' }, { heading: 'Anchoring Practices', body: 'Anchoring practices are simple, repeatable actions that bring you back to the present moment. Breathing exercises, grounding techniques, and sensory awareness all serve as anchors when grief pulls you under.' }], tools: [{ title: 'Box Breathing', description: 'Regulate your nervous system in 4 minutes', icon: '⋋' }, { title: 'Safe Place Visualization', description: 'Create an inner refuge', icon: '🏡' }], quote: '"Stability is not the absence of waves. It is learning to float."' },
  'guilt-if-onlys': { title: 'Guilt & If Onlys', category: 'THE MESSY MIDDLE', color: colors.coral, icon: '🔄', intro: 'Guilt is one of the most common and painful companions of grief. This module helps you examine these thoughts with compassion rather than judgment.', sections: [{ heading: 'The Nature of Grief Guilt', body: 'Grief guilt often stems from the illusion of control — the belief that we could have changed the outcome. This is a natural cognitive response, but it keeps us trapped in a loop of self-blame that prevents healing.' }, { heading: 'Courtroom vs. Garden', body: 'We often put ourselves on trial for our grief. The Courtroom model asks: "What did I do wrong?" The Garden model asks: "What can I tend to now?" Shifting from judgment to cultivation is the heart of this work.' }, { heading: 'The Responsibility Pie', body: 'No single person bears full responsibility for the complex circumstances of a loss. The Responsibility Pie tool helps you distribute responsibility across all contributing factors.' }], tools: [{ title: 'Responsibility Pie', description: 'Map out contributing factors to your loss', icon: '🔄' }, { title: 'Self-Compassion Letter', description: 'Write to yourself as a dear friend', icon: '💌' }], quote: '"You did the best you could with what you knew then. That is enough."' },
  'family-dynamics': { title: 'Family Dynamics', category: 'THE MESSY MIDDLE', color: colors.gold, icon: '👥', intro: 'Loss reshapes family systems in profound ways. This module helps you navigate the complex terrain of family grief.', sections: [{ heading: 'Grief is Not Uniform', body: 'Each family member grieves differently based on their relationship with the deceased, their attachment style, and their own history.' }, { heading: 'Role Shifts', body: 'When a parent dies, children — regardless of age — often experience a fundamental shift in their sense of place in the family.' }], tools: [{ title: 'Family Map', description: 'Visualize your family grief landscape', icon: '🗺️' }, { title: 'Outreach Scripts', description: 'Navigate difficult conversations', icon: '💬' }], quote: '"We grieve together and alone, simultaneously. Both are valid."' },
  'new-roles': { title: 'New Roles', category: 'INTEGRATION', color: colors.green, icon: '🌱', intro: 'After loss, we are called to inhabit new roles. This module supports that transition.', sections: [{ heading: 'Identity After Loss', body: 'Our identities are partly constructed through our relationships. When a parent dies, a piece of our relational identity shifts.' }, { heading: 'Continuing Bonds', body: 'Modern grief theory recognizes that healthy grieving does not mean "letting go" — it means finding a new way to maintain a bond with the deceased.' }], tools: [{ title: 'Legacy Builder', description: 'Identify values you carry forward', icon: '✦' }, { title: 'New Identity Reflection', description: 'Who are you becoming?', icon: '🌱' }], quote: '"You are not moving on. You are moving forward, carrying them with you."' },
  'meaning-making': { title: 'Meaning Making', category: 'INTEGRATION', color: colors.textMuted, icon: '✦', intro: 'Meaning-making in grief is not about finding a silver lining — it is about discovering what this loss calls forth in you.', sections: [{ heading: 'Post-Traumatic Growth', body: 'Research shows that many people experience significant personal growth following profound loss — not despite the grief, but through it.' }, { heading: 'Legacy as Meaning', body: 'One of the most powerful sources of meaning after loss is legacy — the ways in which the deceased continues to live through us.' }], tools: [{ title: 'Meaning Map', description: 'Explore what this loss has revealed', icon: '✦' }, { title: 'Legacy Letter', description: 'Write about what you carry forward', icon: '📜' }], quote: '"Grief is the price of love. And love is always worth it."' },
  'safety-in-emotions': { title: 'Safety in Emotions', category: 'THE RAW EDGE', color: colors.blue, icon: '🛡️', intro: 'This module helps you build a compassionate relationship with your emotional experience.', sections: [{ heading: 'Emotions as Information', body: 'Emotions are not problems to be solved — they are information about our inner world and our needs.' }, { heading: 'The Wave Model', body: 'Grief often comes in waves — intense, then receding. Learning to ride these waves rather than fight them is a core skill of grief work.' }], tools: [{ title: 'Emotion Surfing', description: 'Ride the wave without being swept away', icon: '🌊' }, { title: 'Feelings Wheel', description: 'Name what you are experiencing', icon: '🎡' }], quote: '"You are not your emotions. You are the sky; they are the weather."' },
  'the-imperfect-parent': { title: 'The Imperfect Parent', category: 'THE MESSY MIDDLE', color: colors.coral, icon: '💭', intro: 'Grieving a complicated relationship is one of the most challenging forms of grief.', sections: [{ heading: 'Ambivalent Grief', body: 'Ambivalent grief — grief for someone with whom we had a complicated relationship — is often disenfranchised, meaning it is not fully recognized by society.' }, { heading: 'Grieving What Never Was', body: 'Sometimes the deepest grief is not for the parent we had, but for the parent we needed and never received.' }], tools: [{ title: 'Unsent Letter', description: 'Say what was never said', icon: '✉️' }, { title: 'Two-Chair Work', description: 'Dialogue with the complicated relationship', icon: '🪑' }], quote: '"You can grieve the parent you had and the parent you needed. Both losses are real."' },
};

export default function ModuleDetailScreen({ navigation, route }: Props) {
  const { moduleId } = route.params;
  const { updateModuleProgress, moduleProgress } = useApp();
  const [currentSection, setCurrentSection] = useState(0);
  const module = MODULE_CONTENT[moduleId];
  const progress = moduleProgress.find(m => m.moduleId === moduleId);
  const status = progress?.status ?? 'not_started';

  if (!module) {
    return (
      <View style={styles.fullScreen}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
          <Text style={styles.errorText}>Module not found</Text>
        </View>
      </View>
    );
  }

  const totalSections = module.sections.length;
  const progressPct = totalSections > 0 ? ((currentSection + 1) / totalSections) * 100 : 0;
  const statusColor = status === 'completed' ? colors.green : status === 'in_progress' ? colors.coral : colors.textMuted;
  const statusLabel = status === 'completed' ? 'COMPLETED' : status === 'in_progress' ? 'IN PROGRESS' : 'NOT STARTED';

  const handleStart = async () => { await updateModuleProgress(moduleId, { status: 'in_progress', currentStep: 0 }); setCurrentSection(0); };
  const handleNext = async () => {
    if (currentSection < totalSections - 1) { const next = currentSection + 1; setCurrentSection(next); await updateModuleProgress(moduleId, { status: 'in_progress', currentStep: next }); }
    else { await updateModuleProgress(moduleId, { status: 'completed', currentStep: totalSections, completedAt: new Date().toISOString() }); }
  };

  return (
    <View style={styles.fullScreen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}><Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text></View>
        </View>
        <View style={[styles.heroCard, { borderColor: module.color + '40' }]}>
          <View style={[styles.heroIcon, { backgroundColor: module.color + '20' }]}><Text style={styles.heroIconText}>{module.icon}</Text></View>
          <Text style={[styles.categoryLabel, { color: module.color }]}>{module.category}</Text>
          <Text style={styles.moduleTitle}>{module.title}</Text>
          <Text style={styles.moduleIntro}>{module.intro}</Text>
        </View>
        {status !== 'not_started' && (
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}><Text style={styles.progressLabel}>Progress</Text><Text style={styles.progressPct}>{Math.round(progressPct)}%</Text></View>
            <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progressPct}%` as any, backgroundColor: module.color }]} /></View>
          </View>
        )}
        {status !== 'not_started' && (
          <GlassCard variant="elevated">
            <Text style={[styles.sectionNum, { color: module.color }]}>Section {currentSection + 1} of {totalSections}</Text>
            <Text style={styles.sectionHeading}>{module.sections[currentSection].heading}</Text>
            <Text style={styles.sectionBody}>{module.sections[currentSection].body}</Text>
            <TouchableOpacity style={[styles.nextBtn, { backgroundColor: module.color }]} onPress={handleNext} activeOpacity={0.8}>
              <Text style={styles.nextBtnText}>{currentSection < totalSections - 1 ? 'Continue →' : 'Complete Module ✓'}</Text>
            </TouchableOpacity>
          </GlassCard>
        )}
        <Text style={styles.toolsHeader}>Interactive Tools</Text>
        {module.tools.map((tool) => (
          <GlassCard key={tool.title} variant="default">
            <View style={styles.toolRow}>
              <View style={[styles.toolIcon, { backgroundColor: module.color + '20' }]}><Text style={styles.toolIconText}>{tool.icon}</Text></View>
              <View style={styles.toolInfo}><Text style={styles.toolTitle}>{tool.title}</Text><Text style={styles.toolDesc}>{tool.description}</Text></View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </GlassCard>
        ))}
        <QuoteCard quote={module.quote} />
        {status === 'not_started' && <ActionButton title="Start Module →" onPress={handleStart} variant="primary" style={{ backgroundColor: module.color }} />}
        {status === 'completed' && <GlassCard variant="default"><View style={styles.completedRow}><Text style={styles.completedIcon}>✓</Text><Text style={styles.completedText}>Module completed! Great work.</Text></View></GlassCard>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 56, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.backgroundCard, justifyContent: 'center', alignItems: 'center' },
  backIcon: { color: colors.textPrimary, fontSize: 20 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.full },
  statusText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  heroCard: { borderRadius: radius.xl, borderWidth: 1, padding: 20, backgroundColor: 'rgba(255,255,255,0.04)', marginBottom: 20 },
  heroIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  heroIconText: { fontSize: 26 },
  categoryLabel: { ...typography.label, marginBottom: 6 },
  moduleTitle: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  moduleIntro: { ...typography.body, lineHeight: 26 },
  progressSection: { marginBottom: 16 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { ...typography.bodySmall, color: colors.textMuted },
  progressPct: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '600' },
  progressTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2 },
  progressFill: { height: '100%', borderRadius: 2 },
  sectionNum: { ...typography.label, marginBottom: 8 },
  sectionHeading: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  sectionBody: { ...typography.body, lineHeight: 26, marginBottom: 20 },
  nextBtn: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: radius.xl, alignItems: 'center', alignSelf: 'flex-end' },
  nextBtnText: { ...typography.buttonText, fontSize: 15 },
  toolsHeader: { ...typography.subtitle, marginBottom: 12, marginTop: 8 },
  toolRow: { flexDirection: 'row', alignItems: 'center' },
  toolIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  toolIconText: { fontSize: 20 },
  toolInfo: { flex: 1 },
  toolTitle: { ...typography.subtitle, fontSize: 15 },
  toolDesc: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2 },
  chevron: { fontSize: 22, color: colors.textMuted },
  completedRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  completedIcon: { fontSize: 24, color: colors.green },
  completedText: { ...typography.subtitle, fontSize: 15, color: colors.green },
  errorText: { ...typography.subtitle, color: colors.textMuted, textAlign: 'center', marginTop: 40 },
});
