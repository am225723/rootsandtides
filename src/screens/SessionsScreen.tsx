import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '../navigation/AppNavigator';
import GlassCardNew from '../components/GlassCardNew';
import SectionHeader from '../components/SectionHeader';
import QuoteCard from '../components/QuoteCard';
import { colors, radius, typography, spacing } from '../theme';
import { useApp } from '../context/AppContext';

type SessionsNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Journey'>,
  NativeStackNavigationProp<RootStackParamList>
>;
type Props = { navigation: SessionsNavigationProp };

const PHASES = [
  {
    title: 'The Raw Edge',
    stage: 'rawEdge',
    modules: [
      { title: 'Biology of Grief', icon: '🧠', status: 'RESUMING', color: colors.blue, moduleId: 'biology-of-grief' },
      { title: 'Stabilization', icon: 'xcb', status: 'LOCKED', color: colors.textMuted, moduleId: 'stabilization' }
    ],
    featured: { title: 'Safety in Emotions', description: 'Understanding the somatic response to parental loss.', icon: '🛡️', moduleId: 'safety-in-emotions' }
  },
  {
    title: 'The Messy Middle',
    stage: 'messyMiddle',
    modules: [
      { title: 'Guilt & If Onlys', icon: '🔄', status: 'IN PROGRESS', color: colors.coral, moduleId: 'guilt-if-onlys' },
      { title: 'Family Dynamics', icon: '👪', status: 'STARTED', color: colors.gold, moduleId: 'family-dynamics' }
    ],
    featured: { title: 'The Imperfect Parent', description: 'Processing complicated memories with compassion.', icon: '💭', moduleId: 'the-imperfect-parent' }
  },
  {
    title: 'Integration',
    stage: 'growth',
    modules: [
      { title: 'New Roles', icon: '🌱', status: 'NOT STARTED', color: colors.green, moduleId: 'new-roles' },
      { title: 'Meaning Making', icon: '✦', status: 'LOCKED', color: colors.textMuted, moduleId: 'meaning-making' }
    ],
    featured: null
  },
];

const STAGE_COLORS = {
  rawEdge: ['#6366F1', '#4F46E5'] as const,
  messyMiddle: ['#EC4899', '#DB2777'] as const,
  growth: ['#10B981', '#059669'] as const,
};

export default function SessionsScreen({ navigation }: Props) {
  const { moduleProgress } = useApp();
  const [expandedPhase, setExpandedPhase] = useState(0);

  const getStatus = (moduleId: string) => {
    const p = moduleProgress.find(m => m.moduleId === moduleId);
    if (!p) return null;
    return p.status === 'completed' ? 'COMPLETED' : p.status === 'in_progress' ? 'IN PROGRESS' : null;
  };

  const completedModules = moduleProgress.filter(m => m.status === 'completed').length;
  const totalModules = moduleProgress.length || 8;
  const progressPercent = Math.min(100, (completedModules / totalModules) * 100);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/bg/forest.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(17, 22, 31, 0.95)', 'rgba(17, 22, 31, 0.85)', 'rgba(17, 22, 31, 0.75)']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </ImageBackground>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Therapeutic Journey</Text>
            <Text style={styles.headerLabel}>HEALING ROOTS & TIDES</Text>
          </View>
          <TouchableOpacity 
            style={styles.settingsBtn} 
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        <GlassCardNew variant="elevated" style={styles.progressCard}>
          <View style={styles.progressRow}>
            <View style={styles.progressIconContainer}>
              <LinearGradient
                colors={['rgba(139, 92, 246, 0.3)', 'rgba(139, 92, 246, 0.1)']}
                style={styles.progressIconGradient}
              >
                <Text style={styles.progressIconText}>🌿</Text>
              </LinearGradient>
            </View>
            <View style={styles.progressInfo}>
              <View style={styles.progressTitleRow}>
                <Text style={styles.progressTitle}>The Sapling Stage</Text>
                <Text style={styles.progressCount}>{completedModules} / {totalModules} Modules</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <LinearGradient
                  colors={['#8B5CF6', '#6366F1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
                />
              </View>
              <Text style={styles.progressQuote}>Your progress is a circle, not a line.</Text>
            </View>
          </View>
        </GlassCardNew>

        {PHASES.map((phase, idx) => {
          const stageColor = STAGE_COLORS[phase.stage as keyof typeof STAGE_COLORS] || STAGE_COLORS.rawEdge;
          const isExpanded = expandedPhase === idx;
          
          return (
            <View key={phase.title} style={styles.phaseSection}>
              <TouchableOpacity
                style={styles.phaseTitleRow}
                onPress={() => setExpandedPhase(isExpanded ? -1 : idx)}
              >
                <LinearGradient
                  colors={stageColor}
                  style={styles.phaseDot}
                />
                <Text style={styles.phaseTitle}>{phase.title}</Text>
                <Text style={styles.phaseChevron}>{isExpanded ? '▾' : '▸'}</Text>
              </TouchableOpacity>
              
              {isExpanded && (
                <View style={styles.phaseContent}>
                  <View style={styles.moduleGrid}>
                    {phase.modules.map((mod) => {
                      const liveStatus = getStatus(mod.moduleId);
                      const displayStatus = liveStatus || mod.status;
                      const displayColor = liveStatus === 'COMPLETED'
                        ? colors.green
                        : liveStatus === 'IN PROGRESS'
                          ? colors.coral
                          : mod.color;
                      
                      return (
                        <TouchableOpacity
                          key={mod.title}
                          style={styles.moduleCard}
                          onPress={() => navigation.navigate('ModuleDetail', { moduleId: mod.moduleId })}
                        >
                          <View style={[styles.moduleIconCircle, { borderColor: displayColor + '60' }]}>
                            <Text style={styles.moduleIcon}>{mod.icon}</Text>
                          </View>
                          <Text style={styles.moduleTitle}>{mod.title}</Text>
                          <View style={[styles.statusBadge, { backgroundColor: displayColor + '20' }]}>
                            <Text style={[styles.statusText, { color: displayColor }]}>
                              {displayStatus}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  
                  {phase.featured && (
                    <TouchableOpacity
                      onPress={() => navigation.navigate('ModuleDetail', { moduleId: phase.featured!.moduleId })}
                      style={styles.featuredCard}
                    >
                      <GlassCardNew variant="default" noPadding={true}>
                        <View style={styles.featuredContent}>
                          <View style={styles.featuredIcon}>
                            <Text style={styles.featuredIconText}>{phase.featured.icon}</Text>
                          </View>
                          <View style={styles.featuredInfo}>
                            <Text style={styles.featuredTitle}>{phase.featured.title}</Text>
                            <Text style={styles.featuredDesc}>{phase.featured.description}</Text>
                          </View>
                          <Text style={styles.featuredChevron}>›</Text>
                        </View>
                      </GlassCardNew>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.sectionSpacing}>
          <SectionHeader
            title="Module Library"
            actionText="View All"
            onAction={() => navigation.navigate('ModuleLibrary')}
          />
        </View>
        
        <TouchableOpacity onPress={() => navigation.navigate('ModuleLibrary')}>
          <GlassCardNew variant="accent">
            <View style={styles.libraryRow}>
              <Text style={styles.libraryIcon}>📚</Text>
              <View style={styles.libraryInfo}>
                <Text style={styles.libraryTitle}>Browse All Modules</Text>
                <Text style={styles.librarySub}>5 therapeutic pathways available</Text>
              </View>
              <Text style={styles.featuredChevron}>›</Text>
            </View>
          </GlassCardNew>
        </TouchableOpacity>

        <View style={styles.sectionSpacing}>
          <QuoteCard quote='"Growth is quiet, measured in the depth of your foundations rather than the height of the sun."' />
        </View>
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.dark,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingTop: spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
    paddingTop: spacing.md,
  },
  headerTitle: {
    ...typography.heroTitleSerif,
    fontSize: 32,
    marginBottom: 4,
  },
  headerLabel: {
    ...typography.label,
    color: colors.textMuted,
  },
  settingsBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 20,
  },
  progressCard: {
    marginBottom: spacing.xl,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  progressIconContainer: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressIconGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressIconText: {
    fontSize: 24,
  },
  progressInfo: {
    flex: 1,
  },
  progressTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressTitle: {
    ...typography.subtitle,
    fontSize: 16,
  },
  progressCount: {
    ...typography.tag,
    color: colors.accentBlue,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: radius.full,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: radius.full,
  },
  progressQuote: {
    ...typography.bodySmall,
    fontStyle: 'italic',
    color: colors.textMuted,
    fontSize: 13,
  },
  phaseSection: {
    marginBottom: spacing.sm,
  },
  phaseTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  phaseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.md,
  },
  phaseTitle: {
    ...typography.label,
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  phaseChevron: {
    fontSize: 14,
    color: colors.textMuted,
  },
  phaseContent: {
    paddingLeft: spacing.xl,
    marginBottom: spacing.md,
  },
  moduleGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  moduleCard: {
    flex: 1,
    backgroundColor: colors.surface.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
  },
  moduleIconCircle: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  moduleIcon: {
    fontSize: 24,
  },
  moduleTitle: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  statusText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  featuredCard: {
    marginTop: spacing.xs,
  },
  featuredContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  featuredIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  featuredIconText: {
    fontSize: 20,
  },
  featuredInfo: {
    flex: 1,
  },
  featuredTitle: {
    ...typography.subtitle,
    fontSize: 16,
  },
  featuredDesc: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 2,
  },
  featuredChevron: {
    fontSize: 28,
    color: colors.textMuted,
    marginLeft: spacing.sm,
  },
  sectionSpacing: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  libraryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  libraryIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  libraryInfo: {
    flex: 1,
  },
  libraryTitle: {
    ...typography.subtitle,
    fontSize: 16,
  },
  librarySub: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 2,
  },
  bottomSpacing: {
    height: spacing.xxl,
  },
});