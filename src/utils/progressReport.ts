import { MoodEntry, JournalEntry, ModuleProgress, ProgressReport, MoodSummary, ActivitySummary } from '../context/types';

export function generateProgressReport(
  moodHistory: MoodEntry[],
  journalEntries: JournalEntry[],
  moduleProgress: ModuleProgress[],
  startDate: string,
  endDate: string,
  notes?: string
): ProgressReport {
  // Filter data within date range
  const filteredMoods = moodHistory.filter(entry => {
    const entryDate = new Date(entry.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return entryDate >= start && entryDate <= end;
  });

  const filteredJournals = journalEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return entryDate >= start && entryDate <= end;
  });

  // Generate summaries
  const moodSummary = generateMoodSummary(filteredMoods);
  const activitySummary = generateActivitySummary(filteredJournals, moduleProgress);
  
  // Get journal highlights (most recent 3 entries)
  const journalHighlights = filteredJournals
    .slice(-3)
    .reverse()
    .map(entry => entry.content.substring(0, 200) + (entry.content.length > 200 ? '...' : ''));

  const report: ProgressReport = {
    id: `report-${Date.now()}`,
    userId: 'user', // Will be set from context
    generatedAt: new Date().toISOString(),
    dateRangeStart: startDate,
    dateRangeEnd: endDate,
    moodSummary,
    activitySummary,
    journalHighlights,
    notes,
  };

  return report;
}

function generateMoodSummary(moodEntries: MoodEntry[]): MoodSummary {
  if (moodEntries.length === 0) {
    return {
      averageMood: 'Cloudy',
      moodTrend: 'stable',
      topEmotions: [],
      checkInsCompleted: 0,
    };
  }

  const moodValues: Record<string, number> = {
    'Stormy': 1,
    'Rainy': 2,
    'Cloudy': 3,
    'Partly': 4,
    'Sunny': 5,
  };

  const moodEmotions: Record<string, string> = {
    'Stormy': 'sadness',
    'Rainy': 'sadness',
    'Cloudy': 'numbness',
    'Partly': 'hope',
    'Sunny': 'gratitude',
  };

  // Calculate average mood
  const totalMoodValue = moodEntries.reduce((sum, entry) => sum + (moodValues[entry.mood] ?? 3), 0);
  const averageMoodValue = totalMoodValue / moodEntries.length;

  const averageMood = Object.entries(moodValues).find(([_, value]) => value === Math.round(averageMoodValue))?.[0] || 'Cloudy';

  // Calculate mood trend
  const recent = moodEntries.slice(-Math.min(7, moodEntries.length));
  const older = moodEntries.slice(0, -Math.min(7, moodEntries.length));
  
  const recentAvg = recent.reduce((sum, entry) => sum + (moodValues[entry.mood] ?? 3), 0) / recent.length;
  const olderAvg = older.length > 0 
    ? older.reduce((sum, entry) => sum + (moodValues[entry.mood] ?? 3), 0) / older.length 
    : recentAvg;

  let moodTrend: 'improving' | 'stable' | 'declining' = 'stable';
  if (recentAvg > olderAvg + 0.5) moodTrend = 'improving';
  if (recentAvg < olderAvg - 0.5) moodTrend = 'declining';

  // Count emotions
  const emotionCounts: Record<string, number> = {};
  moodEntries.forEach(entry => {
    const emotion = moodEmotions[entry.mood];
    if (emotion) {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    }
  });

  const topEmotions = Object.entries(emotionCounts)
    .map(([emotion, count]) => ({ emotion, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    averageMood,
    moodTrend,
    topEmotions,
    checkInsCompleted: moodEntries.length,
  };
}

function generateActivitySummary(journalEntries: JournalEntry[], moduleProgress: ModuleProgress[]): ActivitySummary {
  // Count completed modules
  const modulesCompleted = moduleProgress.filter(m => m.status === 'completed').length;
  
  // Calculate streak (simplified - consecutive days with journal entries)
  const streakDays = calculateStreak(journalEntries);

  return {
    journalEntriesCount: journalEntries.length,
    modulesCompleted,
    exercisesCompleted: 0, // Will be calculated from exercise completion data
    streakDays,
  };
}

function calculateStreak(journalEntries: JournalEntry[]): number {
  if (journalEntries.length === 0) return 0;

  const sortedEntries = [...journalEntries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === streak) {
      streak++;
    } else if (diffDays > streak) {
      break;
    }
  }

  return streak;
}

export function generateReportText(report: ProgressReport): string {
  return `# Grief Journey Progress Report
Date: ${new Date(report.generatedAt).toLocaleDateString()}
Period: ${new Date(report.dateRangeStart).toLocaleDateString()} - ${new Date(report.dateRangeEnd).toLocaleDateString()}

## Mood Summary
Average Mood: ${report.moodSummary.averageMood}
Trend: ${report.moodSummary.moodTrend}
Check-ins Completed: ${report.moodSummary.checkInsCompleted}

Top Emotions:
${report.moodSummary.topEmotions.map(e => `- ${e.emotion}: ${e.count} times`).join('\n')}

## Activity Summary
- Journal Entries: ${report.activitySummary.journalEntriesCount}
- Modules Completed: ${report.activitySummary.modulesCompleted}
- Current Streak: ${report.activitySummary.streakDays} days

## Journal Highlights
${report.journalHighlights.map((entry, i) => `${i + 1}. ${entry}`).join('\n\n')}

${report.notes ? `## Notes from Client\n${report.notes}` : ''}
`;
}

export function exportReportAsJSON(report: ProgressReport): string {
  return JSON.stringify(report, null, 2);
}

export function exportReportAsCSV(report: ProgressReport): string {
  const rows = [
    ['Report ID', report.id],
    ['Generated At', report.generatedAt],
    ['Date Range Start', report.dateRangeStart],
    ['Date Range End', report.dateRangeEnd],
    [],
    ['Mood Summary'],
    ['Average Mood', report.moodSummary.averageMood],
    ['Mood Trend', report.moodSummary.moodTrend],
    ['Check-ins Completed', report.moodSummary.checkInsCompleted],
    [],
    ['Activity Summary'],
    ['Journal Entries', report.activitySummary.journalEntriesCount],
    ['Modules Completed', report.activitySummary.modulesCompleted],
    ['Streak Days', report.activitySummary.streakDays],
  ];

  return rows.map(row => row.join(',')).join('\n');
}