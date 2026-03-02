import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import GlassCard from '../components/GlassCard';
import ActionButton from '../components/ActionButton';
import SectionHeader from '../components/SectionHeader';
import QuoteCard from '../components/QuoteCard';
import { colors, radius, typography } from '../theme';

const RITUALS = [
  {
    title: 'Planting a Seed',
    description: 'A living tribute to their lasting memory',
    badge: 'GROWTH',
    badgeColor: colors.green,
    buttonText: 'Begin Ritual',
    icon: '🌱',
  },
  {
    title: 'Writing an Unsent Letter',
    description: 'Express what was left unsaid in your heart',
    badge: 'RELEASE',
    badgeColor: colors.coral,
    buttonText: 'Start Writing',
    meta: '15-20 min',
    icon: '✉️',
  },
  {
    title: 'Light a Digital Candle',
    description: 'Join a global circle of remembrance',
    badge: 'PRESENCE',
    badgeColor: colors.purple,
    buttonText: 'Light Candle',
    meta: '4,281 candles lit today',
    icon: '🕯️',
  },
];

const SCRIPTS = [
  { title: 'Check in without pressure', preview: 'Hey, just thinking of you. No need to reply...' },
  { title: 'Need distraction', preview: 'Having a rough moment. Could you tell me...' },
  { title: 'Repair template', preview: 'I want to redo how I handled our last...' },
];

export default function CircleScreen() {
  const [activeTab, setActiveTab] = useState<'rituals' | 'connections'>('rituals');

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerTitle}>Rites & Rituals</Text>
          <Text style={styles.headerLabel}>ROOTS & TIDES</Text>
        </View>
        <TouchableOpacity style={styles.searchBtn}>
          <Text style={styles.searchIcon}>⌕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'rituals' && styles.tabActive]}
          onPress={() => setActiveTab('rituals')}
        >
          <Text style={[styles.tabText, activeTab === 'rituals' && styles.tabTextActive]}>
            Rituals
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'connections' && styles.tabActive]}
          onPress={() => setActiveTab('connections')}
        >
          <Text style={[styles.tabText, activeTab === 'connections' && styles.tabTextActive]}>
            Connections
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'rituals' ? (
        <>
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Honor Your</Text>
            <Text style={styles.heroTitleAccent}>Connection</Text>
            <Text style={styles.heroSubtitle}>
              Gentle activities to help you process loss and keep their memory alive.
            </Text>
          </View>

          {RITUALS.map((ritual) => (
            <GlassCard key={ritual.title} variant="default" style={styles.ritualCard}>
              <View style={styles.ritualImagePlaceholder}>
                <Text style={styles.ritualImageIcon}>{ritual.icon}</Text>
              </View>
              <View style={styles.ritualContent}>
                <View style={styles.ritualTitleRow}>
                  <Text style={styles.ritualTitle}>{ritual.title}</Text>
                  <View style={[styles.ritualBadge, { backgroundColor: ritual.badgeColor + '20' }]}>
                    <Text style={[styles.ritualBadgeText, { color: ritual.badgeColor }]}>
                      {ritual.badge}
                    </Text>
                  </View>
                </View>
                <Text style={styles.ritualDescription}>{ritual.description}</Text>
                {ritual.meta && (
                  <Text style={styles.ritualMeta}>⏱ {ritual.meta}</Text>
                )}
                <TouchableOpacity style={[styles.ritualButton, { backgroundColor: ritual.badgeColor }]}>
                  <Text style={styles.ritualButtonText}>{ritual.buttonText}</Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          ))}
        </>
      ) : (
        <>
          <SectionHeader title="Outreach Scripts" />
          {SCRIPTS.map((script) => (
            <GlassCard key={script.title} variant="default">
              <Text style={styles.scriptTitle}>{script.title}</Text>
              <Text style={styles.scriptPreview}>{script.preview}</Text>
              <TouchableOpacity style={styles.useScriptBtn}>
                <Text style={styles.useScriptText}>Use Script →</Text>
              </TouchableOpacity>
            </GlassCard>
          ))}

          <GlassCard variant="accent">
            <View style={styles.escalationHeader}>
              <Text style={styles.escalationIcon}>🛡️</Text>
              <Text style={styles.escalationTitle}>Consent-based Escalation</Text>
            </View>
            <Text style={styles.escalationDescription}>
              "If I hit Anchor twice in 2 hours, ask if I want to notify my emergency contact."
            </Text>
            <View style={styles.escalationToggle}>
              <Text style={styles.escalationStatus}>Status: Enabled</Text>
              <View style={styles.toggleTrack}>
                <View style={styles.toggleThumb} />
              </View>
            </View>
          </GlassCard>
        </>
      )}

      <QuoteCard
        quote='"Connection is the thread that grief cannot sever. It transforms, but never truly breaks."'
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 16,
    marginBottom: 20,
  },
  headerTitle: {
    ...typography.title,
    marginBottom: 2,
  },
  headerLabel: {
    ...typography.label,
    color: colors.coral,
  },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  tabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.textPrimary,
  },
  heroSection: {
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  heroTitleAccent: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.coral,
    marginBottom: 8,
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  ritualCard: {
    padding: 0,
    overflow: 'hidden',
  },
  ritualImagePlaceholder: {
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ritualImageIcon: {
    fontSize: 48,
  },
  ritualContent: {
    padding: 16,
  },
  ritualTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ritualTitle: {
    ...typography.subtitle,
    flex: 1,
  },
  ritualBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  ritualBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  ritualDescription: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: 10,
  },
  ritualMeta: {
    ...typography.tag,
    color: colors.textMuted,
    marginBottom: 12,
  },
  ritualButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: radius.full,
    alignSelf: 'flex-end',
  },
  ritualButtonText: {
    ...typography.buttonText,
    fontSize: 14,
  },
  scriptTitle: {
    ...typography.subtitle,
    fontSize: 16,
    marginBottom: 4,
  },
  scriptPreview: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: 10,
  },
  useScriptBtn: {
    alignSelf: 'flex-end',
  },
  useScriptText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.coral,
  },
  escalationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  escalationIcon: {
    fontSize: 20,
  },
  escalationTitle: {
    ...typography.subtitle,
    fontSize: 16,
  },
  escalationDescription: {
    ...typography.quote,
    fontSize: 14,
    marginBottom: 14,
  },
  escalationToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  escalationStatus: {
    ...typography.bodySmall,
    color: colors.green,
  },
  toggleTrack: {
    width: 48,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.green,
    justifyContent: 'center',
    paddingHorizontal: 3,
    alignItems: 'flex-end',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
});
