import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
  Alert, Platform, Share, TextInput
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useApp } from '../context/AppContext';
import { exportReportAsJSON, exportReportAsCSV } from '../utils/progressReport';

type ProgressReportScreenNavigationProp = NativeStackNavigationProp<any, 'ProgressReport'>;

interface Props {
  navigation: ProgressReportScreenNavigationProp;
  route: {
    params?: {
      connectionId?: string;
      therapistName?: string;
    };
  };
}

interface DateRange {
  start: Date;
  end: Date;
}

export default function ProgressReportScreen({ navigation, route }: Props) {
  const {
    moodHistory,
    journalEntries,
    moduleProgress,
    vaultCollections,
    userProfile,
    generateProgressReport: generateReport,
    progressReports,
  } = useApp();

  const { connectionId, therapistName } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [currentReport, setCurrentReport] = useState<any>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date(),
  });
  const [notes, setNotes] = useState('');

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const report = await generateReport(
        dateRange.start.toISOString(),
        dateRange.end.toISOString(),
        notes
      );
      setCurrentReport(report);
      setGenerated(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate progress report');
    } finally {
      setLoading(false);
    }
  };

  const handleShareReport = async (format: 'json' | 'csv' | 'text') => {
    if (!currentReport) return;

    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      if (format === 'json') {
        content = exportReportAsJSON(currentReport);
        filename = `progress_report_${formatDate(dateRange.start)}_${formatDate(dateRange.end)}.json`;
        mimeType = 'application/json';
      } else if (format === 'csv') {
        content = exportReportAsCSV(currentReport);
        filename = `progress_report_${formatDate(dateRange.start)}_${formatDate(dateRange.end)}.csv`;
        mimeType = 'text/csv';
      } else {
        content = generateReportText(currentReport, therapistName);
        filename = `progress_report_${formatDate(dateRange.start)}_${formatDate(dateRange.end)}.txt`;
        mimeType = 'text/plain';
      }

      if (Platform.OS === 'web') {
        // Web: Download file
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Mobile: Share via native share sheet
        await Share.share({
          message: content,
          title: `Progress Report for ${userProfile.name}`,
        });
      }

      Alert.alert('Success', `Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to export report');
    }
  };

  const handleSendToTherapist = async () => {
    if (!connectionId) {
      Alert.alert('Info', 'This report is not linked to a therapist connection');
      return;
    }
    
    Alert.alert(
      'Send to Therapist',
      'This will securely share the report with your therapist. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: () => {
            // In a real app, this would send to a backend
            Alert.alert('Success', 'Report sent to therapist');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const adjustDateRange = (days: number) => {
    const end = new Date();
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    setDateRange({ start, end });
    setGenerated(false);
  };

  if (generated && currentReport) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setGenerated(false)} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Progress Report</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <Ionicons name="document-text" size={32} color={colors.primary} />
              <View style={styles.reportHeaderInfo}>
                <Text style={styles.reportTitle}>Progress Report</Text>
                <Text style={styles.reportDate}>
                  {formatDate(new Date(currentReport.dateRangeStart))} - {formatDate(new Date(currentReport.dateRangeEnd))}
                </Text>
              </View>
            </View>

            {therapistName && (
              <View style={styles.therapistInfo}>
                <Ionicons name="person" size={16} color={colors.textSecondary} />
                <Text style={styles.therapistLabel}>For: {therapistName}</Text>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mood Summary</Text>
              <View style={styles.moodGrid}>
                <View style={styles.moodCard}>
                  <Text style={styles.moodCardLabel}>Average</Text>
                  <Text style={styles.moodCardValue}>{currentReport.moodSummary.averageMood}</Text>
                </View>
                <View style={styles.moodCard}>
                  <Text style={styles.moodCardLabel}>Trend</Text>
                  <Text style={[
                    styles.moodCardValue,
                    currentReport.moodSummary.moodTrend === 'improving' && styles.trendImproving,
                    currentReport.moodSummary.moodTrend === 'declining' && styles.trendDeclining,
                  ]}>
                    {currentReport.moodSummary.moodTrend}
                  </Text>
                </View>
                <View style={styles.moodCard}>
                  <Text style={styles.moodCardLabel}>Check-ins</Text>
                  <Text style={styles.moodCardValue}>{currentReport.moodSummary.checkInsCompleted}</Text>
                </View>
              </View>

              {currentReport.moodSummary.topEmotions.length > 0 && (
                <View style={styles.topEmotions}>
                  <Text style={styles.subsectionTitle}>Top Emotions</Text>
                  {currentReport.moodSummary.topEmotions.map((emotion: any, idx: number) => (
                    <View key={idx} style={styles.emotionItem}>
                      <Text style={styles.emotionName}>{emotion.emotion}</Text>
                      <Text style={styles.emotionCount}>{emotion.count}x</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Activity Summary</Text>
              <View style={styles.activityGrid}>
                <View style={styles.activityItem}>
                  <Ionicons name="book" size={20} color={colors.primary} />
                  <View>
                    <Text style={styles.activityValue}>{currentReport.activitySummary.journalEntriesCount}</Text>
                    <Text style={styles.activityLabel}>Journal Entries</Text>
                  </View>
                </View>
                <View style={styles.activityItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  <View>
                    <Text style={styles.activityValue}>{currentReport.activitySummary.modulesCompleted}</Text>
                    <Text style={styles.activityLabel}>Modules</Text>
                  </View>
                </View>
                <View style={styles.activityItem}>
                  <Ionicons name="flame" size={20} color={colors.warning} />
                  <View>
                    <Text style={styles.activityValue}>{currentReport.activitySummary.streakDays}</Text>
                    <Text style={styles.activityLabel}>Day Streak</Text>
                  </View>
                </View>
              </View>
            </View>

            {currentReport.journalHighlights.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Journal Highlights</Text>
                {currentReport.journalHighlights.slice(0, 3).map((highlight: string, idx: number) => (
                  <View key={idx} style={styles.highlightCard}>
                    <Ionicons name="chatbubble-ellipses" size={16} color={colors.primary} />
                    <Text style={styles.highlightText}>{highlight}</Text>
                  </View>
                ))}
              </View>
            )}

            {currentReport.notes && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Additional Notes</Text>
                <Text style={styles.notesText}>{currentReport.notes}</Text>
              </View>
            )}

            <View style={styles.actions}>
              <Text style={styles.actionsTitle}>Export Options</Text>
              <View style={styles.exportButtons}>
                <TouchableOpacity
                  style={styles.exportButton}
                  onPress={() => handleShareReport('text')}
                >
                  <Ionicons name="document-text" size={20} color={colors.primary} />
                  <Text style={styles.exportButtonText}>Text</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.exportButton}
                  onPress={() => handleShareReport('json')}
                >
                  <Ionicons name="code" size={20} color={colors.primary} />
                  <Text style={styles.exportButtonText}>JSON</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.exportButton}
                  onPress={() => handleShareReport('csv')}
                >
                  <Ionicons name="grid" size={20} color={colors.primary} />
                  <Text style={styles.exportButtonText}>CSV</Text>
                </TouchableOpacity>
              </View>
            </View>

            {connectionId && (
              <TouchableOpacity style={styles.sendButton} onPress={handleSendToTherapist}>
                <Ionicons name="send" size={20} color="#FFFFFF" />
                <Text style={styles.sendButtonText}>Send to Therapist</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Generate Report</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="bar-chart" size={32} color={colors.primary} />
            <View>
              <Text style={styles.cardTitle}>Progress Report</Text>
              <Text style={styles.cardSubtitle}>Share your journey with your therapist</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date Range</Text>
            <View style={styles.dateRangeButtons}>
              <TouchableOpacity
                style={[styles.dateButton, dateRange.start.getTime() === new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime() && styles.dateButtonActive]}
                onPress={() => adjustDateRange(7)}
              >
                <Text style={[styles.dateButtonText, dateRange.start.getTime() === new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime() && styles.dateButtonTextActive]}>7 Days</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dateButton, dateRange.start.getTime() === new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).getTime() && styles.dateButtonActive]}
                onPress={() => adjustDateRange(14)}
              >
                <Text style={[styles.dateButtonText, dateRange.start.getTime() === new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).getTime() && styles.dateButtonTextActive]}>14 Days</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dateButton, dateRange.start.getTime() === new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getTime() && styles.dateButtonActive]}
                onPress={() => adjustDateRange(30)}
              >
                <Text style={[styles.dateButtonText, dateRange.start.getTime() === new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getTime() && styles.dateButtonTextActive]}>30 Days</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dateButton, dateRange.start.getTime() === new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).getTime() && styles.dateButtonActive]}
                onPress={() => adjustDateRange(90)}
              >
                <Text style={[styles.dateButtonText, dateRange.start.getTime() === new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).getTime() && styles.dateButtonTextActive]}>90 Days</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateRangeDisplay}>
              <View style={styles.dateDisplay}>
                <Text style={styles.dateLabel}>From</Text>
                <Text style={styles.dateValue}>{formatDate(dateRange.start)}</Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color={colors.textSecondary} />
              <View style={styles.dateDisplay}>
                <Text style={styles.dateLabel}>To</Text>
                <Text style={styles.dateValue}>{formatDate(dateRange.end)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add any notes for your therapist..."
              placeholderTextColor={colors.textSecondary}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.infoSection}>
            <Ionicons name="information-circle" size={20} color={colors.textSecondary} />
            <Text style={styles.infoText}>
              The report will include mood history, journal entries, module progress, and activity summaries from the selected date range.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.generateButton, loading && styles.generateButtonDisabled]}
            onPress={handleGenerateReport}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="create" size={20} color="#FFFFFF" />
                <Text style={styles.generateButtonText}>Generate Report</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function generateReportText(report: any, therapistName?: string): string {
  const lines: string[] = [];
  
  lines.push('PROGRESS REPORT');
  lines.push('================');
  lines.push('');
  lines.push(`Generated: ${new Date(report.generatedAt).toLocaleString()}`);
  lines.push(`Date Range: ${report.dateRangeStart} to ${report.dateRangeEnd}`);
  if (therapistName) {
    lines.push(`For: ${therapistName}`);
  }
  lines.push('');
  
  lines.push('MOOD SUMMARY');
  lines.push('-------------');
  lines.push(`Average Mood: ${report.moodSummary.averageMood}`);
  lines.push(`Trend: ${report.moodSummary.moodTrend}`);
  lines.push(`Check-ins Completed: ${report.moodSummary.checkInsCompleted}`);
  if (report.moodSummary.topEmotions.length > 0) {
    lines.push('Top Emotions:');
    report.moodSummary.topEmotions.forEach((e: any) => {
      lines.push(`  - ${e.emotion}: ${e.count} times`);
    });
  }
  lines.push('');
  
  lines.push('ACTIVITY SUMMARY');
  lines.push('-----------------');
  lines.push(`Journal Entries: ${report.activitySummary.journalEntriesCount}`);
  lines.push(`Modules Completed: ${report.activitySummary.modulesCompleted}`);
  lines.push(`Day Streak: ${report.activitySummary.streakDays}`);
  lines.push('');
  
  if (report.journalHighlights.length > 0) {
    lines.push('JOURNAL HIGHLIGHTS');
    lines.push('------------------');
    report.journalHighlights.forEach((h: string, i: number) => {
      lines.push(`${i + 1}. ${h}`);
    });
    lines.push('');
  }
  
  if (report.notes) {
    lines.push('ADDITIONAL NOTES');
    lines.push('-----------------');
    lines.push(report.notes);
  }
  
  return lines.join('\n');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 12,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  dateRangeButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  dateButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  dateButtonTextActive: {
    color: '#FFFFFF',
  },
  dateRangeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
  },
  dateDisplay: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  notesInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    minHeight: 100,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
    lineHeight: 20,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 16,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  reportCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  reportHeaderInfo: {
    marginLeft: 12,
    flex: 1,
  },
  reportTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  reportDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  therapistInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  therapistLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  moodGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  moodCard: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  moodCardLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  moodCardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  trendImproving: {
    color: colors.success,
  },
  trendDeclining: {
    color: colors.warning,
  },
  topEmotions: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  emotionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  emotionName: {
    fontSize: 14,
    color: colors.text,
    textTransform: 'capitalize',
  },
  emotionCount: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  activityGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  activityItem: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  activityValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  activityLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  highlightCard: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  highlightText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  notesText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
  },
  actions: {
    marginTop: 8,
  },
  actionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  exportButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 6,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});