import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '../navigation/AppNavigator';
import ScreenContainer from '../components/ScreenContainer';
import GlassCard from '../components/GlassCard';
import SectionHeader from '../components/SectionHeader';
import QuoteCard from '../components/QuoteCard';
import { colors, radius, typography } from '../theme';
import { useApp } from '../context/AppContext';

type SessionsNavigationProp = CompositeNavigationProp<BottomTabNavigationProp<MainTabParamList, 'Journey'>, NativeStackNavigationProp<RootStackParamList>>;
type Props = { navigation: SessionsNavigationProp };

const PHASES = [
  { title: 'The Raw Edge', modules: [{ title: 'Biology of Grief', icon: '🧠', status: 'RESUMING', color: colors.blue, moduleId: 'biology-of-grief' }, { title: 'Stabilization', icon: '⋋', status: 'LOCKED', color: colors.textMuted, moduleId: 'stabilization' }], featured: { title: 'Safety in Emotions', description: 'Understanding the somatic response to parental loss.', icon: '🛡️', moduleId: 'safety-in-emotions' } },
  { title: 'The Messy Middle', modules: [{ title: 'Guilt & If Onlys', icon: '🔄', status: 'IN PROGRESS', color: colors.coral, moduleId: 'guilt-if-onlys' }, { title: 'Family Dynamics', icon: '👥', status: 'STARTED', color: colors.gold, moduleId: 'family-dynamics' }], featured: { title: 'The Imperfect Parent', description: 'Processing complicated memories with compassion.', icon: '💭', moduleId: 'the-imperfect-parent' } },
  { title: 'Integration', modules: [{ title: 'New Roles', icon: '🌱', status: 'NOT STARTED', color: colors.green, moduleId: 'new-roles' }, { title: 'Meaning Making', icon: '✦', status: 'LOCKED', color: colors.textMuted, moduleId: 'meaning-making' }], featured: null },
];

export default function SessionsScreen({ navigation }: Props) {
  const { moduleProgress } = useApp();
  const [expandedPhase, setExpandedPhase] = useState(0);

  const getStatus = (moduleId: string) => {
    const p = moduleProgress.find(m => m.moduleId === moduleId);
    if (!p) return null;
    return p.status === 'completed' ? 'COMPLETED' : p.status === 'in_progress' ? 'IN PROGRESS' : null;
  };

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitleItalic}>Therapeutic Journey</Text>
          <Text style={styles.headerLabel}>HEALING ROOTS & TIDES</Text>
        </View>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <GlassCard variant="elevated" style={styles.progressCard}>
        <View style={styles.progressRow}>
          <View style={styles.progressIcon}><Text style={styles.progressIconText}>🌿</Text></View>
          <View style={styles.progressInfo}>
            <View style={styles.progressTitleRow}>
              <Text style={styles.progressTitle}>The Sapling Stage</Text>
              <Text style={styles.progressCount}>{moduleProgress.filter(m => m.status === 'completed').length} / {moduleProgress.length || 8} Modules</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, { width: `${Math.min(100, (moduleProgress.filter(m => m.status === 'completed').length / 8) * 100)}%` as any }]} />
            </View>
            <Text style={styles.progressQuote}>Your progress is a circle, not a line.</Text>
          </View>
        </View>
      </GlassCard>

      {PHASES.map((phase, idx) => (
        <View key={phase.title} style={styles.phaseSection}>
          <TouchableOpacity style={styles.phaseTitleRow} onPress={() => setExpandedPhase(expandedPhase === idx ? -1 : idx)}>
            <View style={[styles.phaseDot, { backgroundColor: idx <= 1 ? colors.blue : colors.textMuted }]} />
            <Text style={styles.phaseTitle}>{phase.title}</Text>
            <Text style={styles.phaseChevron}>{expandedPhase === idx ? '▾' : '▸'}</Text>
          </TouchableOpacity>
          {expandedPhase === idx && (
            <View style={styles.phaseContent}>
              <View style={styles.moduleGrid}>
                {phase.modules.map((mod) => {
                  const liveStatus = getStatus(mod.moduleId);
                  const displayStatus = liveStatus || mod.status;
                  const displayColor = liveStatus === 'COMPLETED' ? colors.green : liveStatus === 'IN PROGRESS' ? colors.coral : mod.color;
                  return (
                    <TouchableOpacity key={mod.title} style={styles.moduleCard} onPress={() => navigation.navigate('ModuleDetail', { moduleId: mod.moduleId })}>
                      <View style={[styles.moduleIconCircle, { borderColor: displayColor + '40' }]}><Text style={styles.moduleIcon}>{mod.icon}</Text></View>
                      <Text style={styles.moduleTitle}>{mod.title}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: displayColor + '20' }]}><Text style={[styles.statusText, { color: displayColor }]}>{displayStatus}</Text></View>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {phase.featured && (
                <TouchableOpacity onPress={() => navigation.navigate('ModuleDetail', { moduleId: phase.featured!.moduleId })}>
                  <GlassCard variant="default" style={styles.featuredCard}>
                    <View style={styles.featuredRow}>
                      <View style={styles.featuredIcon}><Text style={{ fontSize: 20 }}>{phase.featured.icon}</Text></View>
                      <View style={styles.featuredInfo}><Text style={styles.featuredTitle}>{phase.featured.title}</Text><Text style={styles.featuredDesc}>{phase.featured.description}</Text></View>
                      <Text style={styles.featuredChevron}>›</Text>
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      ))}

      <SectionHeader title="Module Library" actionText="View All" onAction={() => navigation.navigate('ModuleLibrary')} />
      <TouchableOpacity onPress={() => navigation.navigate('ModuleLibrary')}>
        <GlassCard variant="accent">
          <View style={styles.libraryRow}>
            <Text style={styles.libraryIcon}>📚</Text>
            <View style={{ flex: 1 }}><Text style={styles.libraryTitle}>Browse All Modules</Text><Text style={styles.librarySub}>5 therapeutic pathways available</Text></View>
            <Text style={styles.featuredChevron}>›</Text>
          </View>
        </GlassCard>
      </TouchableOpacity>

      <QuoteCard quote='"Growth is quiet, measured in the depth of your foundations rather than the height of the sun."' />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingTop: 16 },
  headerTitleItalic: { fontSize: 28, fontWeight: '600', fontStyle: 'italic', color: colors.textPrimary, marginBottom: 2 },
  headerLabel: { ...typography.label, color: colors.textMuted },
  settingsBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.backgroundCard, justifyContent: 'center', alignItems: 'center' },
  settingsIcon: { fontSize: 18, color: colors.textSecondary },
  progressCard: { marginBottom: 24 },
  progressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  progressIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(76,175,80,0.15)', justifyContent: 'center', alignItems: 'center' },
  progressIconText: { fontSize: 20 },
  progressInfo: { flex: 1 },
  progressTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  progressTitle: { ...typography.subtitle, fontSize: 16 },
  progressCount: { ...typography.tag, color: colors.blue },
  progressBarContainer: { height: 4, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 8 },
  progressBarFill: { height: '100%', backgroundColor: colors.blue, borderRadius: 2 },
  progressQuote: { ...typography.bodySmall, fontStyle: 'italic', color: colors.textMuted, fontSize: 13 },
  phaseSection: { marginBottom: 8 },
  phaseTitleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  phaseDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  phaseTitle: { ...typography.label, fontSize: 13, color: colors.textSecondary, flex: 1 },
  phaseChevron: { fontSize: 14, color: colors.textMuted },
  phaseContent: { paddingLeft: 20, marginBottom: 16 },
  moduleGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  moduleCard: { flex: 1, backgroundColor: colors.backgroundCard, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 16, alignItems: 'center' },
  moduleIconCircle: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  moduleIcon: { fontSize: 22 },
  moduleTitle: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '600', textAlign: 'center', marginBottom: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  statusText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  featuredCard: { marginBottom: 0 },
  featuredRow: { flexDirection: 'row', alignItems: 'center' },
  featuredIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.06)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  featuredInfo: { flex: 1 },
  featuredTitle: { ...typography.subtitle, fontSize: 15 },
  featuredDesc: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2 },
  featuredChevron: { fontSize: 24, color: colors.textMuted, marginLeft: 8 },
  libraryRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  libraryIcon: { fontSize: 24 },
  libraryTitle: { ...typography.subtitle, fontSize: 15 },
  librarySub: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2 },
});
