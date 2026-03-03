import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import GlassCard from '../components/GlassCard';
import ActionButton from '../components/ActionButton';
import { colors, radius, typography } from '../theme';
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
    await saveMoodEntry({ mood: innerCurrent || 'Overcast', moodIcon: cur?.icon || '☁️', griefIntensity, innerCurrent: innerCurrent || 'Overcast', emotionalCapacity: capacity });
    await setCapacityLevel(capacity);
    setSaved(true);
    setTimeout(() => navigation.goBack(), 800);
  };

  if (saved) {
    return (
      <View style={styles.savedContainer}>
        <Text style={styles.savedIcon}>✓</Text>
        <Text style={styles.savedText}>Check-in saved</Text>
      </View>
    );
  }

  return (
    <View style={styles.fullScreen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}><Text style={styles.closeIcon}>✕</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Daily Check-in</Text>
          <TouchableOpacity onPress={handleSave}><Text style={styles.saveText}>Save</Text></TouchableOpacity>
        </View>
        <Text style={styles.sectionLabel}>NAVIGATING THE WATERS WITHIN</Text>
        <Text style={styles.heroTitle}>Tuning into your inner climate</Text>

        <GlassCard variant="elevated" style={styles.card}>
          <View style={styles.cardHeader}>
            <View><Text style={styles.cardTitle}>Grief Intensity</Text><Text style={styles.cardSub}>Acknowledge its presence</Text></View>
            <Text style={styles.intensityValue}>{griefIntensity.toFixed(1)}</Text>
          </View>
          <View style={styles.sliderTrack}>
            {[...Array(11)].map((_, i) => (
              <TouchableOpacity key={i} style={[styles.sliderSegment, i <= griefIntensity && styles.sliderSegmentActive, i === Math.round(griefIntensity) && styles.sliderSegmentCurrent]} onPress={() => setGriefIntensity(i)} />
            ))}
          </View>
          <View style={styles.sliderLabels}><Text style={styles.sliderLabel}>GENTLE</Text><Text style={styles.sliderLabel}>STORMY</Text></View>
        </GlassCard>

        <GlassCard variant="default" style={styles.card}>
          <Text style={styles.cardTitle}>Your Inner Currents</Text>
          <Text style={styles.cardSub}>Select your current state</Text>
          <View style={styles.currentsGrid}>
            {INNER_CURRENTS.map((current) => (
              <TouchableOpacity key={current.label} style={[styles.currentCard, innerCurrent === current.label && { borderColor: current.color, backgroundColor: current.color + '20' }]} onPress={() => setInnerCurrent(current.label)} activeOpacity={0.8}>
                <View style={[styles.currentCircle, { backgroundColor: current.color + '30' }]}><Text style={styles.currentIcon}>{current.icon}</Text></View>
                <Text style={[styles.currentLabel, innerCurrent === current.label && { color: current.color }]}>{current.label.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        <GlassCard variant="accent" style={styles.card}>
          <View style={styles.cardHeader}>
            <View><Text style={styles.cardTitle}>Emotional Capacity</Text><Text style={styles.cardSub}>How are you today?</Text></View>
            <Text style={[styles.capacityLabel, { color: colors.coral }]}>{capacityLabel}</Text>
          </View>
          <View style={styles.capacityTrack}>
            {[...Array(10)].map((_, i) => {
              const segVal = (i + 1) / 10;
              return <TouchableOpacity key={i} style={[styles.capacitySegment, segVal <= capacity && styles.capacitySegmentActive]} onPress={() => setCapacity(segVal)} />;
            })}
          </View>
          <View style={styles.sliderLabels}><Text style={styles.sliderLabel}>DEPLETED</Text><Text style={styles.sliderLabel}>FULL</Text></View>
        </GlassCard>

        <ActionButton title="Save Check-in" onPress={handleSave} variant="primary" style={styles.saveBtn} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 56, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  closeIcon: { color: colors.textPrimary, fontSize: 14 },
  headerTitle: { ...typography.subtitle, fontSize: 17 },
  saveText: { fontSize: 15, fontWeight: '700', color: colors.coral },
  sectionLabel: { ...typography.label, color: colors.textMuted, marginBottom: 8 },
  heroTitle: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginBottom: 24, lineHeight: 34 },
  card: { marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  cardTitle: { ...typography.subtitle, fontSize: 16 },
  cardSub: { ...typography.bodySmall, color: colors.textMuted, marginTop: 2 },
  intensityValue: { fontSize: 28, fontWeight: '700', color: colors.coral },
  sliderTrack: { flexDirection: 'row', gap: 3, marginBottom: 8 },
  sliderSegment: { flex: 1, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.08)' },
  sliderSegmentActive: { backgroundColor: 'rgba(232,116,97,0.4)' },
  sliderSegmentCurrent: { backgroundColor: colors.coral },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  sliderLabel: { ...typography.label, fontSize: 10, color: colors.textMuted },
  currentsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  currentCard: { width: '30%', alignItems: 'center', padding: 10, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.03)' },
  currentCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  currentIcon: { fontSize: 22 },
  currentLabel: { fontSize: 10, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.5 },
  capacityLabel: { fontSize: 16, fontWeight: '700' },
  capacityTrack: { flexDirection: 'row', gap: 4, marginBottom: 8 },
  capacitySegment: { flex: 1, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.08)' },
  capacitySegmentActive: { backgroundColor: colors.coral },
  saveBtn: { marginTop: 8 },
  savedContainer: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  savedIcon: { fontSize: 48, color: colors.green, marginBottom: 12 },
  savedText: { ...typography.subtitle, color: colors.textPrimary },
});