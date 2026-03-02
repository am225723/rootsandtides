import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import GlassCard from '../components/GlassCard';
import ActionButton from '../components/ActionButton';
import SectionHeader from '../components/SectionHeader';
import QuoteCard from '../components/QuoteCard';
import { colors, radius, typography } from '../theme';

const COLLECTIONS = [
  { title: 'Unsent Letters', count: '12 ENTRIES', icon: '✉️' },
  { title: 'Voice Notes', count: '4 RECORDINGS', icon: '🎙️' },
  { title: 'Recipe Keeper', count: '8 RECIPES', icon: '📖' },
];

export default function VaultScreen() {
  const [anniversaryMode, setAnniversaryMode] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [entryText, setEntryText] = useState('');

  if (activeModule) {
    return (
      <View style={styles.fullScreen}>
        <View style={styles.moduleContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => { setActiveModule(null); setEntryText(''); }}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.moduleLabel}>GUIDED EXERCISE</Text>
          <Text style={styles.moduleTitle}>
            {activeModule === 'letter' && 'The Unsent Letter'}
            {activeModule === 'legacy' && 'Legacy Builder'}
            {activeModule === 'reflect' && 'Daily Reflection'}
          </Text>

          <Text style={styles.modulePrompt}>
            {activeModule === 'letter' && "Write down what you never got to say. Let the words flow without judgment..."}
            {activeModule === 'legacy' && "What tradition or value do you want to carry forward into your future?"}
            {activeModule === 'reflect' && "What trait of theirs lives in you? How does it show up in your daily life?"}
          </Text>

          <TextInput
            style={styles.textArea}
            multiline
            placeholder="Let your thoughts flow..."
            placeholderTextColor={colors.textMuted}
            value={entryText}
            onChangeText={setEntryText}
          />

          <ActionButton
            title="Save to Vault"
            onPress={() => { setActiveModule(null); setEntryText(''); }}
            variant="primary"
          />
        </View>
      </View>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <Text style={styles.headerLabel}>VAULT & ANNIVERSARY</Text>
        <TouchableOpacity style={styles.calendarBtn}>
          <Text style={styles.calendarIcon}>📅</Text>
        </TouchableOpacity>
      </View>

      <GlassCard variant="warm">
        <View style={styles.anniversaryRow}>
          <View style={styles.anniversaryLeft}>
            <Text style={styles.anniversaryIcon}>📅</Text>
            <Text style={styles.anniversaryTitle}>Anniversary Mode</Text>
          </View>
          <Switch
            value={anniversaryMode}
            onValueChange={setAnniversaryMode}
            trackColor={{ false: 'rgba(255,255,255,0.1)', true: colors.coral }}
            thumbColor="#FFFFFF"
          />
        </View>

        {anniversaryMode && (
          <View style={styles.anniversaryExpanded}>
            <TouchableOpacity style={styles.copingPlanRow}>
              <View style={styles.copingDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.copingTitle}>Coping Plan</Text>
                <Text style={styles.copingSubtitle}>3 STEPS ACTIVE TODAY</Text>
              </View>
              <Text style={styles.copingChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.pauseRow}>
              <View style={styles.pauseIcon}>
                <Text style={{ color: colors.coral }}>⊘</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.pauseTitle}>Pause Everything</Text>
                <Text style={styles.pauseSubtitle}>MUTE NOTIFICATIONS & SOCIAL</Text>
              </View>
              <Switch
                value={true}
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: colors.blue }}
                thumbColor="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        )}
      </GlassCard>

      <GlassCard variant="accent" style={styles.reflectionCard}>
        <Text style={styles.reflectionLabel}>DAILY REFLECTION</Text>
        <Text style={styles.reflectionPrompt}>
          What trait of theirs lives in you?
        </Text>
        <Text style={styles.reflectionSubtitle}>
          Take a moment to honor the connection you still carry in your daily actions.
        </Text>
        <ActionButton
          title="✎ Write Response"
          onPress={() => setActiveModule('reflect')}
          variant="primary"
          style={styles.writeButton}
        />
      </GlassCard>

      <SectionHeader title="Your Collections" actionText="View All" onAction={() => {}} />

      <View style={styles.collectionsGrid}>
        {COLLECTIONS.map((collection) => (
          <TouchableOpacity key={collection.title} style={styles.collectionCard}>
            <View style={styles.collectionIconContainer}>
              <Text style={styles.collectionIcon}>{collection.icon}</Text>
            </View>
            <Text style={styles.collectionTitle}>{collection.title}</Text>
            <Text style={styles.collectionCount}>{collection.count}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.newCollectionCard}>
          <View style={styles.newCollectionPlus}>
            <Text style={styles.plusIcon}>+</Text>
          </View>
          <Text style={styles.newCollectionLabel}>NEW COLLECTION</Text>
        </TouchableOpacity>
      </View>

      <SectionHeader title="Guided Exercises" />

      <TouchableOpacity
        style={styles.exerciseCard}
        onPress={() => setActiveModule('letter')}
        activeOpacity={0.7}
      >
        <GlassCard variant="default">
          <View style={styles.exerciseRow}>
            <View style={[styles.exerciseIconCircle, { backgroundColor: 'rgba(232, 116, 97, 0.12)' }]}>
              <Text style={styles.exerciseIcon}>✉️</Text>
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseTitle}>Unsent Letter</Text>
              <Text style={styles.exerciseSubtitle}>Anger → Grief → Love → Release</Text>
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.exerciseCard}
        onPress={() => setActiveModule('legacy')}
        activeOpacity={0.7}
      >
        <GlassCard variant="default">
          <View style={styles.exerciseRow}>
            <View style={[styles.exerciseIconCircle, { backgroundColor: 'rgba(196, 162, 101, 0.12)' }]}>
              <Text style={styles.exerciseIcon}>✦</Text>
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseTitle}>Legacy Builder</Text>
              <Text style={styles.exerciseSubtitle}>Traits, Traditions, Continuities</Text>
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>

      <QuoteCard
        quote='"The vault is not just storage — it is identity reconstruction, one memory at a time."'
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  moduleContent: {
    flex: 1,
    padding: 24,
    paddingTop: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  backIcon: {
    color: colors.textPrimary,
    fontSize: 20,
  },
  moduleLabel: {
    ...typography.label,
    color: colors.coral,
    marginBottom: 8,
  },
  moduleTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  modulePrompt: {
    ...typography.body,
    fontStyle: 'italic',
    marginBottom: 24,
    lineHeight: 26,
  },
  textArea: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 20,
    minHeight: 200,
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginBottom: 20,
  },
  headerLabel: {
    ...typography.label,
    color: colors.textWarm,
    fontSize: 13,
  },
  calendarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarIcon: {
    fontSize: 18,
  },
  anniversaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  anniversaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  anniversaryIcon: {
    fontSize: 18,
  },
  anniversaryTitle: {
    ...typography.subtitle,
    fontSize: 16,
  },
  anniversaryExpanded: {
    marginTop: 16,
    gap: 10,
  },
  copingPlanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: radius.md,
    padding: 14,
    gap: 10,
  },
  copingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.coral,
  },
  copingTitle: {
    ...typography.subtitle,
    fontSize: 15,
  },
  copingSubtitle: {
    ...typography.label,
    fontSize: 10,
    color: colors.textMuted,
  },
  copingChevron: {
    fontSize: 22,
    color: colors.textMuted,
  },
  pauseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: radius.md,
    padding: 14,
    gap: 10,
  },
  pauseIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(232, 116, 97, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseTitle: {
    ...typography.subtitle,
    fontSize: 15,
  },
  pauseSubtitle: {
    ...typography.label,
    fontSize: 10,
    color: colors.textMuted,
  },
  reflectionCard: {
    alignItems: 'center',
  },
  reflectionLabel: {
    ...typography.label,
    color: colors.coral,
    marginBottom: 12,
  },
  reflectionPrompt: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  reflectionSubtitle: {
    ...typography.bodySmall,
    textAlign: 'center',
    color: colors.textMuted,
    marginBottom: 16,
  },
  writeButton: {
    backgroundColor: colors.coral,
  },
  collectionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  collectionCard: {
    width: '47%',
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    minHeight: 100,
  },
  collectionIconContainer: {
    marginBottom: 10,
  },
  collectionIcon: {
    fontSize: 28,
  },
  collectionTitle: {
    ...typography.subtitle,
    fontSize: 14,
    marginBottom: 4,
  },
  collectionCount: {
    ...typography.label,
    fontSize: 10,
    color: colors.textMuted,
  },
  newCollectionCard: {
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    padding: 16,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newCollectionPlus: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(232, 116, 97, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  plusIcon: {
    fontSize: 20,
    color: colors.coral,
  },
  newCollectionLabel: {
    ...typography.label,
    fontSize: 10,
    color: colors.coral,
  },
  exerciseCard: {
    marginBottom: 0,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  exerciseIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseIcon: {
    fontSize: 22,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitle: {
    ...typography.subtitle,
    fontSize: 16,
  },
  exerciseSubtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 2,
    fontSize: 13,
  },
});
