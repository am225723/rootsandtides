import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import GlassCardNew from '../components/GlassCardNew';
import GradientButton from '../components/GradientButton';
import { colors, radius, typography, spacing } from '../theme';
import { useApp } from '../context/AppContext';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'CheckIn'> };

const INNER_CURRENTS = [
  { label: 'Overcast', icon: '☁️', color: '#A0AEC0' },
  { label: 'Drizzle', icon: '🌦️', color: '#4A90D9' },
  { label: 'Stormy', icon: '⛈️', color: '#4A5568' },
  { label: 'Foggy', icon: '🌫️', color: '#718096' },
  { label: 'Clearing', icon: '🌤️', color: '#ECC94B' },
  { label: 'Sunny', icon: '☀️', color: '#ED8936' },
];

const CAPACITY_LABELS = ['Depleted', 'Resting', 'Low', 'Moderate', 'Capable', 'Full'];

export default function CheckInScreen({ navigation }: Props) {
  const { saveMoodEntry, setCapacityLevel } = useApp();
  const [griefIntensity, setGriefIntensity] = useState(5);
  const [innerCurrent, setInnerCurrent] = useState('');
  const [capacity, setCapacity] = useState(0.4);
  const [saved, setSaved] = useState(false);

  const capacityIndex = Math.round(capacity * (CAPACITY_LABELS.length - 1));
  const capacityLabel = CAPACITY_LABELS[capacityIndex];

  const handleSave = async () => {
    const cur = INNER_CURRENTS.find(c => c.label === innerCurrent);
    await saveMoodEntry({
      mood: innerCurrent || 'Overcast',
      moodIcon: cur?.icon || '☁️',
      griefIntensity,
      innerCurrent: innerCurrent || 'Overcast',
      emotionalCapacity: capacity
    });
    await setCapacityLevel(capacity);
    setSaved(true);
    setTimeout(() => navigation.goBack(), 800);
  };

  if (saved) {
    return (
      <View style={styles.savedContainer}>
        <LinearGradient
          colors={['rgba(76, 175, 80, 0.2)', 'rgba(76, 175, 80, 0.05)']}
          style={styles.savedGradient}
        >
          <Text style={styles.savedIcon}>✓</Text>
          <Text style={styles.savedText}>Check-in saved</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.fullScreen}>
      <ImageBackground
        source={require('../../assets/bg/forest.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(17, 22, 31, 0.98)', 'rgba(17, 22, 31, 0.95)']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </ImageBackground>
      
      <ScrollView 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeBtn} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Daily Check-in</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.sectionLabel}>NAVIGATING THE WATERS WITHIN</Text>
        <Text style={styles.heroTitle}>Tuning into your inner climate</Text>

        <GlassCardNew variant="elevated" style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Grief Intensity</Text>
              <Text style={styles.cardSub}>Acknowledge its presence</Text>
            </View>
            <Text style={styles.intensityValue}>{griefIntensity.toFixed(1)}</Text>
          </View>
          <View style={styles.sliderTrack}>
            {[...Array(11)].map((_, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.sliderSegment,
                  i <= griefIntensity && styles.sliderSegmentActive,
                  i === Math.round(griefIntensity) && styles.sliderSegmentCurrent
                ]}
                onPress={() => setGriefIntensity(i)}
              />
            ))}
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>GENTLE</Text>
            <Text style={styles.sliderLabel}>STORMY</Text>
          </View>
        </GlassCardNew>

        <GlassCardNew variant="default" style={styles.card}>
          <Text style={styles.cardTitle}>Your Inner Currents</Text>
          <Text style={styles.cardSub}>Select your current state</Text>
          <View style={styles.currentsGrid}>
            {INNER_CURRENTS.map((current) => (
              <TouchableOpacity
                key={current.label}
                style={[
                  styles.currentCard,
                  innerCurrent === current.label && {
                    borderColor: current.color,
                    backgroundColor: current.color + '20',
                    shadowColor: current.color,
                    shadowOpacity: 0.4,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 8,
                  }
                ]}
                onPress={() => setInnerCurrent(current.label)}
                activeOpacity={0.8}
              >
                <View style={[styles.currentCircle, { backgroundColor: current.color + '30' }]}>
                  <Text style={styles.currentIcon}>{current.icon}</Text>
                </View>
                <Text style={[
                  styles.currentLabel,
                  innerCurrent === current.label && { color: current.color }
                ]}>
                  {current.label.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCardNew>

        <GlassCardNew variant="accent" style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Emotional Capacity</Text>
              <Text style={styles.cardSub}>How are you today?</Text>
            </View>
            <Text style={[styles.capacityLabel, { color: colors.coral }]}>
              {capacityLabel}
            </Text>
          </View>
          <View style={styles.capacityTrack}>
            {[...Array(10)].map((_, i) => {
              const segVal = (i + 1) / 10;
              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.capacitySegment,
                    segVal <= capacity && styles.capacitySegmentActive
                  ]}
                  onPress={() => setCapacity(segVal)}
                />
              );
            })}
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>DEPLETED</Text>
            <Text style={styles.sliderLabel}>FULL</Text>
          </View>
        </GlassCardNew>

        <GradientButton
          title="Save Check-in"
          onPress={handleSave}
          variant="primary"
          style={styles.saveBtn}
          fullWidth={true}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
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
    paddingTop: 56,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeIcon: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  headerTitle: {
    ...typography.subtitle,
    fontSize: 18,
  },
  saveText: {
    ...typography.buttonText,
    fontSize: 16,
    color: colors.coral,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  heroTitle: {
    ...typography.heroTitle,
    fontSize: 32,
    marginBottom: spacing.xl,
    lineHeight: 40,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  cardTitle: {
    ...typography.subtitle,
    fontSize: 18,
  },
  cardSub: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: 4,
  },
  intensityValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.coral,
  },
  sliderTrack: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: spacing.sm,
  },
  sliderSegment: {
    flex: 1,
    height: 10,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  sliderSegmentActive: {
    backgroundColor: 'rgba(232, 116, 97, 0.4)',
  },
  sliderSegmentCurrent: {
    backgroundColor: colors.coral,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
  currentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  currentCard: {
    width: '30%',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  currentCircle: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  currentIcon: {
    fontSize: 24,
  },
  currentLabel: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  capacityLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  capacityTrack: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: spacing.sm,
  },
  capacitySegment: {
    flex: 1,
    height: 10,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  capacitySegmentActive: {
    backgroundColor: colors.coral,
  },
  saveBtn: {
    marginTop: spacing.md,
  },
  savedContainer: {
    flex: 1,
    backgroundColor: colors.surface.dark,
  },
  savedGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedIcon: {
    fontSize: 64,
    color: colors.green,
    marginBottom: spacing.md,
  },
  savedText: {
    ...typography.subtitle,
    color: colors.textPrimary,
    fontSize: 20,
  },
});