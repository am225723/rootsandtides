import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ScreenContainer from '../components/ScreenContainer';
import GlassCard from '../components/GlassCard';
import { colors, radius, typography } from '../theme';
import { useApp } from '../context/AppContext';
import { MoodEntry } from '../context/types';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'MoodHistory'> };

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function getIntensityColor(intensity: number): string {
  if (intensity <= 3) return colors.green;
  if (intensity <= 6) return colors.gold;
  return colors.coral;
}

function getCapacityColor(capacity: number): string {
  if (capacity <= 0.3) return colors.coral;
  if (capacity <= 0.6) return colors.gold;
  return colors.green;
}

function MoodEntryCard({ entry }: { entry: MoodEntry }) {
  const intensityColor = getIntensityColor(entry.griefIntensity);
  const capacityColor = getCapacityColor(entry.emotionalCapacity);

  return (
    <GlassCard variant="default" style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDate(entry.date)}</Text>
          <Text style={styles.timeText}>{formatTime(entry.date)}</Text>
        </View>
        <View style={styles.moodBadge}>
          <Text style={styles.moodIcon}>{entry.moodIcon}</Text>
          <Text style={styles.moodText}>{entry.mood}</Text>
        </View>
      </View>
      
      <View style={styles.metricsContainer}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Grief Intensity</Text>
          <View style={styles.metricBar}>
            <View style={[styles.metricFill, { width: `${entry.griefIntensity * 10}%`, backgroundColor: intensityColor }]} />
          </View>
          <Text style={[styles.metricValue, { color: intensityColor }]}>{entry.griefIntensity.toFixed(1)}/10</Text>
        </View>
        
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Emotional Capacity</Text>
          <View style={styles.metricBar}>
            <View style={[styles.metricFill, { width: `${entry.emotionalCapacity * 100}%`, backgroundColor: capacityColor }]} />
          </View>
          <Text style={[styles.metricValue, { color: capacityColor }]}>{Math.round(entry.emotionalCapacity * 100)}%</Text>
        </View>
      </View>
      
      {entry.notes && (
        <Text style={styles.notesText}>"{entry.notes}"</Text>
      )}
    </GlassCard>
  );
}

function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📝</Text>
      <Text style={styles.emptyTitle}>No Check-ins Yet</Text>
      <Text style={styles.emptyText}>
        Your mood history will appear here after you complete your first check-in.
      </Text>
    </View>
  );
}

export default function MoodHistoryScreen({ navigation }: Props) {
  const { moodHistory } = useApp();

  // Group entries by date
  const groupedEntries = React.useMemo(() => {
    const groups: { [key: string]: MoodEntry[] } = {};
    moodHistory.forEach(entry => {
      const dateKey = new Date(entry.date).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(entry);
    });
    return groups;
  }, [moodHistory]);

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mood History</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>Your journey, day by day</Text>
        
        {moodHistory.length === 0 ? (
          <EmptyState />
        ) : (
          <View style={styles.entriesContainer}>
            <View style={styles.statsCard}>
              <Text style={styles.statsText}>
                {moodHistory.length} check-in{moodHistory.length !== 1 ? 's' : ''} recorded
              </Text>
            </View>
            
            {Object.entries(groupedEntries).map(([dateKey, entries]) => (
              <View key={dateKey} style={styles.dateGroup}>
                <Text style={styles.dateGroupHeader}>{formatDate(dateKey)}</Text>
                {entries.map(entry => (
                  <MoodEntryCard key={entry.id} entry={entry} />
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: colors.textPrimary,
    fontSize: 18,
  },
  headerTitle: {
    ...typography.subtitle,
    fontSize: 17,
  },
  placeholder: {
    width: 36,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
  },
  entriesContainer: {
    gap: 16,
  },
  statsCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radius.md,
    padding: 12,
    alignItems: 'center',
  },
  statsText: {
    ...typography.tag,
    color: colors.textSecondary,
  },
  dateGroup: {
    marginBottom: 8,
  },
  dateGroupHeader: {
    ...typography.label,
    marginBottom: 12,
    marginLeft: 4,
  },
  entryCard: {
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  dateContainer: {
    flex: 1,
  },
  dateText: {
    ...typography.subtitle,
    fontSize: 16,
    marginBottom: 2,
  },
  timeText: {
    ...typography.tag,
    color: colors.textMuted,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  moodIcon: {
    fontSize: 16,
  },
  moodText: {
    ...typography.tag,
    color: colors.textPrimary,
  },
  metricsContainer: {
    gap: 12,
    marginBottom: 12,
  },
  metric: {
    gap: 4,
  },
  metricLabel: {
    ...typography.tag,
    fontSize: 10,
    marginBottom: 4,
  },
  metricBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  metricFill: {
    height: '100%',
    borderRadius: 3,
  },
  metricValue: {
    ...typography.tag,
    fontSize: 11,
    marginTop: 2,
  },
  notesText: {
    ...typography.bodySmall,
    fontStyle: 'italic',
    color: colors.textWarm,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    ...typography.subtitle,
    marginBottom: 8,
  },
  emptyText: {
    ...typography.bodySmall,
    textAlign: 'center',
    lineHeight: 22,
  },
});