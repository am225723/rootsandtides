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
import { VaultEntry } from '../context/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CollectionDetail'>;
  route: RouteProp<RootStackParamList, 'CollectionDetail'>;
};

export default function CollectionDetailScreen({ navigation, route }: Props) {
  const { collectionId } = route.params;
  const { vaultCollections, vaultEntries, addVaultEntry, updateVaultEntry, deleteVaultEntry, deleteCollection } = useApp();
  const collection = vaultCollections.find(c => c.id === collectionId);
  const entries = vaultEntries.filter(e => e.collectionId === collectionId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<VaultEntry | null>(null);
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');

  if (!collection) {
    return <View style={styles.fullScreen}><View style={styles.content}><TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Text style={styles.backIcon}>←</Text></TouchableOpacity><EmptyState icon="📭" title="Collection not found" /></View></View>;
  }

  const openAdd = () => { setEditingEntry(null); setEntryTitle(''); setEntryContent(''); setShowModal(true); };
  const openEdit = (entry: VaultEntry) => { setEditingEntry(entry); setEntryTitle(entry.title); setEntryContent(entry.content); setShowModal(true); };

  const handleSave = async () => {
    if (!entryContent.trim()) return;
    if (editingEntry) { await updateVaultEntry(editingEntry.id, { title: entryTitle.trim() || `Entry — ${new Date().toLocaleDateString()}`, content: entryContent.trim() }); }
    else { await addVaultEntry({ collectionId, title: entryTitle.trim() || `Entry — ${new Date().toLocaleDateString()}`, content: entryContent.trim(), type: 'text' }); }
    setShowModal(false);
  };

  const handleDelete = (entry: VaultEntry) => {
    Alert.alert('Delete Entry', 'Are you sure? This cannot be undone.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => deleteVaultEntry(entry.id) }]);
  };

  const handleDeleteCollection = () => {
    Alert.alert('Delete Collection', `Delete "${collection.title}" and all ${entries.length} entries?`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: async () => { await deleteCollection(collectionId); navigation.goBack(); } }]);
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <View style={styles.fullScreen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
          <View style={styles.headerCenter}><Text style={styles.collectionIcon}>{collection.icon}</Text><Text style={styles.collectionTitle}>{collection.title}</Text></View>
          <TouchableOpacity style={styles.deleteCollBtn} onPress={handleDeleteCollection}><Text style={styles.deleteCollIcon}>🗑️</Text></TouchableOpacity>
        </View>
        <Text style={styles.entryCount}>{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</Text>
        {entries.length === 0 ? (
          <EmptyState icon={collection.icon} title="No entries yet" subtitle="Tap the button below to add your first entry." actionText="Add Entry" onAction={openAdd} />
        ) : (
          entries.map((entry) => (
            <GlassCard key={entry.id} variant="default">
              <View style={styles.entryHeader}>
                <View style={styles.entryTitleRow}><Text style={styles.entryTitle} numberOfLines={1}>{entry.title}</Text><Text style={styles.entryDate}>{formatDate(entry.createdAt)}</Text></View>
                <View style={styles.entryActions}>
                  <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(entry)}><Text style={styles.editBtnText}>Edit</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(entry)}><Text style={styles.deleteBtnText}>Delete</Text></TouchableOpacity>
                </View>
              </View>
              <Text style={styles.entryContent} numberOfLines={4}>{entry.content}</Text>
            </GlassCard>
          ))
        )}
        {entries.length > 0 && <ActionButton title="+ Add Entry" onPress={openAdd} variant="secondary" style={styles.addBtn} />}
      </ScrollView>
      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>{editingEntry ? 'Edit Entry' : 'New Entry'}</Text><TouchableOpacity onPress={() => setShowModal(false)}><Text style={styles.modalClose}>✕</Text></TouchableOpacity></View>
            <TextInput style={styles.titleInput} value={entryTitle} onChangeText={setEntryTitle} placeholder="Title (optional)" placeholderTextColor={colors.textMuted} />
            <TextInput style={styles.contentInput} value={entryContent} onChangeText={setEntryContent} placeholder="Write your entry here…" placeholderTextColor={colors.textMuted} multiline textAlignVertical="top" autoFocus />
            <ActionButton title={editingEntry ? 'Save Changes' : 'Save to Vault'} onPress={handleSave} variant="primary" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 56, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.backgroundCard, justifyContent: 'center', alignItems: 'center' },
  backIcon: { color: colors.textPrimary, fontSize: 20 },
  headerCenter: { flex: 1, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  collectionIcon: { fontSize: 22 },
  collectionTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  deleteCollBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.backgroundCard, justifyContent: 'center', alignItems: 'center' },
  deleteCollIcon: { fontSize: 16 },
  entryCount: { ...typography.label, color: colors.textMuted, marginBottom: 20 },
  entryHeader: { marginBottom: 8 },
  entryTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  entryTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, flex: 1, marginRight: 8 },
  entryDate: { ...typography.bodySmall, color: colors.textMuted, fontSize: 12 },
  entryActions: { flexDirection: 'row', gap: 8 },
  editBtn: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.full, backgroundColor: 'rgba(74,144,217,0.15)', borderWidth: 1, borderColor: 'rgba(74,144,217,0.3)' },
  editBtnText: { fontSize: 12, fontWeight: '600', color: colors.blue },
  deleteBtn: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.full, backgroundColor: 'rgba(220,20,60,0.1)', borderWidth: 1, borderColor: 'rgba(220,20,60,0.2)' },
  deleteBtnText: { fontSize: 12, fontWeight: '600', color: colors.red },
  entryContent: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20 },
  addBtn: { marginTop: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.backgroundDark, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 48, borderTopWidth: 1, borderColor: colors.border },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  modalClose: { fontSize: 18, color: colors.textMuted, padding: 4 },
  titleInput: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: colors.textPrimary, marginBottom: 12 },
  contentInput: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: 16, minHeight: 160, fontSize: 15, color: colors.textPrimary, lineHeight: 24, marginBottom: 16 },
});
