import { ReflectionPrompt, PromptResponse, PromptPreferences } from '../context/types';
import { PROMPTS_LIBRARY } from '../data/prompts';

interface PromptSelectionContext {
  daysSinceLoss: number;
  griefStage: 'early' | 'acute' | 'adaptation' | 'integration' | 'meaning';
  dominantEmotion: string;
  moodTrend: 'improving' | 'stable' | 'declining';
  recentPromptResponses: PromptResponse[];
  promptPreferences: PromptPreferences;
  isAnniversaryNear: boolean;
  daysUntilAnniversary?: number;
  currentSeason: 'spring' | 'summer' | 'fall' | 'winter';
  currentHoliday?: string;
}

export function calculateGriefStage(daysSinceLoss: number): 'early' | 'acute' | 'adaptation' | 'integration' | 'meaning' {
  if (daysSinceLoss < 90) return 'early';      // 0-3 months
  if (daysSinceLoss < 180) return 'acute';     // 3-6 months
  if (daysSinceLoss < 365) return 'adaptation'; // 6-12 months
  if (daysSinceLoss < 730) return 'integration'; // 1-2 years
  return 'meaning';                            // 2+ years
}

function getDominantEmotionFromMood(mood: string): string {
  const emotionMap: Record<string, string> = {
    'Stormy': 'sadness',
    'Rainy': 'sadness',
    'Cloudy': 'numbness',
    'Partly': 'hope',
    'Sunny': 'gratitude',
  };
  return emotionMap[mood] || 'sadness';
}

function calculateMoodTrend(moodEntries: any[]): 'improving' | 'stable' | 'declining' {
  if (moodEntries.length < 3) return 'stable';
  
  const moodValues: Record<string, number> = {
    'Stormy': 1,
    'Rainy': 2,
    'Cloudy': 3,
    'Partly': 4,
    'Sunny': 5,
  };
  
  const recent = moodEntries.slice(-7);
  const older = moodEntries.slice(-14, -7);
  
  const recentAvg = recent.reduce((sum, entry) => sum + (moodValues[entry.mood] ?? 3), 0) / recent.length;
  const olderAvg = older.length > 0 
    ? older.reduce((sum, entry) => sum + (moodValues[entry.mood] ?? 3), 0) / older.length 
    : recentAvg;
  
  if (recentAvg > olderAvg + 0.5) return 'improving';
  if (recentAvg < olderAvg - 0.5) return 'declining';
  return 'stable';
}

function getDaysSincePromptUsed(promptId: string, promptResponses: PromptResponse[]): number {
  const response = promptResponses.find(r => r.promptId === promptId);
  if (!response) return Infinity;
  
  const responseDate = new Date(response.respondedAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - responseDate.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

function shouldGentlyReintroduce(context: PromptSelectionContext): boolean {
  const recentlySkipped = context.recentPromptResponses
    .filter(r => r.skipped && r.respondedAt)
    .slice(-10);
  
  const mostRecentSkip = recentlySkipped[recentlySkipped.length - 1];
  if (!mostRecentSkip) return false;
  
  const daysSinceSkip = getDaysSincePromptUsed(mostRecentSkip.promptId, [mostRecentSkip]);
  return daysSinceSkip > 21; // Reintroduce after 3 weeks
}

export function selectDailyPrompt(context: PromptSelectionContext): ReflectionPrompt {
  // 1. Check for special occasions first
  if (context.isAnniversaryNear && context.daysUntilAnniversary !== undefined && context.daysUntilAnniversary <= 7) {
    return selectAnniversaryPrompt(context);
  }
  
  // 2. Check for declining mood - offer supportive prompts
  if (context.moodTrend === 'declining') {
    return selectSupportivePrompt(context);
  }
  
  // 3. Check for gently reintroducing avoided themes
  if (shouldGentlyReintroduce(context)) {
    return selectGentleReintroduction(context);
  }
  
  // 4. Balance between preferred and new themes
  return selectBalancedPrompt(context);
}

function selectAnniversaryPrompt(context: PromptSelectionContext): ReflectionPrompt {
  const anniversaryPrompts = PROMPTS_LIBRARY.filter(p => 
    p.themes.includes('anniversary') && 
    p.griefStages.includes(context.griefStage)
  );
  
  if (anniversaryPrompts.length === 0) {
    return selectBalancedPrompt(context);
  }
  
  // Score anniversary prompts
  const scored = anniversaryPrompts.map(prompt => ({
    prompt,
    score: scorePrompt(prompt, context),
  }));
  
  scored.sort((a, b) => b.score - a.score);
  return scored[0].prompt;
}

function selectSupportivePrompt(context: PromptSelectionContext): ReflectionPrompt {
  // Prefer gentle prompts that match current emotion
  const supportivePrompts = PROMPTS_LIBRARY.filter(p => 
    p.difficulty === 'gentle' &&
    (p.emotionalStates.includes(context.dominantEmotion as any) || 
     p.emotionalStates.includes('gratitude') ||
     p.emotionalStates.includes('hope')) &&
    p.griefStages.includes(context.griefStage)
  );
  
  if (supportivePrompts.length === 0) {
    return selectBalancedPrompt(context);
  }
  
  const scored = supportivePrompts.map(prompt => ({
    prompt,
    score: scorePrompt(prompt, context),
  }));
  
  scored.sort((a, b) => b.score - a.score);
  return scored[0].prompt;
}

function selectGentleReintroduction(context: PromptSelectionContext): ReflectionPrompt {
  // Find recently avoided themes and select gentle prompts for them
  const recentlyAvoided = context.promptPreferences.avoidedThemes;
  
  for (const theme of recentlyAvoided) {
    const gentleThemePrompts = PROMPTS_LIBRARY.filter(p => 
      p.themes.includes(theme as any) &&
      p.difficulty === 'gentle' &&
      p.griefStages.includes(context.griefStage)
    );
    
    if (gentleThemePrompts.length > 0) {
      const scored = gentleThemePrompts.map(prompt => ({
        prompt,
        score: scorePrompt(prompt, context),
      }));
      
      scored.sort((a, b) => b.score - a.score);
      return scored[0].prompt;
    }
  }
  
  return selectBalancedPrompt(context);
}

function selectBalancedPrompt(context: PromptSelectionContext): ReflectionPrompt {
  const scored = PROMPTS_LIBRARY.map(prompt => ({
    prompt,
    score: scorePrompt(prompt, context),
  }));
  
  scored.sort((a, b) => b.score - a.score);
  
  // Return top prompt that's not too recent
  for (const scoredPrompt of scored) {
    const daysSinceUsed = getDaysSincePromptUsed(scoredPrompt.prompt.id, context.recentPromptResponses);
    if (daysSinceUsed >= 30) {
      return scoredPrompt.prompt;
    }
  }
  
  // Fallback to top scored prompt
  return scored[0].prompt;
}

function scorePrompt(prompt: ReflectionPrompt, context: PromptSelectionContext): number {
  let score = 0;
  
  // Match grief stage (high weight)
  if (prompt.griefStages.includes(context.griefStage)) {
    score += 30;
  }
  
  // Match emotional state (high weight)
  if (prompt.emotionalStates.includes(context.dominantEmotion as any)) {
    score += 25;
  }
  
  // Avoid recently used prompts
  const daysSinceUsed = getDaysSincePromptUsed(prompt.id, context.recentPromptResponses);
  if (daysSinceUsed < 30) {
    score -= 50;
  } else if (daysSinceUsed < 90) {
    score -= 20;
  }
  
  // Boost preferred themes
  const themeOverlap = prompt.themes.filter(t => context.promptPreferences.preferredThemes.includes(t as any));
  score += themeOverlap.length * 10;
  
  // Avoid user's avoided themes (unless gentle reintroduction)
  const avoidedOverlap = prompt.themes.filter(t => context.promptPreferences.avoidedThemes.includes(t as any));
  score -= avoidedOverlap.length * 30;
  
  // Difficulty appropriate to current state
  if (context.moodTrend === 'declining' && prompt.difficulty === 'deep') {
    score -= 20;
  }
  if (context.moodTrend === 'improving' && prompt.difficulty === 'gentle') {
    score -= 10; // Slight penalty for too easy when doing well
  }
  
  // Seasonal relevance
  if (prompt.timing?.season === context.currentSeason) {
    score += 5;
  }
  
  // Anniversary proximity
  if (context.isAnniversaryNear && prompt.themes.includes('anniversary')) {
    score += 25;
  }
  
  // Add some randomness for variety
  score += Math.random() * 5;
  
  return score;
}

export function getAlternativePrompts(currentPromptId: string, context: PromptSelectionContext, count: number = 3): ReflectionPrompt[] {
  const alternatives = PROMPTS_LIBRARY
    .filter(p => p.id !== currentPromptId)
    .filter(p => p.griefStages.includes(context.griefStage))
    .map(prompt => ({
      prompt,
      score: scorePrompt(prompt, context),
    }));
  
  alternatives.sort((a, b) => b.score - a.score);
  
  return alternatives.slice(0, count).map(a => a.prompt);
}

export function updatePromptPreferences(
  currentPreferences: PromptPreferences,
  promptId: string,
  prompt: ReflectionPrompt,
  response: string,
  isFavorite: boolean,
  skipped: boolean
): Partial<PromptPreferences> {
  const updates: Partial<PromptPreferences> = {};
  
  // Update favorites
  if (isFavorite && !currentPreferences.favoritePromptIds.includes(promptId)) {
    updates.favoritePromptIds = [...currentPreferences.favoritePromptIds, promptId];
  } else if (!isFavorite && currentPreferences.favoritePromptIds.includes(promptId)) {
    updates.favoritePromptIds = currentPreferences.favoritePromptIds.filter(id => id !== promptId);
  }
  
  // Update preferred themes based on positive engagement
  if (isFavorite || (response && response.length > 50)) {
    const currentPreferred = [...currentPreferences.preferredThemes];
    prompt.themes.forEach(theme => {
      if (!currentPreferred.includes(theme as any)) {
        currentPreferred.push(theme as any);
      }
    });
    updates.preferredThemes = currentPreferred;
  }
  
  // Update avoided themes based on skipping
  if (skipped) {
    const currentAvoided = [...currentPreferences.avoidedThemes];
    prompt.themes.forEach(theme => {
      if (!currentAvoided.includes(theme as any)) {
        currentAvoided.push(theme as any);
      }
    });
    updates.avoidedThemes = currentAvoided;
  }
  
  return updates;
}