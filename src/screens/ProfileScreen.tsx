import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Switch } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import GlassCard from '../components/GlassCard';
import { colors, radius, typography } from '../theme';
import { useApp } from '../context/AppContext';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'> };

export default function ProfileScreen({ navigation }: Props) {
  const { userProfile, settings, updateProfile, updateSettings, resetOnboarding } = useApp();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile.name);

  const joinDate = userProfile.joinDate
    ? new Date(userProfile.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown';

  const handleSaveName = async () => {
    if (nameInput.trim()) await updateProfile({ name: nameInput.trim() });
    setEditingName(false);
  };

  const handleResetOnboarding = () => {
    Alert.alert('Reset Onboarding', 'This will clear your profile and restart the onboarding flow. Your vault and journal entries will be preserved.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: async () => { await resetOnboarding(); navigation.replace('Intake'); } },
    ]);
  };

  return (
    <View style={styles.fullScreen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile & Settings</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(userProfile.name || 'F').charAt(0).toUpperCase()}</Text>
          </View>
          {editingName ? (
            <View style={styles.nameEditRow}>
              <TextInput style={styles.nameInput} value={nameInput} onChangeText={setNameInput} autoFocus returnKeyType="done" onSubmitEditing={handleSaveName} placeholderTextColor={colors.textMuted} />
              <TouchableOpacity style={styles.saveNameBtn} onPress={handleSaveName}><Text style={styles.saveNameText}>Save</Text></TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => { setNameInput(userProfile.name); setEditingName(true); }}>
              <Text style={styles.userName}>{userProfile.name || 'Friend'} ✏️</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.joinDate}>Member since {joinDate}</Text>
        </View>

        <GlassCard variant="default">
          <Text style={styles.sectionLabel}>YOUR JOURNEY</Text>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Relationship</Text><Text style={styles.infoValue}>{userProfile.relationship || '—'}</Text></View>
          <View style={styles.divider} />
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Initial Mood</Text><Text style={styles.infoValue}>{userProfile.initialMood || '—'}</Text></View>
          <View style={styles.divider} />
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Joined</Text><Text style={styles.infoValue}>{joinDate}</Text></View>
        </GlassCard>

        <GlassCard variant="default">
          <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}><Text style={styles.toggleTitle}>Daily Reminders</Text><Text style={styles.toggleSub}>Gentle check-in prompts</Text></View>
            <Switch value={settings.notificationsEnabled} onValueChange={(v) => updateSettings({ notificationsEnabled: v })} trackColor={{ false: 'rgba(255,255,255,0.1)', true: colors.coral }} thumbColor="#FFFFFF" />
          </View>
          <View style={styles.divider} />
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}><Text style={styles.toggleTitle}>Pause Notifications</Text><Text style={styles.toggleSub}>Mute all for now</Text></View>
            <Switch value={settings.pauseNotifications} onValueChange={(v) => updateSettings({ pauseNotifications: v })} trackColor={{ false: 'rgba(255,255,255,0.1)', true: colors.blue }} thumbColor="#FFFFFF" />
          </View>
        </GlassCard>

        <GlassCard variant="default">
          <Text style={styles.sectionLabel}>APP SETTINGS</Text>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}><Text style={styles.toggleTitle}>Anniversary Mode</Text><Text style={styles.toggleSub}>Activate on significant dates</Text></View>
            <Switch value={settings.anniversaryModeActive} onValueChange={(v) => updateSettings({ anniversaryModeActive: v })} trackColor={{ false: 'rgba(255,255,255,0.1)', true: colors.gold }} thumbColor="#FFFFFF" />
          </View>
        </GlassCard>

        <GlassCard variant="default">
          <Text style={styles.sectionLabel}>FEATURES</Text>
          <TouchableOpacity style={styles.featureRow} onPress={() => navigation.navigate('DailyPrompt' as any)}>
            <Text style={styles.featureIcon}>✨</Text>
            <View style={{ flex: 1 }}><Text style={styles.featureTitle}>Daily Reflection Prompts</Text><Text style={styles.featureSub}>Personalized prompts for your journey</Text></View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.featureRow} onPress={() => navigation.navigate('TherapistConnection' as any)}>
            <Text style={styles.featureIcon}>👥</Text>
            <View style={{ flex: 1 }}><Text style={styles.featureTitle}>Therapist Connection</Text><Text style={styles.featureSub}>Share progress with your therapist</Text></View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </GlassCard>

        <GlassCard variant="accent">
          <Text style={styles.sectionLabel}>ACCOUNT</Text>
          <TouchableOpacity style={styles.dangerRow} onPress={handleResetOnboarding}>
            <Text style={styles.dangerIcon}>🔄</Text>
            <View style={{ flex: 1 }}><Text style={styles.dangerTitle}>Reset Onboarding</Text><Text style={styles.dangerSub}>Restart your intake flow</Text></View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </GlassCard>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 56, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.backgroundCard, justifyContent: 'center', alignItems: 'center' },
  backIcon: { color: colors.textPrimary, fontSize: 20 },
  headerTitle: { ...typography.subtitle, fontSize: 18 },
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(232,116,97,0.2)', borderWidth: 2, borderColor: colors.coral, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: '700', color: colors.coral },
  userName: { fontSize: 24, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  joinDate: { ...typography.bodySmall, color: colors.textMuted },
  nameEditRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  nameInput: { backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 10, fontSize: 18, color: colors.textPrimary, minWidth: 160 },
  saveNameBtn: { backgroundColor: colors.coral, paddingHorizontal: 16, paddingVertical: 10, borderRadius: radius.md },
  saveNameText: { ...typography.buttonText, fontSize: 14 },
  sectionLabel: { ...typography.label, color: colors.textMuted, marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  infoLabel: { ...typography.bodySmall, color: colors.textMuted },
  infoValue: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  toggleInfo: { flex: 1 },
  toggleTitle: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '600' },
  toggleSub: { ...typography.bodySmall, color: colors.textMuted, fontSize: 12 },
  dangerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dangerIcon: { fontSize: 20 },
  dangerTitle: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '600' },
  dangerSub: { ...typography.bodySmall, color: colors.textMuted, fontSize: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIcon: { fontSize: 20 },
  featureTitle: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '600' },
  featureSub: { ...typography.bodySmall, color: colors.textMuted, fontSize: 12 },
  chevron: { fontSize: 22, color: colors.textMuted },
});