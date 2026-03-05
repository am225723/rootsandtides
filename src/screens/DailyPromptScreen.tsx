import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ScreenContainer from '../components/ScreenContainer';
import GlassCard from '../components/GlassCard';
import { colors, radius, typography } from '../theme';
import { useApp } from '../context/AppContext';
import { ReflectionPrompt } from '../context/types';
import { getAlternativePrompts } from '../utils/promptSelection';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DailyPrompt'>;
};

export default function DailyPromptScreen({ navigation }: Props) {
  const { todayPrompt, promptPreferences, savePromptResponse, updatePromptPreferences } = useApp();
  const [response, setResponse] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [alternatives, setAlternatives] = useState<ReflectionPrompt[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<ReflectionPrompt | null>(todayPrompt || null);

  useEffect(() => {
    if (todayPrompt) {
      setCurrentPrompt(todayPrompt);
    }
  }, [todayPrompt]);

  const handleSubmit = async () => {
    if (!currentPrompt || !response.trim()) {
      Alert.alert('Please write your reflection before saving.');
      return;
    }

    try {
      await savePromptResponse(currentPrompt.id, response, isFavorite, false);
      
      // Update preferences based on engagement
      const prefUpdates = {
        favoritePromptIds: isFavorite 
          ? [...(promptPreferences?.favoritePromptIds || []), currentPrompt.id]
          : (promptPreferences?.favoritePromptIds || []),
      };
      await updatePromptPreferences(prefUpdates);

      Alert.alert(
        'Reflection Saved',
        'Your reflection has been saved. Would you like to save it as a journal entry?',
        [
          { text: 'Done', onPress: () => navigation.goBack() },
          { 
            text: 'Save to Journal', 
            onPress: () => navigation.navigate('Journal' as never)
          },
        ]
      );
    } catch (error) {
      console.error('Error saving prompt response:', error);
      Alert.alert('Error', 'Could not save your reflection. Please try again.');
    }
  };

  const handleSkip = async (reason?: string) => {
    if (!currentPrompt) return;

    try {
      await savePromptResponse(currentPrompt.id, '', false, true, reason);
      navigation.goBack();
    } catch (error) {
      console.error('Error skipping prompt:', error);
    }
  };

  const handleGetAlternatives = () => {
    if (!currentPrompt) return;
    
    const context = {
      daysSinceLoss: 180,
      griefStage: 'adaptation' as const,
      dominantEmotion: 'sadness',
      moodTrend: 'stable' as const,
      recentPromptResponses: [],
      promptPreferences: promptPreferences || { preferredThemes: [], avoidedThemes: [], favoritePromptIds: [], streakData: { currentStreak: 0, longestStreak: 0, lastActiveDate: '' } },
      isAnniversaryNear: false,
      currentSeason: 'winter' as const,
    };

    const alts = getAlternativePrompts(currentPrompt.id, context, 3);
    setAlternatives(alts);
    setShowAlternatives(true);
  };

  const selectAlternative = (prompt: ReflectionPrompt) => {
    setCurrentPrompt(prompt);
    setShowAlternatives(false);
    setResponse('');
    setIsFavorite(false);
  };

  if (!currentPrompt) {
    return (
      <ScreenContainer>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Today's Prompt</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🌅</Text>
          <Text style={styles.emptyText}>No prompt available right now.</Text>
          <Text style={styles.emptySubtext}>Check back tomorrow for a new reflection prompt.</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Today's Reflection</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <GlassCard variant="elevated" style={styles.promptCard}>
            <View style={styles.promptHeader}>
              <Text style={styles.promptIcon}>🌅</Text>
              <Text style={styles.promptLabel}>Daily Reflection</Text>
            </View>
            <Text style={styles.promptText}>{currentPrompt.text}</Text>
            {currentPrompt.followUp && (
              <Text style={styles.followUpText}>{currentPrompt.followUp}</Text>
            )}
            <View style={styles.promptMeta}>
              <Text style={styles.themeTag}>{currentPrompt.themes[0].replace('_', ' ')}</Text>
              <Text style={styles.difficultyTag}>{currentPrompt.difficulty}</Text>
            </View>
          </GlassCard>

          <View style={styles.responseSection}>
            <Text style={styles.responseLabel}>My reflection:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Write your thoughts here..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={6}
              value={response}
              onChangeText={setResponse}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.favoriteRow}>
            <TouchableOpacity
              style={[styles.favoriteBtn, isFavorite && styles.favoriteActive]}
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Text style={[styles.favoriteIcon, isFavorite && styles.favoriteIconActive]}>
                {isFavorite ? '❤️' : '🤍'}
              </Text>
              <Text style={styles.favoriteText}>This prompt resonated with me</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleSubmit}>
              <Text style={styles.primaryBtnText}>Save Reflection</Text>
            </TouchableOpacity>

            <View style={styles.secondaryActions}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => handleSkip()}>
                <Text style={styles.secondaryBtnText}>Skip today</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn} onPress={handleGetAlternatives}>
                <Text style={styles.secondaryBtnText}>Different prompt</Text>
              </TouchableOpacity>
            </View>
          </View>

          {showAlternatives && alternatives.length > 0 && (
            <View style={styles.alternativesSection}>
              <Text style={styles.alternativesTitle}>Alternative Prompts</Text>
              {alternatives.map((alt) => (
                <TouchableOpacity
                  key={alt.id}
                  style={styles.alternativeItem}
                  onPress={() => selectAlternative(alt)}
                >
                  <Text style={styles.alternativeText}>{alt.text}</Text>
                  <Text style={styles.alternativeTheme}>{alt.themes[0]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
  container: {
    flex: 1,
  },
  promptCard: {
    marginBottom: 24,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  promptIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  promptLabel: {
    ...typography.label,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  promptText: {
    ...typography.body,
    fontSize: 20,
    lineHeight: 28,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  followUpText: {
    ...typography.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  promptMeta: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  themeTag: {
    ...typography.tag,
    backgroundColor: 'rgba(74, 144, 217, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
    textTransform: 'capitalize',
  },
  difficultyTag: {
    ...typography.tag,
    backgroundColor: 'rgba(236, 201, 75, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
    textTransform: 'capitalize',
  },
  responseSection: {
    marginBottom: 20,
  },
  responseLabel: {
    ...typography.subtitle,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.lg,
    padding: 16,
    minHeight: 180,
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 24,
  },
  favoriteRow: {
    marginBottom: 24,
  },
  favoriteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  favoriteActive: {
    backgroundColor: 'rgba(237, 137, 54, 0.15)',
  },
  favoriteIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  favoriteIconActive: {
    color: colors.coral,
  },
  favoriteText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  actions: {
    marginBottom: 24,
  },
  primaryBtn: {
    backgroundColor: colors.coral,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryBtnText: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  secondaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  secondaryBtnText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  alternativesSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  alternativesTitle: {
    ...typography.subtitle,
    marginBottom: 16,
    textAlign: 'center',
  },
  alternativeItem: {
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 12,
  },
  alternativeText: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  alternativeTheme: {
    ...typography.tag,
    textTransform: 'capitalize',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    ...typography.subtitle,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});