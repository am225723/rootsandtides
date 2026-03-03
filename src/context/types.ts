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
}

export type AppContextType = AppState & AppActions;