import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '../navigation/AppNavigator';
import GlassCardNew from '../components/GlassCardNew';
import GradientButton from '../components/GradientButton';
import MoodIcon from '../components/MoodIcon';
import QuoteCard from '../components/QuoteCard';
import SectionHeader from '../components/SectionHeader';
import { colors, radius, typography, spacing } from '../theme';
import { useApp } from '../context/AppContext';

type DashboardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;
type Props = { navigation: DashboardNavigationProp };

type MoodType = 'stormy' | 'rainy' | 'cloudy' | 'partly' | 'sunny';

const MOOD_CONFIG: Record<MoodType, { label: string }> = {
  stormy: { label: 'Stormy' },
  rainy: { label: 'Rainy' },
  cloudy: { label: 'Cloudy' },
  partly: { label: 'Partly' },
  sunny: { label: 'Sunny' },
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning,';
  if (h < 17) return 'Good Afternoon,';
  return 'Good Evening,';
}

export default function DashboardScreen({ navigation }: Props) {
  const { userProfile, currentMood, saveMoodEntry } = useApp();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(
    currentMood?.mood?.toLowerCase() as MoodType | null
  );

  const handleMoodSelect = async (mood: MoodType) => {
    setSelectedMood(mood);
    const config = MOOD_CONFIG[mood];
    await saveMoodEntry({
      mood: config.label,
      moodIcon: '',
      griefIntensity: 5,
      innerCurrent: config.label,
      emotionalCapacity: 0.5,
    });
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Background with Forest Theme */}
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

      <View style={styles.content}>
        {/* Header with Profile */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{userProfile.name || 'Friend'}</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton} 
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Check-in Question */}
        <Text style={styles.checkInQuestion}>How are you arriving today?</Text>

        {/* Mood Check-in Card */}
        <GlassCardNew variant="elevated" style={styles.moodCard}>
          <View style={styles.moodHeader}>
            <Text style={styles.moodTitle}>Mood Check-in</Text>
            <View style={styles.todayBadge}>
              <Text style={styles.todayText}>{currentMood ? currentMood.mood : 'Today'}</Text>
            </View>
          </View>
          
          <View style={styles.moodGrid}>
            {(['stormy', 'rainy', 'cloudy', 'partly', 'sunny'] as MoodType[]).map((mood) => (
              <MoodIcon
                key={mood}
                mood={mood}
                selected={selectedMood === mood}
                onPress={() => handleMoodSelect(mood)}
                size="medium"
              />
            ))}
          </View>

          <View style={styles.checkInActions}>
            <TouchableOpacity 
              style={styles.fullCheckInBtn} 
              onPress={() => navigation.navigate('CheckIn')}
            >
              <Text style={styles.fullCheckInText}>Full Check-in →</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.historyBtn} 
              onPress={() => navigation.navigate('MoodHistory' as never)}
            >
              <Text style={styles.historyBtnText}>View History</Text>
            </TouchableOpacity>
          </View>
        </GlassCardNew>

        {/* Recommended Section */}
        <View style={styles.sectionSpacing}>
          <SectionHeader 
            title="Recommended for you" 
            actionText="View all"
            onAction={() => navigation.navigate('Journey')}
          />
        </View>

        {/* Audio Session Card */}
        <TouchableOpacity 
          activeOpacity={0.85} 
          onPress={() => navigation.navigate('AudioSession' as never)}
          style={styles.audioCard}
        >
          <GlassCardNew variant="default" noPadding={true}>
            <View style={styles.audioContent}>
              <View style={styles.audioBadge}>
                <Text style={styles.audioBadgeText}>AUDIO</Text>
              </View>
              <View style={styles.playArea}>
                <View style={styles.playButton}>
                  <Text style={styles.playIcon}>▶</Text>
                </View>
                <View style={styles.waveform}>
                  {[...Array(20)].map((_, i) => (
                    <View 
                      key={i} 
                      style={[
                        styles.waveBar,
                        { 
                          height: 8 + (i % 5) * 5,
                          backgroundColor: `rgba(74,144,217,${0.3 + (i % 3) * 0.2})`
                        }
                      ]} 
                    />
                  ))}
                </View>
              </View>
              <View style={styles.audioTextContainer}>
                <Text style={styles.audioTitle}>Wave Rider</Text>
                <Text style={styles.audioDescription}>
                  A 3-minute guided breathing session to help you navigate sudden waves of grief.
                </Text>
                <View style={styles.audioMeta}>
                  <Text style={styles.metaTag}>⏱ 3 min</Text>
                  <Text style={styles.metaTag}>✦ Grounding</Text>
                </View>
              </View>
            </View>
          </GlassCardNew>
        </TouchableOpacity>

        {/* Quote Card */}
        <View style={styles.sectionSpacing}>
          <QuoteCard 
            quote='"Grief is not a disorder, a disease or a sign of weakness. It is an emotional, physical and spiritual necessity, the price you pay for love."' 
          />
        </View>

        {/* Roots & Tides Program Section */}
        <GlassCardNew variant="nature" style={styles.programCard}>
          <Text style={styles.programTitle}>Roots & Tides</Text>
          <Text style={styles.programSubtitle}>You don't have to do this all at once.</Text>
          
          <GradientButton
            variant="anchor"
            onPress={() => navigation.navigate('Escalation')}
            style={styles.sosButton}
            icon="⚓"
          >
            Start with an Anchor
            <Text style={styles.buttonSubtext}>Immediate support (SOS)</Text>
          </GradientButton>
          
          <GradientButton
            variant="secondary"
            onPress={() => navigation.navigate('Journey')}
            style={styles.gentleButton}
            icon="🌱"
          >
            Begin a gentle introduction
            <Text style={styles.buttonSubtext}>Take it slow</Text>
          </GradientButton>
          
          <Text style={styles.paceText}>YOUR PACE, YOUR JOURNEY.</Text>
        </GlassCardNew>

        <View style={styles.bottomSpacing} />
      </View>
    </ScrollView>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  userName: {
    ...typography.heroTitle,
    fontSize: 32,
    lineHeight: 40,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 22,
  },
  checkInQuestion: {
    ...typography.title,
    fontSize: 26,
    marginBottom: spacing.lg,
    lineHeight: 32,
  },
  moodCard: {
    marginBottom: spacing.xl,
  },
  moodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  moodTitle: {
    ...typography.subtitle,
    fontSize: 18,
  },
  todayBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  todayText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  moodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  checkInActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  fullCheckInBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  fullCheckInText: {
    ...typography.buttonText,
    fontSize: 14,
    color: colors.coral,
  },
  historyBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  historyBtnText: {
    ...typography.buttonText,
    fontSize: 14,
    color: colors.textMuted,
  },
  sectionSpacing: {
    marginBottom: spacing.md,
  },
  audioCard: {
    marginBottom: spacing.lg,
  },
  audioContent: {
    padding: spacing.lg,
  },
  audioBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    zIndex: 1,
  },
  audioBadgeText: {
    ...typography.caption,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  playArea: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blueSoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    height: 96,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.blueGlow,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  playIcon: {
    color: colors.textPrimary,
    fontSize: 18,
    marginLeft: 2,
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
  audioTextContainer: {
    paddingHorizontal: spacing.md,
  },
  audioTitle: {
    ...typography.subtitle,
    marginBottom: spacing.xs,
    paddingLeft: spacing.md,
  },
  audioDescription: {
    ...typography.bodySmall,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    lineHeight: 20,
  },
  audioMeta: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  metaTag: {
    ...typography.tag,
  },
  programCard: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  programTitle: {
    ...typography.title,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  programSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  sosButton: {
    marginBottom: spacing.md,
  },
  gentleButton: {
    marginBottom: spacing.lg,
  },
  buttonSubtext: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 4,
  },
  paceText: {
    ...typography.label,
    color: colors.textMuted,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: spacing.xxl,
  },
});