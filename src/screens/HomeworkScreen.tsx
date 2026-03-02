import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import GlassCard from '../components/GlassCard';
import ActionButton from '../components/ActionButton';
import SectionHeader from '../components/SectionHeader';
import QuoteCard from '../components/QuoteCard';
import { colors, radius, typography } from '../theme';

const PROCESSING_TOOLS = [
  {
    title: 'Processing Guilt',
    subtitle: 'The Responsibility Pie Tool',
    description: 'Map out the different factors that contributed to your loss to challenge overwhelming feelings of individual blame.',
    tags: ['CBT Based', '15 min'],
    icon: '🔄',
  },
  {
    title: 'The Unsent Letter',
    subtitle: 'Expressive Compassion Tool',
    description: 'Write to your parent or parental figure about things left unsaid. Focus on forgiveness and release.',
    tags: ['Writing', 'Deep Dive'],
    icon: '✉️',
  },
];

export default function HomeworkScreen() {
  const [capacityLevel, setCapacityLevel] = useState(0.4);

  return (
    <ScreenContainer>
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Grief Work</Text>
        <TouchableOpacity style={styles.infoBtn}>
          <Text style={styles.infoBtnText}>ⓘ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.heroBanner}>
        <View style={styles.heroOverlay}>
          <Text style={styles.heroLabel}>DUAL PROCESS MODEL</Text>
          <Text style={styles.heroTitle}>Processing the Depths</Text>
          <Text style={styles.heroSubtitle}>
            Confronting the pain of loss through active emotional labor.
          </Text>
        </View>
      </View>

      <GlassCard variant="accent" style={styles.capacityCard}>
        <View style={styles.capacityHeader}>
          <View style={styles.capacityLeft}>
            <Text style={styles.capacityIcon}>⚓</Text>
            <Text style={styles.capacityTitle}>Current Emotional Capacity</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.checkInLink}>CHECK-IN</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.capacityBarContainer}>
          <View style={styles.capacityBarTrack}>
            <View style={[styles.capacityBarFill, { width: `${capacityLevel * 100}%` }]} />
            <View style={[styles.capacityDot, { left: `${capacityLevel * 100}%` }]} />
          </View>
          <View style={styles.capacityLabels}>
            <Text style={styles.capacityLabel}>Resting</Text>
            <Text style={styles.capacityLabel}>Capable</Text>
          </View>
        </View>
        <Text style={styles.capacityQuote}>
          "Be gentle with yourself. Depth requires energy."
        </Text>
      </GlassCard>

      <SectionHeader
        title="Active Processing Tools"
        actionText="View Library"
        onAction={() => {}}
      />

      {PROCESSING_TOOLS.map((tool) => (
        <GlassCard key={tool.title} variant="default">
          <TouchableOpacity style={styles.toolRow} activeOpacity={0.7}>
            <View style={styles.toolIconCircle}>
              <Text style={styles.toolIcon}>{tool.icon}</Text>
            </View>
            <View style={styles.toolInfo}>
              <Text style={styles.toolTitle}>{tool.title}</Text>
              <Text style={styles.toolSubtitle}>{tool.subtitle}</Text>
            </View>
            <Text style={styles.toolChevron}>›</Text>
          </TouchableOpacity>
          <Text style={styles.toolDescription}>{tool.description}</Text>
          <View style={styles.tagRow}>
            {tool.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </GlassCard>
      ))}

      <ActionButton
        title="⚓  Start Today's Reflection"
        onPress={() => {}}
        variant="primary"
        style={styles.reflectionButton}
      />

      <QuoteCard
        quote='"Healing is not the absence of grief, but the presence of light within the mist."'
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginBottom: 16,
  },
  headerTitle: {
    ...typography.title,
  },
  infoBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.coral,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  heroBanner: {
    backgroundColor: '#1A0A0A',
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: 20,
    height: 160,
    justifyContent: 'flex-end',
  },
  heroOverlay: {
    padding: 20,
    backgroundColor: 'rgba(26, 10, 10, 0.7)',
  },
  heroLabel: {
    ...typography.label,
    color: colors.coral,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  heroSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  capacityCard: {
    marginBottom: 24,
  },
  capacityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  capacityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  capacityIcon: {
    fontSize: 16,
    color: colors.coral,
  },
  capacityTitle: {
    ...typography.subtitle,
    fontSize: 15,
  },
  checkInLink: {
    ...typography.label,
    color: colors.coral,
    fontSize: 12,
  },
  capacityBarContainer: {
    marginBottom: 12,
  },
  capacityBarTrack: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    position: 'relative',
    marginBottom: 6,
  },
  capacityBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.coral,
  },
  capacityDot: {
    position: 'absolute',
    top: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.coral,
    borderWidth: 2,
    borderColor: colors.background,
    marginLeft: -7,
  },
  capacityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  capacityLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontSize: 12,
  },
  capacityQuote: {
    ...typography.quote,
    fontSize: 13,
    textAlign: 'center',
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  toolIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(232, 116, 97, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(232, 116, 97, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  toolIcon: {
    fontSize: 20,
  },
  toolInfo: {
    flex: 1,
  },
  toolTitle: {
    ...typography.subtitle,
    fontSize: 16,
  },
  toolSubtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 1,
    fontSize: 13,
  },
  toolChevron: {
    fontSize: 24,
    color: colors.textMuted,
  },
  toolDescription: {
    ...typography.bodySmall,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagText: {
    ...typography.tag,
    fontSize: 11,
  },
  reflectionButton: {
    marginTop: 8,
    marginBottom: 8,
  },
});
