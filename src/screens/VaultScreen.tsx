import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, Modal, ScrollView, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '../navigation/AppNavigator';
import GlassCardNew from '../components/GlassCardNew';
import GradientButton from '../components/GradientButton';
import SectionHeader from '../components/SectionHeader';
import QuoteCard from '../components/QuoteCard';
import EmptyState from '../components/EmptyState';
import { colors, radius, typography, spacing } from '../theme';
import { useApp } from '../context/AppContext';
import { getTodayPrompt } from '../services/prompts';

type VaultNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Vault'>,
  NativeStackNavigationProp<RootStackParamList>
>;
type Props = { navigation: VaultNavigationProp };

export default function VaultScreen({ navigation }: Props) {
  const { settings, updateSettings, vaultCollections, vaultEntries, createCollection } = useApp();
  const [showNewCollectionModal, setShowNewCollectionModal] = useState(false);
  const [newCollectionTitle, setNewCollectionTitle] = useState('');
  const [newCollectionIcon, setNewCollectionIcon] = useState('📁');

  const ICON_OPTIONS = ['📁', '✉️', '🎵', '📖', '🌱', '❤️', '🖼️', '🌊', '✦', '🏡'];

  const handleCreateCollection = async () => {
    if (!newCollectionTitle.trim()) return;
    await createCollection(newCollectionTitle.trim(), newCollectionIcon);
    setNewCollectionTitle('');
    setNewCollectionIcon('📁');
    setShowNewCollectionModal(false);
  };

  const getEntryCount = (collectionId: string) => 
    vaultEntries.filter(e => e.collectionId === collectionId).length;

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
          <Text style={styles.headerLabel}>VAULT & ANNIVERSARY</Text>
          <TouchableOpacity 
            style={styles.calendarBtn} 
            onPress={() => navigation.navigate('CopingPlan')}
          >
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>
        </View>

        <GlassCardNew variant="warm" style={styles.anniversaryCard}>
          <View style={styles.anniversaryRow}>
            <View style={styles.anniversaryLeft}>
              <Text style={styles.anniversaryIcon}>📅</Text>
              <Text style={styles.anniversaryTitle}>Anniversary Mode</Text>
            </View>
            <Switch 
              value={settings.anniversaryModeActive} 
              onValueChange={(v) => updateSettings({ anniversaryModeActive: v })} 
              trackColor={{ false: 'rgba(255,255,255,0.1)', true: colors.coral }} 
              thumbColor="#FFFFFF" 
            />
          </View>
          
          {settings.anniversaryModeActive && (
            <View style={styles.anniversaryExpanded}>
              <TouchableOpacity 
                style={styles.copingPlanRow} 
                onPress={() => navigation.navigate('CopingPlan')}
              >
                <View style={styles.copingDot} />
                <View style={styles.copingInfo}>
                  <Text style={styles.copingTitle}>Coping Plan</Text>
                  <Text style={styles.copingSubtitle}>TAP TO VIEW & EDIT</Text>
                </View>
                <Text style={styles.copingChevron}>›</Text>
              </TouchableOpacity>
              
              <View style={styles.pauseRow}>
                <View style={styles.pauseIcon}>
                  <Text style={{ color: colors.coral }}>⊘</Text>
                </View>
                <View style={styles.pauseInfo}>
                  <Text style={styles.pauseTitle}>Pause Everything</Text>
                  <Text style={styles.pauseSubtitle}>MUTE NOTIFICATIONS & SOCIAL</Text>
                </View>
                <Switch 
                  value={settings.pauseNotifications} 
                  onValueChange={(v) => updateSettings({ pauseNotifications: v })} 
                  trackColor={{ false: 'rgba(255,255,255,0.1)', true: colors.blue }} 
                  thumbColor="#FFFFFF" 
                />
              </View>
            </View>
          )}
        </GlassCardNew>

        <GlassCardNew variant="accent" style={styles.reflectionCard}>
          <Text style={styles.reflectionLabel}>DAILY REFLECTION</Text>
          <Text style={styles.reflectionPrompt}>{getTodayPrompt()}</Text>
          <GradientButton
            title="✏️ Write Response"
            onPress={() => navigation.navigate('Journal')}
            variant="primary"
            style={styles.writeButton}
            fullWidth={true}
          />
        </GlassCardNew>

        <View style={styles.sectionSpacing}>
          <SectionHeader 
            title="Your Collections" 
            actionText="+ New" 
            onAction={() => setShowNewCollectionModal(true)} 
          />
        </View>

        {vaultCollections.length === 0 ? (
          <EmptyState 
            icon="📁"
            title="No collections yet"
            subtitle="Create your first collection to start saving memories, letters, and reflections."
            actionText="Create Collection"
            onAction={() => setShowNewCollectionModal(true)}
          />
        ) : (
          <View style={styles.collectionsGrid}>
            {vaultCollections.map((collection) => (
              <TouchableOpacity 
                key={collection.id} 
                style={styles.collectionCard} 
                onPress={() => navigation.navigate('CollectionDetail', { collectionId: collection.id })}
              >
                <View style={styles.collectionIconContainer}>
                  <Text style={styles.collectionIcon}>{collection.icon}</Text>
                </View>
                <Text style={styles.collectionTitle}>{collection.title}</Text>
                <Text style={styles.collectionCount}>{getEntryCount(collection.id)} ENTRIES</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={styles.newCollectionCard} 
              onPress={() => setShowNewCollectionModal(true)}
            >
              <View style={styles.newCollectionPlus}>
                <Text style={styles.plusIcon}>+</Text>
              </View>
              <Text style={styles.newCollectionLabel}>NEW COLLECTION</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.sectionSpacing}>
          <SectionHeader title="Guided Exercises" />
        </View>

        <TouchableOpacity 
          style={styles.exerciseCard} 
          onPress={() => navigation.navigate('UnsentLetter', {})}
          activeOpacity={0.7}
        >
          <GlassCardNew variant="default" noPadding={true}>
            <View style={styles.exerciseContent}>
              <View style={[styles.exerciseIconCircle, { backgroundColor: 'rgba(232,116,97,0.12)' }]}>
                <Text style={styles.exerciseIcon}>✉️</Text>
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseTitle}>Unsent Letter</Text>
                <Text style={styles.exerciseSubtitle}>Anger → Grief → Love → Release</Text>
              </View>
              <Text style={styles.exerciseChevron}>›</Text>
            </View>
          </GlassCardNew>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.exerciseCard} 
          onPress={() => navigation.navigate('LegacyBuilder', {})}
          activeOpacity={0.7}
        >
          <GlassCardNew variant="default" noPadding={true}>
            <View style={styles.exerciseContent}>
              <View style={[styles.exerciseIconCircle, { backgroundColor: 'rgba(196,162,101,0.12)' }]}>
                <Text style={styles.exerciseIcon}>✦</Text>
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseTitle}>Legacy Builder</Text>
                <Text style={styles.exerciseSubtitle}>Traits, Traditions, Continuities</Text>
              </View>
              <Text style={styles.exerciseChevron}>›</Text>
            </View>
          </GlassCardNew>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.exerciseCard} 
          onPress={() => navigation.navigate('Journal')}
          activeOpacity={0.7}
        >
          <GlassCardNew variant="default" noPadding={true}>
            <View style={styles.exerciseContent}>
              <View style={[styles.exerciseIconCircle, { backgroundColor: 'rgba(74,144,217,0.12)' }]}>
                <Text style={styles.exerciseIcon}>📓</Text>
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseTitle}>Journal</Text>
                <Text style={styles.exerciseSubtitle}>Daily reflections & prompts</Text>
              </View>
              <Text style={styles.exerciseChevron}>›</Text>
            </View>
          </GlassCardNew>
        </TouchableOpacity>

        <View style={styles.sectionSpacing}>
          <QuoteCard quote='"The vault is not just storage — it is identity reconstruction, one memory at a time."' />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <Modal 
        visible={showNewCollectionModal} 
        transparent 
        animationType="slide" 
        onRequestClose={() => setShowNewCollectionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={['rgba(17, 22, 31, 0.98)', 'rgba(17, 22, 31, 0.95)']}
            style={styles.modalGradient}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Collection</Text>
              <TouchableOpacity onPress={() => setShowNewCollectionModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalLabel}>CHOOSE AN ICON</Text>
            <View style={styles.iconGrid}>
              {ICON_OPTIONS.map((icon) => (
                <TouchableOpacity 
                  key={icon} 
                  style={[
                    styles.iconOption, 
                    newCollectionIcon === icon && styles.iconOptionActive
                  ]} 
                  onPress={() => setNewCollectionIcon(icon)}
                >
                  <Text style={styles.iconOptionText}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TextInput 
              style={styles.collectionInput} 
              value={newCollectionTitle} 
              onChangeText={setNewCollectionTitle} 
              placeholder="Collection name…" 
              placeholderTextColor={colors.textMuted} 
              autoFocus 
            />
            
            <GradientButton
              title="Create Collection"
              onPress={handleCreateCollection}
              variant="primary"
              fullWidth={true}
            />
          </View>
        </View>
      </Modal>
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
    paddingBottom: spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    marginBottom: spacing.lg,
  },
  headerLabel: {
    ...typography.label,
    color: colors.textWarm,
    fontSize: 13,
  },
  calendarBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarIcon: {
    fontSize: 20,
  },
  anniversaryCard: {
    marginBottom: spacing.lg,
  },
  anniversaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  anniversaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  anniversaryIcon: {
    fontSize: 20,
  },
  anniversaryTitle: {
    ...typography.subtitle,
    fontSize: 16,
  },
  anniversaryExpanded: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  copingPlanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  copingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.coral,
  },
  copingInfo: {
    flex: 1,
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
    fontSize: 24,
    color: colors.textMuted,
  },
  pauseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  pauseIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: 'rgba(232, 116, 97, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseInfo: {
    flex: 1,
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
    marginBottom: spacing.xl,
  },
  reflectionLabel: {
    ...typography.label,
    color: colors.coral,
    marginBottom: spacing.md,
  },
  reflectionPrompt: {
    ...typography.subtitle,
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 28,
  },
  writeButton: {
    width: '100%',
  },
  sectionSpacing: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  collectionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  collectionCard: {
    width: '47%',
    backgroundColor: colors.surface.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    minHeight: 120,
  },
  collectionIconContainer: {
    marginBottom: spacing.sm,
  },
  collectionIcon: {
    fontSize: 32,
  },
  collectionTitle: {
    ...typography.subtitle,
    fontSize: 14,
    marginBottom: 4,
  },
  collectionCount: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
  newCollectionCard: {
    width: '47%',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    padding: spacing.md,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newCollectionPlus: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: 'rgba(232, 116, 97, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  plusIcon: {
    fontSize: 24,
    color: colors.coral,
  },
  newCollectionLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.coral,
  },
  exerciseCard: {
    marginBottom: spacing.sm,
  },
  exerciseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  exerciseIconCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseIcon: {
    fontSize: 24,
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
  exerciseChevron: {
    fontSize: 28,
    color: colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: 'rgba(17, 22, 31, 0.98)',
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.title,
    fontSize: 20,
  },
  modalClose: {
    fontSize: 20,
    color: colors.textMuted,
    padding: spacing.xs,
  },
  modalLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconOptionActive: {
    backgroundColor: 'rgba(232, 116, 97, 0.2)',
    borderColor: colors.coral,
  },
  iconOptionText: {
    fontSize: 22,
  },
  collectionInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});