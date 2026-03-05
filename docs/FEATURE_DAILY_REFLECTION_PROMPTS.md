# Daily Reflection Prompts - Design Document

## Overview
The Daily Reflection Prompts feature provides context-aware, personalized prompts that encourage users to engage in meaningful self-reflection as part of their grief journey. The system adapts to the user's emotional state, time since loss, and personal preferences.

## Objectives

1. **Encourage Regular Reflection Practice**
   - Daily prompts that become a healthy habit
   - Lower barrier to journaling with specific questions
   - Consistent touchpoints with the app

2. **Context-Aware Personalization**
   - Prompts adapt to grief stage and emotional state
   - Relevant to current life circumstances
   - Sensitivity to anniversaries and special dates

3. **Emotional Processing Support**
   - Guide users through different aspects of grief
   - Encourage expression of difficult emotions
   - Celebrate progress and meaningful memories

---

## User Stories

### As a User
- I want to receive a thoughtful prompt each day to help me reflect
- I want prompts that feel relevant to where I am in my grief journey
- I want to save prompts that resonated with me
- I want to easily turn my reflection into a journal entry
- I want prompts to be gentle, not overwhelming
- I want to see how my reflections have evolved over time

---

## Core Features

### 1. Prompt Library Structure

#### Categorization System

**By Grief Stage:**
```typescript
type GriefStage = 
  | 'early'        // 0-3 months
  | 'acute'        // 3-6 months
  | 'adaptation'   // 6-12 months
  | 'integration'  // 12+ months
  | 'meaning';     // Finding new meaning
```

**By Emotional State:**
```typescript
type EmotionalState = 
  | 'sadness'
  | 'anger'
  | 'anxiety'
  | 'numbness'
  | 'guilt'
  | 'gratitude'
  | 'acceptance'
  | 'longing'
  | 'hope'
  | 'confusion';
```

**By Theme/Focus:**
```typescript
type PromptTheme = 
  | 'memories'         // Remembering the person
  | 'emotions'         // Processing feelings
  | 'relationships'    // How grief affects relationships
  | 'self_care'        // Taking care of oneself
  | 'future'           // Looking forward
  | 'identity'         // Who am I now?
  | 'legacy'           // What remains
  | 'rituals'          // Creating meaning
  | 'body'             // Physical aspects of grief
  | 'anniversary'      // Special dates
  | 'triggers'         // Unexpected moments
  | 'growth'           // Personal growth
  | 'support'          // Asking for and receiving help
  | 'boundaries';      // Setting limits
```

**By Difficulty Level:**
```typescript
type DifficultyLevel = 
  | 'gentle'      // Easy, comforting prompts
  | 'moderate'    // Requires more reflection
  | 'deep';       // Challenging, profound topics
```

#### Prompt Data Structure

```typescript
interface ReflectionPrompt {
  id: string;
  text: string;
  followUp?: string;            // Optional follow-up question
  griefStages: GriefStage[];
  emotionalStates: EmotionalState[];
  themes: PromptTheme[];
  difficulty: DifficultyLevel;
  timing?: {                    // Seasonal/timing context
    season?: 'spring' | 'summer' | 'fall' | 'winter';
    holiday?: string;
    timeOfDay?: 'morning' | 'afternoon' | 'evening';
  };
  relatedPrompts?: string[];    // IDs of related prompts
  tags: string[];
  source?: string;              // Attribution if from a book/quote
  isPremium?: boolean;
}
```

### 2. Prompt Selection Algorithm

#### Context-Aware Selection

The prompt selection algorithm considers multiple factors:

```typescript
interface PromptSelectionContext {
  // User Profile Data
  daysSinceLoss: number;
  griefStage: GriefStage;
  relationship: string;           // Type of relationship lost
  anniversaryDates: AnniversaryDate[];
  
  // Recent Emotional State
  recentMoods: MoodEntry[];       // Last 7 days
  dominantEmotion: EmotionalState;
  moodTrend: 'improving' | 'stable' | 'declining';
  
  // Engagement Patterns
  recentJournalEntries: JournalEntry[];
  promptHistory: PromptResponse[];
  preferredThemes: PromptTheme[];
  avoidedThemes: PromptTheme[];
  
  // Special Context
  isAnniversaryNear: boolean;
  daysUntilAnniversary?: number;
  recentTriggers?: string[];
  currentSeason: 'spring' | 'summer' | 'fall' | 'winter';
  currentHoliday?: string;
}
```

#### Selection Logic

```typescript
function selectDailyPrompt(context: PromptSelectionContext): ReflectionPrompt {
  // 1. Check for special occasions first
  if (context.isAnniversaryNear && context.daysUntilAnniversary! <= 7) {
    return selectAnniversaryPrompt(context);
  }
  
  // 2. Check for declining mood - offer supportive prompts
  if (context.moodTrend === 'declining') {
    return selectSupportivePrompt(context);
  }
  
  // 3. Check for avoided themes - gently reintroduce
  if (shouldGentlyReintroduce(context)) {
    return selectGentleReintroduction(context);
  }
  
  // 4. Balance between preferred and new themes
  return selectBalancedPrompt(context);
}
```

#### Weighted Scoring

Each candidate prompt receives a score based on multiple factors:

```typescript
function scorePrompt(prompt: ReflectionPrompt, context: PromptSelectionContext): number {
  let score = 0;
  
  // Match grief stage (high weight)
  if (prompt.griefStages.includes(context.griefStage)) {
    score += 30;
  }
  
  // Match emotional state (high weight)
  if (prompt.emotionalStates.includes(context.dominantEmotion)) {
    score += 25;
  }
  
  // Avoid recently used prompts
  const daysSinceUsed = getDaysSincePromptUsed(prompt.id, context.promptHistory);
  if (daysSinceUsed < 30) {
    score -= 50;
  } else if (daysSinceUsed < 90) {
    score -= 20;
  }
  
  // Boost preferred themes
  const themeOverlap = prompt.themes.filter(t => context.preferredThemes.includes(t));
  score += themeOverlap.length * 10;
  
  // Avoid user's avoided themes
  const avoidedOverlap = prompt.themes.filter(t => context.avoidedThemes.includes(t));
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
  
  return score;
}
```

---

### 3. User Interface Components

#### Daily Prompt Notification

**Morning Notification (User Customizable):**
```
🌅 Good morning, [Name]

Today's reflection prompt is ready for you.

"Take a moment to think about a quality your loved one had that 
you admired. How might you embody that quality in your own life today?"

[Open App]
```

#### Daily Prompt Screen

**Location:** Home tab → Today's Prompt card OR dedicated prompt screen

```tsx
interface DailyPromptScreenProps {
  prompt: ReflectionPrompt;
  userResponse?: PromptResponse;
  onSubmit: (response: string) => void;
  onSaveForLater: () => void;
  onSkip: () => void;
  onGetNewPrompt: () => void;
}
```

**UI Layout:**
```
┌─────────────────────────────────────┐
│  ← Today's Reflection               │
│                                     │
│  ┌─────────────────────────────────┐│
│  │  🌅                              ││
│  │                                 ││
│  │  "Take a moment to think about  ││
│  │   a quality your loved one had  ││
│  │   that you admired. How might   ││
│  │   you embody that quality in    ││
│  │   your own life today?"         ││
│  │                                 ││
│  │  — Reflection on Legacy         ││
│  │                                 ││
│  └─────────────────────────────────┘│
│                                     │
│  My reflection:                     │
│  ┌─────────────────────────────────┐│
│  │                                 ││
│  │  [Text input area]              ││
│  │                                 ││
│  │                                 ││
│  └─────────────────────────────────┘│
│                                     │
│  [Save as Journal Entry]            │
│                                     │
│  ○ Save for later  ○ Skip today     │
│  ○ Get different prompt             │
│                                     │
│  ─────────────────────────────────  │
│  This prompt resonated with me ❤️   │
│                                     │
└─────────────────────────────────────┘
```

#### Prompt Actions

**1. Save Reflection:**
- Stores the user's response
- Timestamps and links to prompt
- Option to expand into full journal entry

**2. Save for Later:**
- Keeps prompt visible in "Pending" section
- User can return to it later in the day
- Reminder notification if not completed by evening

**3. Skip:**
- Marks prompt as seen but not completed
- Optionally asks why (too hard, not relevant, etc.)
- Improves future recommendations

**4. Get Different Prompt:**
- Offers 2-3 alternative prompts
- User can choose based on mood or theme
- Logged for preference learning

**5. Mark as Favorite:**
- Saves prompt to "Favorites" collection
- Can revisit anytime
- Indicates strong preference for similar prompts

---

### 4. Prompt Library Examples

#### Memories Theme

**Gentle:**
> "What is one small, ordinary moment you shared with your loved one that brings you comfort?"

**Moderate:**
> "If you could have one more conversation with your loved one, what would you want to make sure they knew?"

**Deep:**
> "How has your memory of your loved one changed over time? What details have become clearer, and what has softened?"

#### Emotions Theme

**Gentle:**
> "Where do you feel grief in your body today? Can you describe the sensation?"

**Moderate:**
> "If your grief could speak, what would it say right now? What does it need?"

**Deep:**
> "What emotion have you been avoiding? What would happen if you let yourself feel it fully for a few minutes?"

#### Self-Care Theme

**Gentle:**
> "What is one small act of kindness you can do for yourself today?"

**Moderate:**
> "How has your relationship with rest changed since your loss? What does your body need right now?"

**Deep:**
> "Where are you holding yourself to standards that no longer serve you? What would it look like to release that expectation?"

#### Future Theme

**Gentle:**
> "What is one small thing you're looking forward to, even if it's just tomorrow's coffee?"

**Moderate:**
> "How has your perspective on the future changed? What feels different now?"

**Deep:**
> "What parts of yourself have you discovered since your loss? How might these shape your future?"

#### Anniversary Theme

**Gentle:**
> "On this day, what memory would you like to honor?"

**Moderate:**
> "As this anniversary approaches, what do you need to feel supported?"

**Deep:**
> "Looking back on the past year, how have you changed? What have you learned about yourself?"

---

### 5. Prompt History & Analytics

#### User Prompt History

```tsx
interface PromptHistoryScreen {
  // Filter options
  dateRange: DateRange;
  theme?: PromptTheme;
  responded: 'all' | 'responded' | 'skipped';
  favorites: boolean;
  
  // List display
  prompts: PromptHistoryEntry[];
  
  // Stats
  totalPromptsReceived: number;
  responseRate: number;
  favoriteThemes: PromptTheme[];
  streakDays: number;
}

interface PromptHistoryEntry {
  prompt: ReflectionPrompt;
  date: Date;
  responded: boolean;
  response?: string;
  linkedJournalEntry?: string;
  isFavorite: boolean;
}
```

**History UI:**
```
┌─────────────────────────────────────┐
│  Prompt History                     │
│                                     │
│  This Month: 23 prompts | 19 responded │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  Mar 5, 2025                        │
│  "What is one small thing you're    │
│   grateful for today?"              │
│  ❤️ Your response: "I'm grateful   │
│      for the sunshine this          │
│      morning..."                    │
│                                     │
│  Mar 4, 2025                        │
│  "Where do you feel grief in your   │
│   body today?"                      │
│  [Skipped - too difficult]          │
│                                     │
│  Mar 3, 2025                        │
│  "What is a quality you admired     │
│   in your loved one?"               │
│  ❤️ Saved to favorites             │
│                                     │
└─────────────────────────────────────┘
```

#### Reflection Insights

**Analytics Dashboard:**
```
┌─────────────────────────────────────┐
│  Your Reflection Journey            │
│                                     │
│  📅 45-day streak!                  │
│  📝 127 reflections completed       │
│                                     │
│  Themes you engage with most:       │
│  ████████████ Memories (32%)        │
│  ██████████ Self-care (28%)         │
│  ████████ Emotions (22%)            │
│                                     │
│  Your response rate: 87%            │
│  ↑ 12% from last month              │
│                                     │
│  Favorite prompts: 14 saved         │
│                                     │
│  Journal entries from prompts: 23   │
│                                     │
└─────────────────────────────────────┘
```

---

### 6. Notification System

#### Daily Prompt Notification

**Customization Options:**
```tsx
interface PromptNotificationSettings {
  enabled: boolean;
  time: string;              // "08:00" format
  timezone: string;
  
  // Frequency options
  frequency: 'daily' | 'weekdays' | 'custom';
  customDays?: number[];     // 0-6 for Sun-Sat
  
  // Notification style
  showPromptPreview: boolean;
  includeFullPrompt: boolean;
  
  // Reminder settings
  eveningReminder: boolean;
  eveningReminderTime: string;
  
  // Skip settings
  skipWeekends: boolean;
  skipHolidays: boolean;
}
```

**Notification Types:**

1. **Morning Prompt:**
   ```
   🌅 Your daily reflection is here
   "What small comfort can you give yourself today?"
   [Open]
   ```

2. **Evening Reminder (if not completed):**
   ```
   🌙 Still thinking about you
   Your reflection prompt is waiting whenever you're ready.
   [Open] [Snooze]
   ```

3. **Streak Celebration:**
   ```
   🎉 30 days of reflection!
   You've taken time for yourself every day this month.
   [View Journey]
   ```

4. **Anniversary Alert:**
   ```
   💜 A special prompt for you
   Your anniversary is coming up. Here's a gentle reflection.
   [Open]
   ```

---

### 7. Data Architecture

#### Database Schema

```typescript
interface PromptResponse {
  id: string;
  userId: string;
  promptId: string;
  response: string;
  respondedAt: Date;
  isFavorite: boolean;
  linkedJournalEntryId?: string;
  moodAtTime?: MoodEntry;
  skippedReason?: string;
}

interface UserPromptPreferences {
  userId: string;
  preferredThemes: PromptTheme[];
  avoidedThemes: PromptTheme[];
  preferredDifficulty: DifficultyLevel;
  preferredTime: string;
  notificationSettings: PromptNotificationSettings;
  favoritePromptIds: string[];
  skippedPromptIds: string[];
  streakData: {
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: Date;
  };
}

interface PromptUsageAnalytics {
  promptId: string;
  timesShown: number;
  timesResponded: number;
  timesSkipped: number;
  averageResponseLength: number;
  favoriteRate: number;
  skipReasons: Record<string, number>;
}
```

---

### 8. Prompt Sources & Curation

#### Internal Prompt Library

**Initial Library Size:** 500+ prompts
**Categories Covered:** All 14 themes
**Grief Stages Covered:** All 5 stages
**Difficulty Levels:** Balanced distribution

#### External Sources

1. **Curated Books:**
   - "Healing After Loss" by Martha Whitmore Hickman
   - "The Mourning Handbook" by Helen Fitzgerald
   - "Transcending Loss" by Ashley Davis Bush

2. **Professional Contributions:**
   - Grief counselors and therapists
   - Hospice workers
   - User submissions (moderated)

3. **Cultural Sensitivity:**
   - Multi-cultural grief perspectives
   - Religious and spiritual options
   - Non-religious alternatives

#### Prompt Rotation

- **Seasonal Prompts:** Added 4x per year
- **Holiday Prompts:** Temporary additions
- **User Favorites:** Permanent additions based on engagement
- **Low-Performers:** Removed or revised

---

### 9. Implementation Phases

### Phase 1: Foundation (MVP)
- [ ] Core prompt library (200 prompts)
- [ ] Basic daily prompt notification
- [ ] Simple response storage
- [ ] Link to journal entries
- [ ] Basic prompt history

### Phase 2: Personalization
- [ ] Context-aware prompt selection
- [ ] Grief stage adaptation
- [ ] Theme preference learning
- [ ] Skip reason tracking
- [ ] Favorite prompts

### Phase 3: Advanced Features
- [ ] Evening reminders
- [ ] Streak tracking and celebrations
- [ ] Reflection insights dashboard
- [ ] Custom notification scheduling
- [ ] Anniversary-aware prompts

### Phase 4: Enhanced Library
- [ ] Expanded prompt library (500+)
- [ ] User-submitted prompts
- [ ] Cultural and spiritual variations
- [ ] Therapist-curated collections
- [ ] Seasonal and holiday prompts

---

### 10. Success Metrics

#### Engagement Metrics
- Daily active prompt responders
- Response rate (% of prompts answered)
- Average response length
- Time spent on reflection

#### Quality Metrics
- Prompt favorite rate
- Journal entry conversion rate
- User satisfaction (in-app feedback)
- Skip rate and reasons

#### Retention Metrics
- Streak length distribution
- Return rate after missed day
- Long-term engagement (90+ days)
- Feature usage correlation with retention

---

### 11. Risks & Mitigation

#### Risk 1: Prompts Feel Repetitive
**Mitigation:**
- Large initial library
- Smart rotation algorithm
- User feedback integration
- Regular library updates

#### Risk 2: Prompts Too Difficult
**Mitigation:**
- Difficulty calibration
- Easy skip functionality
- Alternative prompt options
- Adaptive difficulty based on mood

#### Risk 3: Notification Fatigue
**Mitigation:**
- User-controlled timing
- Easy opt-out
- Evening snooze options
- Smart notification timing

#### Risk 4: User Privacy Concerns
**Mitigation:**
- Local storage option
- Clear data policies
- Optional cloud backup
- Therapist sharing controls

---

### Future Enhancements

1. **Voice Reflections:** Record audio responses to prompts
2. **Guided Meditations:** Audio companion for certain prompts
3. **Community Shares:** Share favorite prompts (anonymously)
4. **Therapist Integration:** Therapist-assigned specific prompts
5. **Progress Themes:** Multi-day reflection series
6. **AI-Generated Prompts:** Personalized prompts based on patterns
7. **Group Reflections:** Family or group prompt sharing
8. **Prompt Challenges:** Weekly or monthly themed challenges