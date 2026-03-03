import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Modal } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import GlassCard from '../components/GlassCard';
import ActionButton from '../components/ActionButton';
import EmptyState from '../components/EmptyState';
import { colors, radius, typography } from '../theme';
import { useApp } from '../context/AppContext';
import { getTodayPrompt, getPromptByIndex } from '../services/prompts';
import { JournalEntry } from '../context/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Journal'>;
  route?: { params?: { prefillPrompt?: string } };
};

export default function JournalScreen({ navigation, route }: Props) {
  const { journalEntries, saveJournalEntry, deleteJournalEntry } = useApp();
  const prefill = route?.params?.prefillPrompt;
  const [showWriteModal, setShowWriteModal] = useState(!!prefill);
  const [currentPrompt, setCurrentPrompt] = useState(prefill || getTodayPrompt());
  const [entryText, setEntryText] = useState('');
  const [promptIndex, setPromptIndex] = useState(0);
  const [viewingEntry, setViewingEntry] = useState<JournalEntry | null>(null);

  const handleSave = async () => {
    if (!entryText.trim()) return;
    await saveJournalEntry({ date: new Date().toISOString(), prompt: currentPrompt, content: entryText.trim() });
    setEntryText(''); setShowWriteModal(false);
  };

  const handleDelete = (entry: JournalEntry) => {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this journal entry?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => deleteJournalEntry(entry.id) }]);
  };

  const cyclePrompt = () => { const next = promptIndex + 1; setPromptIndex(next); setCurrentPrompt(getPromptByIndex(next)); };
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <View style={styles.fullScreen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Journal</Text>
          <TouchableOpacity style={styles.writeBtn} onPress={() => { setCurrentPrompt(getTodayPrompt()); setShowWriteModal(true); }}><Text style={styles.writeBtnText}>✏️</Text></TouchableOpacity>
        </View>
        <GlassCard variant="accent" style={styles.promptCard}>
          <Text style={styles.promptLabel}>TODAY'S PROMPT</Text>
          <Text style={styles.promptText}>{getTodayPrompt()}</Text>
          <View style={styles.promptActions}>
            <TouchableOpacity style={styles.respondBtn} onPress={() => { setCurrentPrompt(getTodayPrompt()); setEntryText(''); setShowWriteModal(true); }}><Text style={styles.respondBtnText}>✏️ Write Response</Text></TouchableOpacity>
            <TouchableOpacity style={styles.shuffleBtn} onPress={cyclePrompt}><Text style={styles.shuffleBtnText}>↻</Text></TouchableOpacity>
          </View>
        </GlassCard>
        <View style={styles.entriesHeader}>
          <Text style={styles.entriesTitle}>Past Entries</Text>
          <Text style={styles.entriesCount}>{journalEntries.length}</Text>
        </View>
        {journalEntries.length === 0 ? (
          <EmptyState icon="📓" title="No journal entries yet" subtitle="Your reflections will appear here. Start with today's prompt above." actionText="Write First Entry" onAction={() => setShowWriteModal(true)} />
        ) : (
          journalEntries.map((entry) => (
            <GlassCard key={entry.id} variant="default">
              <TouchableOpacity onPress={() => setViewingEntry(entry)} activeOpacity={0.8}>
                <View style={styles.entryHeader}><Text style={styles.entryDate}>{formatDate(entry.date)}</Text><TouchableOpacity onPress={() => handleDelete(entry)}><Text style={styles.deleteIcon}>🗑️</Text></TouchableOpacity></View>
                <Text style={styles.entryPrompt} numberOfLines={1}>"{entry.prompt}"</Text>
                <Text style={styles.entryContent} numberOfLines={3}>{entry.content}</Text>
              </TouchableOpacity>
            </GlassCard>
          ))
        )}
      </ScrollView>
      <Modal visible={showWriteModal} transparent animationType="slide" onRequestClose={() => setShowWriteModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>New Entry</Text><TouchableOpacity onPress={() => setShowWriteModal(false)}><Text style={styles.modalClose}>✕</Text></TouchableOpacity></View>
            <View style={styles.modalPromptBox}>
              <Text style={styles.modalPromptLabel}>PROMPT</Text>
              <Text style={styles.modalPromptText}>{currentPrompt}</Text>
              <TouchableOpacity onPress={cyclePrompt}><Text style={styles.changePromptText}>↻ Different prompt</Text></TouchableOpacity>
            </View>
            <TextInput style={styles.entryInput} multiline placeholder="Let your thoughts flow…" placeholderTextColor={colors.textMuted} value={entryText} onChangeText={setEntryText} textAlignVertical="top" autoFocus />
            <ActionButton title="Save Entry" onPress={handleSave} variant="primary" />
          </View>
        </View>
      </Modal>
      <Modal visible={!!viewingEntry} transparent animationType="slide" onRequestClose={() => setViewingEntry(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>{viewingEntry ? formatDate(viewingEntry.date) : ''}</Text><TouchableOpacity onPress={() => setViewingEntry(null)}><Text style={styles.modalClose}>✕</Text></TouchableOpacity></View>
            {viewingEntry && <ScrollView showsVerticalScrollIndicator={false}><Text style={styles.viewPrompt}>"{viewingEntry.prompt}"</Text><Text style={styles.viewContent}>{viewingEntry.content}</Text></ScrollView>}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 56, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.backgroundCard, justifyContent: 'center', alignItems: 'center' },
  backIcon: { color: colors.textPrimary, fontSize: 20 },
  headerTitle: { ...typography.subtitle, fontSize: 20 },
  writeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.backgroundCard, justifyContent: 'center', alignItems: 'center' },
  writeBtnText: { fontSize: 18 },
  promptCard: { marginBottom: 24 },
  promptLabel: { ...typography.label, color: colors.coral, marginBottom: 8 },
  promptText: { fontSize: 17, fontWeight: '600', color: colors.textPrimary, lineHeight: 26, marginBottom: 16 },
  promptActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  respondBtn: { flex: 1, backgroundColor: colors.coral, paddingVertical: 10, borderRadius: radius.full, alignItems: 'center' },
  respondBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  shuffleBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center' },
  shuffleBtnText: { fontSize: 18, color: colors.textSecondary },
  entriesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  entriesTitle: { ...typography.subtitle },
  entriesCount: { fontSize: 13, fontWeight: '700', color: colors.textMuted, backgroundColor: colors.backgroundCard, paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.full },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  entryDate: { ...typography.label, color: colors.textMuted, fontSize: 11 },
  deleteIcon: { fontSize: 14 },
  entryPrompt: { ...typography.bodySmall, color: colors.coral, fontStyle: 'italic', marginBottom: 6 },
  entryContent: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.backgroundDark, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 48, maxHeight: '90%', borderTopWidth: 1, borderColor: colors.border },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  modalClose: { fontSize: 18, color: colors.textMuted, padding: 4 },
  modalPromptBox: { backgroundColor: 'rgba(232,116,97,0.08)', borderRadius: radius.md, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(232,116,97,0.2)' },
  modalPromptLabel: { ...typography.label, color: colors.coral, marginBottom: 4 },
  modalPromptText: { fontSize: 15, color: colors.textPrimary, lineHeight: 22, marginBottom: 8 },
  changePromptText: { fontSize: 13, color: colors.textMuted },
  entryInput: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 16, minHeight: 160, fontSize: 15, color: colors.textPrimary, lineHeight: 24, marginBottom: 16 },
  viewPrompt: { ...typography.quote, color: colors.coral, marginBottom: 16, lineHeight: 24 },
  viewContent: { ...typography.body, lineHeight: 28, marginBottom: 20 },
});
