import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import GlassCard from '../components/GlassCard';
import QuoteCard from '../components/QuoteCard';
import { colors, radius, typography } from '../theme';
import { useApp } from '../context/AppContext';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'ModuleLibrary'> };

const MODULES = [
  { id: 'continuing-bonds', title: 'Continuing Bonds Workshop', category: 'CONNECTION & MEMORY', description: 'Guided journaling and rituals to help you maintain a healthy, evolving relationship with your parent\'s memory.', color: colors.gold, icon: '🤝', moduleId: 'safety-in-emotions' },
  { id: 'loss-oriented', title: 'Loss-Oriented Coping', category: 'PROCESSING EMOTION', description: 'A safe container to feel the weight of your loss. Exercises focused on crying, remembering, and feeling the absence without judgment.', color: colors.green, icon: '≋', moduleId: 'biology-of-grief' },
  { id: 'restoration', title: 'Restoration Work', category: 'REBUILDING & GROWTH', description: 'Practical steps for days when you need to attend to life: navigating new roles, and finding moments of respite from grief.', color: colors.coral, icon: '✕', moduleId: 'new-roles' },
  { id: 'act-mindfulness', title: 'ACT & Mindfulness', category: 'PRESENCE & ACCEPTANCE', description: 'Meditation and acceptance exercises to help you make room for pain while connecting to values-based living.', color: colors.blue, icon: '🧘', moduleId: 'safety-in-emotions' },
  { id: 'compassionate-cbt', title: 'Compassionate CBT', category: 'COGNITIVE PROCESSING', description: 'Gentle cognitive restructuring to identify and soothe guilt, regret, or stuck thoughts related to the loss.', color: colors.purple, icon: '🧩', moduleId: 'guilt-if-onlys' },
];

export default function ModuleLibraryScreen({ navigation }: Props) {
  const { moduleProgress } = useApp();
  const getStatus = (moduleId: string) => moduleProgress.find(m => m.moduleId === moduleId)?.status ?? 'not_started';

  return (
    <View style={styles.fullScreen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
        </View>
        <Text style={styles.sectionLabel}>SELF-GUIDED THERAPY</Text>
        <Text style={styles.pageTitle}>Module Library</Text>
        <Text style={styles.pageSubtitle}>Select a guided pathway to support your grief journey. Each module offers exercises tailored to your current needs.</Text>
        <Text style={styles.availableLabel}>AVAILABLE MODULES</Text>
        {MODULES.map((mod) => {
          const status = getStatus(mod.moduleId);
          const statusLabel = status === 'completed' ? 'COMPLETED' : status === 'in_progress' ? 'IN PROGRESS' : null;
          return (
            <GlassCard key={mod.id} variant="default" style={styles.moduleCard}>
              <View style={styles.moduleHeader}>
                <View style={[styles.moduleIconCircle, { backgroundColor: mod.color + '20' }]}><Text style={styles.moduleIconText}>{mod.icon}</Text></View>
                <View style={styles.moduleTitleBlock}>
                  <Text style={styles.moduleTitle}>{mod.title}</Text>
                  <Text style={[styles.moduleCategory, { color: mod.color }]}>{mod.category}</Text>
                </View>
                {statusLabel && (
                  <View style={[styles.statusBadge, { backgroundColor: (status === 'completed' ? colors.green : colors.coral) + '20' }]}>
                    <Text style={[styles.statusText, { color: status === 'completed' ? colors.green : colors.coral }]}>{statusLabel}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.whatToExpect}>What to expect:</Text>
              <Text style={styles.moduleDesc}>{mod.description}</Text>
              <TouchableOpacity style={[styles.startBtn, { backgroundColor: mod.color }]} onPress={() => navigation.navigate('ModuleDetail', { moduleId: mod.moduleId })} activeOpacity={0.8}>
                <Text style={styles.startBtnText}>{status === 'completed' ? 'Review Module →' : status === 'in_progress' ? 'Continue Module →' : 'Start Module →'}</Text>
              </TouchableOpacity>
            </GlassCard>
          );
        })}
        <QuoteCard quote={`"Take what you need, leave what you don't."`} />
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 56, paddingBottom: 100 },
  header: { marginBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.backgroundCard, justifyContent: 'center', alignItems: 'center' },
  backIcon: { color: colors.textPrimary, fontSize: 20 },
  sectionLabel: { ...typography.label, color: colors.textMuted, marginBottom: 6 },
  pageTitle: { fontSize: 32, fontWeight: '700', color: colors.textPrimary, marginBottom: 10 },
  pageSubtitle: { ...typography.body, color: colors.textSecondary, lineHeight: 24, marginBottom: 24 },
  availableLabel: { ...typography.label, color: colors.coral, marginBottom: 16 },
  moduleCard: { marginBottom: 16 },
  moduleHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, gap: 12 },
  moduleIconCircle: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  moduleIconText: { fontSize: 20 },
  moduleTitleBlock: { flex: 1 },
  moduleTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 },
  moduleCategory: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.full, alignSelf: 'flex-start' },
  statusText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  whatToExpect: { ...typography.label, color: colors.textMuted, marginBottom: 4 },
  moduleDesc: { ...typography.bodySmall, lineHeight: 20, marginBottom: 16 },
  startBtn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: radius.full, alignSelf: 'flex-start' },
  startBtnText: { ...typography.buttonText, fontSize: 14 },
});