import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '../navigation/AppNavigator';
import ScreenContainer from '../components/ScreenContainer';
import GlassCard from '../components/GlassCard';
import ActionButton from '../components/ActionButton';
import SectionHeader from '../components/SectionHeader';
import QuoteCard from '../components/QuoteCard';
import { colors, radius, typography, spacing } from '../theme';

type DashboardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type Props = {
  navigation: DashboardNavigationProp;
};

const MOODS = [
  { label: 'Stormy', icon: '⛈️', color: '#4A5568' },
  { label: 'Rainy', icon: '🌧️', color: '#4A90D9' },
  { label: 'Cloudy', icon: '☁️', color: '#A0AEC0' },
  { label: 'Partly', icon: '⛅', color: '#ECC94B' },
  { label: 'Sunny', icon: '☀️', color: '#ED8936' },
];

export default function DashboardScreen({ navigation }: Props) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Evening,</Text>
          <Text style={styles.userName}>Alex</Text>
        </View>
        <TouchableOpacity style={styles.notificationBell}>
          <Text style={styles.bellIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.checkInQuestion}>How are you arriving today?</Text>

      <GlassCard variant="elevated">
        <View style={styles.moodHeader}>
          <Text style={styles.moodTitle}>Mood Check-in</Text>
          <View style={styles.todayBadge}>
            <Text style={styles.todayText}>Today</Text>
          </View>
        </View>
        <View style={styles.moodRow}>
          {MOODS.map((mood) => (
            <TouchableOpacity
              key={mood.label}
              style={[
                styles.moodButton,
                selectedMood === mood.label && { backgroundColor: mood.color + '30' },
              ]}
              onPress={() => setSelectedMood(mood.label)}
            >
              <Text style={styles.moodIcon}>{mood.icon}</Text>
              <Text style={[
                styles.moodLabel,
                selectedMood === mood.label && { color: mood.color },
              ]}>
                {mood.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </GlassCard>

      <SectionHeader title="Recommended for you" actionText="View all" onAction={() => {}} />

      <GlassCard variant="default">
        <View style={styles.audioBadge}>
          <Text style={styles.audioBadgeText}>AUDIO</Text>
        </View>
        <View style={styles.audioContent}>
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
          <View style={styles.waveform}>
            {[...Array(20)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.waveBar,
                  { height: 8 + Math.random() * 24, backgroundColor: `rgba(74, 144, 217, ${0.3 + Math.random() * 0.7})` },
                ]}
              />
            ))}
          </View>
        </View>
        <Text style={styles.audioTitle}>Wave Rider</Text>
        <Text style={styles.audioDescription}>
          A 3-minute guided breathing session to help you navigate sudden waves of grief.
        </Text>
        <View style={styles.audioMeta}>
          <Text style={styles.metaTag}>⏱ 3 min</Text>
          <Text style={styles.metaTag}>✦ Grounding</Text>
        </View>
      </GlassCard>

      <QuoteCard
        quote='"Grief is not a disorder, a disease or a sign of weakness. It is an emotional, physical and spiritual necessity, the price you pay for love."'
      />

      <View style={styles.rootsTidesSection}>
        <View style={styles.rootsTidesBackground}>
          <View style={styles.rtOverlay} />
          <View style={styles.rtContent}>
            <Text style={styles.rtTitle}>Roots & Tides</Text>
            <Text style={styles.rtSubtitle}>You don't have to do this all at once.</Text>

            <TouchableOpacity
              style={styles.sosButton}
              onPress={() => navigation.navigate('Escalation')}
              activeOpacity={0.8}
            >
              <Text style={styles.sosIcon}>⚓</Text>
              <View>
                <Text style={styles.sosTitle}>Start with an Anchor</Text>
                <Text style={styles.sosSubtitle}>Immediate support (SOS)</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gentleButton}
              onPress={() => navigation.navigate('Journey')}
              activeOpacity={0.8}
            >
              <Text style={styles.gentleIcon}>⚓</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.gentleTitle}>Begin a gentle introduction</Text>
                <Text style={styles.gentleSubtitle}>Take it slow</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <Text style={styles.paceText}>YOUR PACE, YOUR JOURNEY.</Text>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingTop: 8,
  },
  greeting: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 2,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  notificationBell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellIcon: {
    fontSize: 18,
  },
  checkInQuestion: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  moodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  moodTitle: {
    ...typography.subtitle,
    fontSize: 16,
  },
  todayBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  todayText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: radius.md,
    minWidth: 56,
  },
  moodIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  moodLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  audioBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    zIndex: 1,
  },
  audioBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  audioContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 217, 0.1)',
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 12,
    height: 80,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(74, 144, 217, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  playIcon: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  waveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 40,
  },
  waveBar: {
    width: 3,
    borderRadius: 2,
  },
  audioTitle: {
    ...typography.subtitle,
    marginBottom: 4,
  },
  audioDescription: {
    ...typography.bodySmall,
    marginBottom: 12,
  },
  audioMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaTag: {
    ...typography.tag,
  },
  rootsTidesSection: {
    marginTop: 8,
    marginHorizontal: -20,
  },
  rootsTidesBackground: {
    backgroundColor: '#0A1A12',
    position: 'relative',
  },
  rtOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  rtContent: {
    padding: 24,
    alignItems: 'center',
  },
  rtTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  rtSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  sosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 217, 0.2)',
    borderRadius: radius.lg,
    padding: 16,
    width: '100%',
    marginBottom: 12,
    gap: 12,
  },
  sosIcon: {
    fontSize: 20,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(74, 144, 217, 0.3)',
    borderRadius: 20,
    textAlign: 'center',
    lineHeight: 40,
  },
  sosTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sosSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  gentleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: radius.lg,
    padding: 16,
    width: '100%',
    marginBottom: 20,
    gap: 12,
  },
  gentleIcon: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  gentleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  gentleSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
  },
  chevron: {
    fontSize: 24,
    color: colors.textMuted,
  },
  paceText: {
    ...typography.label,
    color: colors.textMuted,
    marginTop: 4,
  },
});
