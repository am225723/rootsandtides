export interface UserProfile {
  name: string;
  relationship: string;
  initialMood: string;
  joinDate: string;
  anniversaryDates: AnniversaryDate[];
}

export interface AnniversaryDate {
  id: string;
  label: string;
  date: string;
}

export interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  moodIcon: string;
  griefIntensity: number;
  innerCurrent: string;
  emotionalCapacity: number;
  notes?: string;
}

export interface VaultCollection {
  id: string;
  title: string;
  icon: string;
  createdAt: string;
}

export interface VaultEntry {
  id: string;
  collectionId: string;
  title: string;
  content: string;
  type: 'text' | 'letter' | 'legacy' | 'reflection' | 'responsibility' | 'ritual';
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  prompt: string;
  content: string;
  createdAt: string;
}

export interface ModuleProgress {
  moduleId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  currentStep: number;
  completedAt?: string;
}

export interface Settings {
  notificationsEnabled: boolean;
  anniversaryModeActive: boolean;
  pauseNotifications: boolean;
  theme: 'forest' | 'ocean';
  promptNotificationTime: string;
  promptRemindersEnabled: boolean;
}

// Therapist Connection Types
export interface TherapistConnection {
  id: string;
  therapistName: string;
  therapistEmail: string;
  organization?: string;
  accessLevel: 'full' | 'limited';
  dataCategories: DataCategory[];
  status: 'pending' | 'active' | 'revoked' | 'suspended';
  createdAt: string;
  acceptedAt?: string;
  revokedAt?: string;
  lastAccessDate?: string;
  accessCode: string;
}

export type DataCategory = 
  | 'moodHistory'
  | 'journalEntries'
  | 'moduleProgress'
  | 'vaultCollections'
  | 'anniversaryDates'
  | 'reflectionPrompts';

export interface DataAccessLog {
  id: string;
  connectionId: string;
  accessedBy: 'therapist' | 'system';
  dataCategories: DataCategory[];
  accessType: 'view' | 'download' | 'export';
  timestamp: string;
}

export interface ProgressReport {
  id: string;
  userId: string;
  generatedAt: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  moodSummary: MoodSummary;
  activitySummary: ActivitySummary;
  journalHighlights: string[];
  notes?: string;
}

export interface MoodSummary {
  averageMood: string;
  moodTrend: 'improving' | 'stable' | 'declining';
  topEmotions: { emotion: string; count: number }[];
  checkInsCompleted: number;
}

export interface ActivitySummary {
  journalEntriesCount: number;
  modulesCompleted: number;
  exercisesCompleted: number;
  streakDays: number;
}

// Daily Reflection Prompt Types
export interface ReflectionPrompt {
  id: string;
  text: string;
  followUp?: string;
  griefStages: GriefStage[];
  emotionalStates: EmotionalState[];
  themes: PromptTheme[];
  difficulty: DifficultyLevel;
  timing?: {
    season?: 'spring' | 'summer' | 'fall' | 'winter';
    holiday?: string;
  };
  tags: string[];
  source?: string;
}

export type GriefStage = 'early' | 'acute' | 'adaptation' | 'integration' | 'meaning';

export type EmotionalState = 
  | 'sadness'
  | 'anger'
  | 'anxiety'
  | 'numbness'
  | 'guilt'
  | 'gratitude'
  | 'acceptance'
  | 'longing'
  | 'hope'
  | 'confusion'
  | 'frustration'
  | 'peace'
  | 'overwhelm';

export type PromptTheme = 
  | 'memories'
  | 'emotions'
  | 'relationships'
  | 'self_care'
  | 'future'
  | 'identity'
  | 'legacy'
  | 'rituals'
  | 'body'
  | 'anniversary'
  | 'triggers'
  | 'growth'
  | 'support'
  | 'boundaries'
  | 'reflection'
  | 'meaning'
  | 'change';

export type DifficultyLevel = 'gentle' | 'moderate' | 'deep';

export interface PromptResponse {
  id: string;
  promptId: string;
  response: string;
  respondedAt: string;
  isFavorite: boolean;
  linkedJournalEntryId?: string;
  skipped: boolean;
  skippedReason?: string;
}

export interface PromptPreferences {
  preferredThemes: PromptTheme[];
  avoidedThemes: PromptTheme[];
  preferredDifficulty: DifficultyLevel;
  favoritePromptIds: string[];
  streakData: {
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string;
  };
}

export interface AppState {
  isLoading: boolean;
  onboardingDone: boolean;
  userProfile: UserProfile;
  moodHistory: MoodEntry[];
  currentMood: MoodEntry | null;
  vaultCollections: VaultCollection[];
  vaultEntries: VaultEntry[];
  journalEntries: JournalEntry[];
  moduleProgress: ModuleProgress[];
  settings: Settings;
  candleCount: number;
  capacityLevel: number;
  // Therapist connection state
  therapistConnections: TherapistConnection[];
  dataAccessLogs: DataAccessLog[];
  progressReports: ProgressReport[];
  // Daily reflection prompts state
  promptResponses: PromptResponse[];
  promptPreferences: PromptPreferences;
  todayPrompt?: ReflectionPrompt;
}

export interface AppActions {
  completeOnboarding: (profile: Partial<UserProfile>) => Promise<void>;
  resetOnboarding: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  saveMoodEntry: (entry: Omit<MoodEntry, 'id' | 'date'>) => Promise<void>;
  createCollection: (title: string, icon: string) => Promise<VaultCollection>;
  deleteCollection: (id: string) => Promise<void>;
  addVaultEntry: (entry: Omit<VaultEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<VaultEntry>;
  updateVaultEntry: (id: string, updates: Partial<VaultEntry>) => Promise<void>;
  deleteVaultEntry: (id: string) => Promise<void>;
  saveJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;
  updateModuleProgress: (moduleId: string, updates: Partial<ModuleProgress>) => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  lightCandle: () => Promise<void>;
  setCapacityLevel: (level: number) => Promise<void>;
  // Therapist connection actions
  inviteTherapist: (therapist: Omit<TherapistConnection, 'id' | 'createdAt' | 'status' | 'accessCode'>) => Promise<TherapistConnection>;
  revokeTherapistAccess: (connectionId: string) => Promise<void>;
  updateTherapistAccess: (connectionId: string, updates: Partial<TherapistConnection>) => Promise<void>;
  generateProgressReport: (dateRangeStart: string, dateRangeEnd: string, notes?: string) => Promise<ProgressReport>;
  // Daily reflection prompts actions
  savePromptResponse: (promptId: string, response: string, isFavorite: boolean, skipped?: boolean, skippedReason?: string) => Promise<PromptResponse>;
  updatePromptPreferences: (updates: Partial<PromptPreferences>) => Promise<void>;
  getTodayPrompt: () => Promise<ReflectionPrompt>;
  skipPrompt: (promptId: string, reason?: string) => Promise<void>;
  getPromptHistory: (days?: number) => Promise<PromptResponse[]>;
}

export type AppContextType = AppState & AppActions;