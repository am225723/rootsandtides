import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, Modal, Alert } from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '../navigation/AppNavigator';
import ScreenContainer from '../components/ScreenContainer';
import GlassCard from '../components/GlassCard';
import ActionButton from '../components/ActionButton';
import SectionHeader from '../components/SectionHeader';
import QuoteCard from '../components/QuoteCard';
import EmptyState from '../components/EmptyState';
import { colors, radius, typography } from '../theme';
import { useApp } from '../context/AppContext';
import { getTodayPrompt } from '../services/prompts';

type VaultNavigationProp = CompositeNavigationProp<BottomTabNavigationProp<MainTabParamList, 'Vault'>, NativeStackNavigationProp<RootStackParamList>>;
type Props = { navigation: VaultNavigationProp };

export default function VaultScreen({ navigation }: Props) {
  const { settings, updateSettings, vaultCollections, vaultEntries, createCollection } = useApp();
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);
  const [newCollectionTitle, setNewCollectionTitle] = useState('');
  const [newCollectionIcon, setNewCollectionIcon] = useState('📁');

  const ICON_OPTIONS = ['📁', '✉️', '🎵', '📖', '🌱', '💛', '🕯️', '🌊', '✦', '🏡'];

  const handleCreateCollection = async () => {
    if (!newCollectionTitle.trim()) return;
    await createCollection(newCollectionTitle.trim(), newCollectionIcon);
    setNewCollectionTitle('');
    setNewCollectionIcon('📁');
    setShowNewCollectionModal(false);
  };

  const getEntryCount = (collectionId: string) => vaultEntries.filter(e => e.collectionId === collectionId).length;

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <Text style={styles.headerLabel}>VAULT & ANNIVERSARY</Text>
        <TouchableOpacity style={styles.calendarBtn} onPress={() => navigation.navigate('CopingPlan')}>
          <Text style={styles.calendarIcon}>📅</Text>
        </TouchableOpacity>
      </View>

      <GlassCard variant="warm">
        <View style={styles.anniversaryRow}>
          <View style={styles.anniversaryLeft}><Text style={styles.anniversaryIcon}>📅</Text><Text style={styles.anniversaryTitle}>Anniversary Mode</Text></View>
          <Switch value={settings.anniversaryModeActive} onValueChange={(v) => updateSettings({ anniversaryModeActive: v })} trackColor={{ false: 'rgba(255,255,255,0.1)', true: colors.coral }} thumbColor="#FFFFFF" />
        </View>
        {settings.anniversaryModeActive && (
          <View style={styles.anniversaryExpanded}>
            <TouchableOpacity style={styles.copingPlanRow} onPress={() => navigation.navigate('CopingPlan')}>
              <View style={styles.copingDot} />
              <View style={{ flex: 1 }}><Text style={styles.copingTitle}>Coping Plan</Text><Text style={styles.copingSubtitle}>TAP TO VIEW & EDIT</Text></View>
              <Text style={styles.copingChevron}>›</Text>
            </TouchableOpacity>
            <View style={styles.pauseRow}>
              <View style={styles.pauseIcon}><Text style={{ color: colors.coral }}>⊘</Text></View>
              <View style={{ flex: 1 }}><Text style={styles.pauseTitle}>Pause Everything</Text><Text style={styles.pauseSubtitle}>MUTE NOTIFICATIONS & SOCIAL</Text></View>
              <Switch value={settings.pauseNotifications} onValueChange={(v) => updateSettings({ pauseNotifications: v })} trackColor={{ false: 'rgba(255,255,255,0.1)', true: colors.blue }} thumbColor="#FFFFFF" />
            </View>
          </View>
        )}
      </GlassCard>

      <GlassCard variant="accent" style={styles.reflectionCard}>
        <Text style={styles.reflectionLabel}>DAILY REFLECTION</Text>
        <Text style={styles.reflectionPrompt}>{getTodayPrompt()}</Text>
        <ActionButton title="✏️ Write Response" onPress={() => navigation.navigate('Journal')} variant="primary" style={styles.writeButton} />
      </GlassCard>

      <SectionHeader title="Your Collections" actionText="+ New" onAction={() => setShowNewCollectionModal(true)} />

      {vaultCollections.length === 0 ? (
        <EmptyState icon="📁" title="No collections yet" subtitle="Create your first collection to start saving memories, letters, and reflections." actionText="Create Collection" onAction={() => setShowNewCollectionModal(true)} />
      ) : (
        <View style={styles.collectionsGrid}>
          {vaultCollections.map((collection) => (
            <TouchableOpacity key={collection.id} style={styles.collectionCard} onPress={() => navigation.navigate('CollectionDetail', { collectionId: collection.id })}>
              <View style={styles.collectionIconContainer}><Text style={styles.collectionIcon}>{collection.icon}</Text></View>
              <Text style={styles.collectionTitle}>{collection.title}</Text>
              <Text style={styles.collectionCount}>{getEntryCount(collection.id)} ENTRIES</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.newCollectionCard} onPress={() => setShowNewCollectionModal(true)}>
            <View style={styles.newCollectionPlus}><Text style={styles.plusIcon}>+</Text></View>
            <Text style={styles.newCollectionLabel}>NEW COLLECTION</Text>
          </TouchableOpacity>
        </View>
      )}

      <SectionHeader title="Guided Exercises" />

      <TouchableOpacity style={styles.exerciseCard} onPress={() => navigation.navigate('UnsentLetter', {})} activeOpacity={0.7}>
        <GlassCard variant="default">
          <View style={styles.exerciseRow}>
            <View style={[styles.exerciseIconCircle, { backgroundColor: 'rgba(232,116,97,0.12)' }]}><Text style={styles.exerciseIcon}>✉️</Text></View>
            <View style={styles.exerciseInfo}><Text style={styles.exerciseTitle}>Unsent Letter</Text><Text style={styles.exerciseSubtitle}>Anger → Grief → Love → Release</Text></View>
            <Text style={styles.exerciseChevron}>›</Text>
          </View>
        </GlassCard>
      </TouchableOpacity>

      <TouchableOpacity style={styles.exerciseCard} onPress={() => navigation.navigate('LegacyBuilder', {})} activeOpacity={0.7}>
        <GlassCard variant="default">
          <View style={styles.exerciseRow}>
            <View style={[styles.exerciseIconCircle, { backgroundColor: 'rgba(196,162,101,0.12)' }]}><Text style={styles.exerciseIcon}>✦</Text></View>
            <View style={styles.exerciseInfo}><Text style={styles.exerciseTitle}>Legacy Builder</Text><Text style={styles.exerciseSubtitle}>Traits, Traditions, Continuities</Text></View>
            <Text style={styles.exerciseChevron}>›</Text>
          </View>
        </GlassCard>
      </TouchableOpacity>

      <TouchableOpacity style={styles.exerciseCard} onPress={() => navigation.navigate('Journal')} activeOpacity={0.7}>
        <GlassCard variant="default">
          <View style={styles.exerciseRow}>
            <View style={[styles.exerciseIconCircle, { backgroundColor: 'rgba(74,144,217,0.12)' }]}><Text style={styles.exerciseIcon}>📓</Text></View>
            <View style={styles.exerciseInfo}><Text style={styles.exerciseTitle}>Journal</Text><Text style={styles.exerciseSubtitle}>Daily reflections & prompts</Text></View>
            <Text style={styles.exerciseChevron}>›</Text>
          </View>
        </GlassCard>
      </TouchableOpacity>

      <QuoteCard quote='"The vault is not just storage — it is identity reconstruction, one memory at a time."' />

      <Modal visible={showNewCollectionModal} transparent animationType="slide" onRequestClose={() => setShowNewCollectionModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>New Collection</Text><TouchableOpacity onPress={() => setShowNewCollectionModal(false)}><Text style={styles.modalClose}>✕</Text></TouchableOpacity></View>
            <Text style={styles.modalLabel}>CHOOSE AN ICON</Text>
            <View style={styles.iconGrid}>
              {ICON_OPTIONS.map((icon) => (
                <TouchableOpacity key={icon} style={[styles.iconOption, newCollectionIcon === icon && styles.iconOptionActive]} onPress={() => setNewCollectionIcon(icon)}>
                  <Text style={styles.iconOptionText}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput style={styles.collectionInput} value={newCollectionTitle} onChangeText={setNewCollectionTitle} placeholder="Collection name…" placeholderTextColor={colors.textMuted} autoFocus />
            <ActionButton title="Create Collection" onPress={handleCreateCollection} variant="primary" />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, marginBottom: 20 },
  headerLabel: { ...typography.label, color: colors.textWarm, fontSize: 13 },
  calendarBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.backgroundCard, justifyContent: 'center', alignItems: 'center' },
  calendarIcon: { fontSize: 18 },
  anniversaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  anniversaryLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  anniversaryIcon: { fontSize: 18 },
  anniversaryTitle: { ...typography.subtitle, fontSize: 16 },
  anniversaryExpanded: { marginTop: 16, gap: 10 },
  copingPlanRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: radius.md, padding: 14, gap: 10 },
  copingDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.coral },
  copingTitle: { ...typography.subtitle, fontSize: 15 },
  copingSubtitle: { ...typography.label, fontSize: 10, color: colors.textMuted },
  copingChevron: { fontSize: 22, color: colors.textMuted },
  pauseRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: radius.md, padding: 14, gap: 10 },
  pauseIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(232,116,97,0.12)', justifyContent: 'center', alignItems: 'center' },
  pauseTitle: { ...typography.subtitle, fontSize: 15 },
  pauseSubtitle: { ...typography.label, fontSize: 10, color: colors.textMuted },
  reflectionCard: { alignItems: 'center' },
  reflectionLabel: { ...typography.label, color: colors.coral, marginBottom: 12 },
  reflectionPrompt: { fontSize: 17, fontWeight: '600', color: colors.textPrimary, textAlign: 'center', marginBottom: 16, lineHeight: 26 },
  writeButton: { backgroundColor: colors.coral },
  collectionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  collectionCard: { width: '47%', backgroundColor: colors.backgroundCard, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 16, minHeight: 100 },
  collectionIconContainer: { marginBottom: 10 },
  collectionIcon: { fontSize: 28 },
  collectionTitle: { ...typography.subtitle, fontSize: 14, marginBottom: 4 },
  collectionCount: { ...typography.label, fontSize: 10, color: colors.textMuted },
  newCollectionCard: { width: '47%', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed', padding: 16, minHeight: 100, justifyContent: 'center', alignItems: 'center' },
  newCollectionPlus: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(232,116,97,0.12)', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  plusIcon: { fontSize: 20, color: colors.coral },
  newCollectionLabel: { ...typography.label, fontSize: 10, color: colors.coral },
  exerciseCard: { marginBottom: 0 },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  exerciseIconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  exerciseIcon: { fontSize: 22 },
  exerciseInfo: { flex: 1 },
  exerciseTitle: { ...typography.subtitle, fontSize: 16 },
  exerciseSubtitle: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2, fontSize: 13 },
  exerciseChevron: { fontSize: 22, color: colors.textMuted },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.backgroundDark, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 48, borderTopWidth: 1, borderColor: colors.border },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  modalClose: { fontSize: 18, color: colors.textMuted, padding: 4 },
  modalLabel: { ...typography.label, color: colors.textMuted, marginBottom: 10 },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  iconOption: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.06)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  iconOptionActive: { backgroundColor: 'rgba(232,116,97,0.2)', borderColor: colors.coral },
  iconOptionText: { fontSize: 20 },
  collectionInput: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: colors.textPrimary, marginBottom: 16 },
});
