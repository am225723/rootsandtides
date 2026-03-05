import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ScreenContainer from '../components/ScreenContainer';
import GlassCard from '../components/GlassCard';
import { colors, radius, typography } from '../theme';
import { useApp } from '../context/AppContext';
import { TherapistConnection, DataCategory } from '../context/types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TherapistConnection'>;
};

const DATA_CATEGORIES: { key: DataCategory; label: string; description: string }[] = [
  { key: 'moodHistory', label: 'Mood History', description: 'Your mood check-ins and trends' },
  { key: 'journalEntries', label: 'Journal Entries', description: 'Your written reflections' },
  { key: 'moduleProgress', label: 'Module Progress', description: 'Your learning journey' },
  { key: 'vaultCollections', label: 'Vault Collections', description: 'Your memory collections' },
  { key: 'anniversaryDates', label: 'Anniversary Dates', description: 'Important dates to remember' },
  { key: 'reflectionPrompts', label: 'Reflection Prompts', description: 'Your prompt responses' },
];

export default function TherapistConnectionScreen({ navigation }: Props) {
  const { therapistConnections, inviteTherapist, revokeTherapistAccess, updateTherapistAccess } = useApp();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<TherapistConnection | null>(null);
  
  // Form state
  const [therapistName, setTherapistName] = useState('');
  const [therapistEmail, setTherapistEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [accessLevel, setAccessLevel] = useState<'full' | 'limited'>('limited');
  const [selectedCategories, setSelectedCategories] = useState<DataCategory[]>(['moodHistory', 'moduleProgress']);

  const handleInvite = async () => {
    if (!therapistName.trim() || !therapistEmail.trim()) {
      Alert.alert('Error', 'Please fill in therapist name and email.');
      return;
    }

    try {
      const connection = await inviteTherapist({
        therapistName,
        therapistEmail,
        organization,
        accessLevel,
        dataCategories: accessLevel === 'full' 
          ? DATA_CATEGORIES.map(c => c.key)
          : selectedCategories,
      });

      Alert.alert(
        'Invitation Sent',
        `An access code has been generated. Share this code with your therapist:\n\n${connection.accessCode}`,
        [
          { text: 'OK', onPress: () => {
            setShowInviteModal(false);
            resetForm();
          }}
        ]
      );
    } catch (error) {
      console.error('Error inviting therapist:', error);
      Alert.alert('Error', 'Could not send invitation. Please try again.');
    }
  };

  const handleRevoke = async (connectionId: string) => {
    Alert.alert(
      'Revoke Access',
      'Are you sure you want to revoke this therapist\'s access to your data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke',
          style: 'destructive',
          onPress: async () => {
            try {
              await revokeTherapistAccess(connectionId);
              setShowRevokeModal(false);
              setSelectedConnection(null);
            } catch (error) {
              console.error('Error revoking access:', error);
              Alert.alert('Error', 'Could not revoke access. Please try again.');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setTherapistName('');
    setTherapistEmail('');
    setOrganization('');
    setAccessLevel('limited');
    setSelectedCategories(['moodHistory', 'moduleProgress']);
  };

  const toggleCategory = (category: DataCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.success;
      case 'pending': return colors.coral;
      case 'revoked': return colors.textMuted;
      case 'suspended': return colors.warning;
      default: return colors.textMuted;
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Therapist Connections</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Share Your Journey</Text>
          <Text style={styles.infoText}>
            Connect with your therapist or counselor to share your grief journey progress. 
            You control what data is shared and can revoke access at any time.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addConnectionBtn}
          onPress={() => setShowInviteModal(true)}
        >
          <Text style={styles.addIcon}>+</Text>
          <Text style={styles.addText}>Invite a Therapist</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Active Connections</Text>

        {therapistConnections.length === 0 ? (
          <GlassCard variant="elevated" style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🤝</Text>
            <Text style={styles.emptyText}>No therapist connections yet</Text>
            <Text style={styles.emptySubtext}>
              Invite a therapist to share your progress and insights.
            </Text>
          </GlassCard>
        ) : (
          therapistConnections.map(connection => (
            <GlassCard key={connection.id} variant="elevated" style={styles.connectionCard}>
              <View style={styles.connectionHeader}>
                <View style={styles.connectionInfo}>
                  <Text style={styles.therapistName}>{connection.therapistName}</Text>
                  <Text style={styles.therapistEmail}>{connection.therapistEmail}</Text>
                  {connection.organization && (
                    <Text style={styles.organization}>{connection.organization}</Text>
                  )}
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(connection.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(connection.status) }]}>
                    {connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.connectionDetails}>
                <Text style={styles.detailLabel}>Access Level:</Text>
                <Text style={styles.detailValue}>{connection.accessLevel}</Text>
              </View>

              <View style={styles.connectionDetails}>
                <Text style={styles.detailLabel}>Shared Data:</Text>
                <Text style={styles.detailValue}>
                  {connection.dataCategories.length} categories
                </Text>
              </View>

              {connection.lastAccessDate && (
                <View style={styles.connectionDetails}>
                  <Text style={styles.detailLabel}>Last Access:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(connection.lastAccessDate).toLocaleDateString()}
                  </Text>
                </View>
              )}

              {connection.status === 'pending' && (
                <View style={styles.accessCodeSection}>
                  <Text style={styles.accessCodeLabel}>Access Code:</Text>
                  <View style={styles.accessCodeBox}>
                    <Text style={styles.accessCode}>{connection.accessCode}</Text>
                  </View>
                  <Text style={styles.accessCodeHint}>
                    Share this code with your therapist
                  </Text>
                </View>
              )}

              <View style={styles.connectionActions}>
                {connection.status === 'active' && (
                  <>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => {
                        setSelectedConnection(connection);
                        // Navigate to manage access screen
                      }}
                    >
                      <Text style={styles.actionBtnText}>Manage Access</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.revokeBtn}
                      onPress={() => handleRevoke(connection.id)}
                    >
                      <Text style={styles.revokeBtnText}>Revoke Access</Text>
                    </TouchableOpacity>
                  </>
                )}
                {connection.status === 'pending' && (
                  <TouchableOpacity
                    style={styles.revokeBtn}
                    onPress={() => handleRevoke(connection.id)}
                  >
                    <Text style={styles.revokeBtnText}>Cancel Invitation</Text>
                  </TouchableOpacity>
                )}
              </View>
            </GlassCard>
          ))
        )}

        <Text style={styles.sectionTitle}>Generate Report</Text>

        <GlassCard variant="elevated" style={styles.reportCard}>
          <Text style={styles.reportTitle}>Progress Report</Text>
          <Text style={styles.reportDescription}>
            Generate a comprehensive report of your journey to share with your therapist.
          </Text>
          <TouchableOpacity
            style={styles.reportBtn}
            onPress={() => navigation.navigate('ProgressReport' as never)}
          >
            <Text style={styles.reportBtnText}>Generate Report</Text>
          </TouchableOpacity>
        </GlassCard>

        <View style={styles.privacySection}>
          <Text style={styles.privacyTitle}>🔒 Privacy & Security</Text>
          <Text style={styles.privacyText}>
            • You control what data is shared{'\n'}
            • Access can be revoked at any time{'\n'}
            • All data is encrypted in transit{'\n'}
            • Therapists need your access code to view data
          </Text>
        </View>
      </ScrollView>

      {/* Invite Modal */}
      <Modal
        visible={showInviteModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowInviteModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Invite Therapist</Text>
              <TouchableOpacity onPress={() => { setShowInviteModal(false); resetForm(); }}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Therapist Name *</Text>
              <TextInput
                style={styles.textInput}
                value={therapistName}
                onChangeText={setTherapistName}
                placeholder="Dr. Jane Smith"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput
                style={styles.textInput}
                value={therapistEmail}
                onChangeText={setTherapistEmail}
                placeholder="therapist@example.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>Organization (optional)</Text>
              <TextInput
                style={styles.textInput}
                value={organization}
                onChangeText={setOrganization}
                placeholder="City Counseling Center"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={styles.inputLabel}>Access Level</Text>
              <View style={styles.accessLevelRow}>
                <TouchableOpacity
                  style={[styles.accessLevelBtn, accessLevel === 'limited' && styles.accessLevelActive]}
                  onPress={() => setAccessLevel('limited')}
                >
                  <Text style={[styles.accessLevelText, accessLevel === 'limited' && styles.accessLevelTextActive]}>
                    Limited
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.accessLevelBtn, accessLevel === 'full' && styles.accessLevelActive]}
                  onPress={() => setAccessLevel('full')}
                >
                  <Text style={[styles.accessLevelText, accessLevel === 'full' && styles.accessLevelTextActive]}>
                    Full
                  </Text>
                </TouchableOpacity>
              </View>

              {accessLevel === 'limited' && (
                <View style={styles.categoriesSection}>
                  <Text style={styles.categoriesTitle}>Select Data to Share:</Text>
                  {DATA_CATEGORIES.map(cat => (
                    <TouchableOpacity
                      key={cat.key}
                      style={styles.categoryItem}
                      onPress={() => toggleCategory(cat.key)}
                    >
                      <View style={[styles.checkbox, selectedCategories.includes(cat.key) && styles.checkboxActive]}>
                        {selectedCategories.includes(cat.key) && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                      <View style={styles.categoryInfo}>
                        <Text style={styles.categoryLabel}>{cat.label}</Text>
                        <Text style={styles.categoryDesc}>{cat.description}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <TouchableOpacity style={styles.inviteBtn} onPress={handleInvite}>
                <Text style={styles.inviteBtnText}>Send Invitation</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingTop: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: colors.textPrimary,
  },
  headerTitle: {
    ...typography.subtitle,
    fontSize: 18,
  },
  placeholder: {
    width: 40,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoTitle: {
    ...typography.subtitle,
    fontSize: 20,
    marginBottom: 8,
  },
  infoText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  addConnectionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.coral,
    borderRadius: radius.lg,
    paddingVertical: 16,
    marginBottom: 24,
  },
  addIcon: {
    fontSize: 24,
    color: colors.textPrimary,
    marginRight: 12,
  },
  addText: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  sectionTitle: {
    ...typography.subtitle,
    marginBottom: 16,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    ...typography.subtitle,
    marginBottom: 8,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  connectionCard: {
    marginBottom: 16,
  },
  connectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  connectionInfo: {
    flex: 1,
  },
  therapistName: {
    ...typography.subtitle,
    fontSize: 18,
    marginBottom: 4,
  },
  therapistEmail: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  organization: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  statusText: {
    ...typography.tag,
    fontWeight: '600',
  },
  connectionDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
    width: 100,
  },
  detailValue: {
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  accessCodeSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  accessCodeLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: 8,
  },
  accessCodeBox: {
    backgroundColor: 'rgba(74, 144, 217, 0.15)',
    borderRadius: radius.md,
    padding: 12,
    alignItems: 'center',
  },
  accessCode: {
    ...typography.subtitle,
    fontSize: 24,
    letterSpacing: 4,
    color: colors.textPrimary,
  },
  accessCodeHint: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
  connectionActions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: 'rgba(74, 144, 217, 0.2)',
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionBtnText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  revokeBtn: {
    flex: 1,
    backgroundColor: 'rgba(237, 137, 54, 0.2)',
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  revokeBtnText: {
    ...typography.bodySmall,
    color: colors.coral,
    fontWeight: '600',
  },
  reportCard: {
    marginBottom: 24,
  },
  reportTitle: {
    ...typography.subtitle,
    marginBottom: 8,
  },
  reportDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  reportBtn: {
    backgroundColor: 'rgba(74, 144, 217, 0.2)',
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  reportBtnText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  privacySection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 24,
  },
  privacyTitle: {
    ...typography.subtitle,
    marginBottom: 12,
  },
  privacyText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    ...typography.subtitle,
    fontSize: 20,
  },
  closeBtn: {
    fontSize: 24,
    color: colors.textMuted,
  },
  inputLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.md,
    padding: 16,
    color: colors.textPrimary,
    fontSize: 16,
  },
  accessLevelRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  accessLevelBtn: {
    flex: 1,
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  accessLevelActive: {
    backgroundColor: 'rgba(74, 144, 217, 0.3)',
    borderWidth: 1,
    borderColor: colors.textPrimary,
  },
  accessLevelText: {
    ...typography.body,
    color: colors.textMuted,
  },
  accessLevelTextActive: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  categoriesSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  categoriesTitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.coral,
    borderColor: colors.coral,
  },
  checkmark: {
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryLabel: {
    ...typography.body,
    marginBottom: 2,
  },
  categoryDesc: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  inviteBtn: {
    backgroundColor: colors.coral,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  inviteBtnText: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
});