import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ScreenContainer from '../components/ScreenContainer';
import GlassCard from '../components/GlassCard';
import ActionButton from '../components/ActionButton';
import { colors, radius, typography } from '../theme';

type EscalationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Escalation'>;

type Props = {
  navigation: EscalationScreenNavigationProp;
};

export default function EscalationScreen({ navigation }: Props) {
  return (
    <View style={styles.fullScreen}>
      <View style={styles.forestBg}>
        <View style={styles.darkOverlay} />
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>

        <Text style={styles.headerLabel}>ANCHOR SUPPORT</Text>
        <Text style={styles.headerTitle}>SOS Center</Text>

        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Pause. Breathe.</Text>
          <Text style={styles.heroSubtitle}>
            You are safe and held. Pick a tool to help you find your ground.
          </Text>
        </View>

        <GlassCard variant="elevated" style={styles.toolCard}>
          <View style={styles.toolRow}>
            <View style={styles.toolIcon}>
              <Text style={styles.toolIconText}>👋</Text>
            </View>
            <View style={styles.toolInfo}>
              <Text style={styles.toolTitle}>5-4-3-2-1</Text>
              <Text style={styles.toolDescription}>Reconnect with your senses</Text>
            </View>
            <Text style={styles.toolChevron}>›</Text>
          </View>
        </GlassCard>

        <GlassCard variant="elevated" style={styles.toolCard}>
          <View style={styles.toolRow}>
            <View style={styles.toolIcon}>
              <Text style={styles.toolIconText}>≋</Text>
            </View>
            <View style={styles.toolInfo}>
              <Text style={styles.toolTitle}>Box Breathing</Text>
              <Text style={styles.toolDescription}>Regulate your nervous system</Text>
            </View>
            <Text style={styles.toolChevron}>›</Text>
          </View>
        </GlassCard>

        <View style={styles.waveCard}>
          <View style={styles.waveContent}>
            <View style={styles.wavePlayBtn}>
              <Text style={styles.wavePlayIcon}>▶</Text>
            </View>
            <View>
              <Text style={styles.waveTitle}>Wave Riders</Text>
              <Text style={styles.waveLabel}>GUIDED AUDIO SUPPORT</Text>
            </View>
          </View>
        </View>

        <ActionButton
          title="✳  GET IMMEDIATE HELP"
          onPress={() => console.log('Crisis support')}
          variant="danger"
          style={styles.emergencyButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  forestBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0A1A12',
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 48,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  closeIcon: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  headerLabel: {
    ...typography.label,
    color: colors.coral,
    textAlign: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    ...typography.title,
    textAlign: 'center',
    marginBottom: 32,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  heroSubtitle: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  toolCard: {
    marginBottom: 10,
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  toolIconText: {
    fontSize: 20,
  },
  toolInfo: {
    flex: 1,
  },
  toolTitle: {
    ...typography.subtitle,
    fontSize: 17,
  },
  toolDescription: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 2,
  },
  toolChevron: {
    fontSize: 24,
    color: colors.textMuted,
  },
  waveCard: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: 'rgba(74, 144, 217, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 217, 0.2)',
  },
  waveContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 14,
  },
  wavePlayBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wavePlayIcon: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  waveTitle: {
    ...typography.subtitle,
    fontSize: 17,
  },
  waveLabel: {
    ...typography.label,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  emergencyButton: {
    marginTop: 'auto',
  },
});
