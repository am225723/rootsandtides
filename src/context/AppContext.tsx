import React, {
  createContext, useContext, useEffect, useReducer, useCallback, ReactNode,
} from 'react';
import { storageGet, storageSet, storageRemove, STORAGE_KEYS } from '../services/storage';
import {
  AppState, AppContextType, UserProfile, MoodEntry, VaultCollection,
  VaultEntry, JournalEntry, ModuleProgress, Settings,
} from './types';

const DEFAULT_PROFILE: UserProfile = {
  name: '', relationship: '', initialMood: '',
  joinDate: new Date().toISOString(), anniversaryDates: [],
};
const DEFAULT_SETTINGS: Settings = {
  notificationsEnabled: true, anniversaryModeActive: false,
  pauseNotifications: false, theme: 'forest',
};
const INITIAL_STATE: AppState = {
  isLoading: true, onboardingDone: false, userProfile: DEFAULT_PROFILE,
  moodHistory: [], currentMood: null, vaultCollections: [], vaultEntries: [],
  journalEntries: [], moduleProgress: [], settings: DEFAULT_SETTINGS,
  candleCount: 4281, capacityLevel: 0.5,
};

type Action =
  | { type: 'HYDRATE'; payload: Partial<AppState> }
  | { type: 'SET_ONBOARDING_DONE'; payload: boolean }
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'ADD_MOOD'; payload: MoodEntry }
  | { type: 'SET_COLLECTIONS'; payload: VaultCollection[] }
  | { type: 'SET_ENTRIES'; payload: VaultEntry[] }
  | { type: 'SET_JOURNAL'; payload: JournalEntry[] }
  | { type: 'SET_MODULE_PROGRESS'; payload: ModuleProgress[] }
  | { type: 'SET_SETTINGS'; payload: Settings }
  | { type: 'SET_CANDLE_COUNT'; payload: number }
  | { type: 'SET_CAPACITY'; payload: number };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE': return { ...state, ...action.payload, isLoading: false };
    case 'SET_ONBOARDING_DONE': return { ...state, onboardingDone: action.payload };
    case 'SET_PROFILE': return { ...state, userProfile: action.payload };
    case 'ADD_MOOD': {
      const updated = [action.payload, ...state.moodHistory].slice(0, 90);
      return { ...state, moodHistory: updated, currentMood: action.payload };
    }
    case 'SET_COLLECTIONS': return { ...state, vaultCollections: action.payload };
    case 'SET_ENTRIES': return { ...state, vaultEntries: action.payload };
    case 'SET_JOURNAL': return { ...state, journalEntries: action.payload };
    case 'SET_MODULE_PROGRESS': return { ...state, moduleProgress: action.payload };
    case 'SET_SETTINGS': return { ...state, settings: action.payload };
    case 'SET_CANDLE_COUNT': return { ...state, candleCount: action.payload };
    case 'SET_CAPACITY': return { ...state, capacityLevel: action.payload };
    default: return state;
  }
}

const AppContext = createContext<AppContextType | null>(null);

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    (async () => {
      const [onboardingDone, userProfile, moodHistory, vaultCollections, vaultEntries,
        journalEntries, moduleProgress, settings, candleCount, capacityLevel] =
        await Promise.all([
          storageGet<boolean>(STORAGE_KEYS.ONBOARDING_DONE),
          storageGet<UserProfile>(STORAGE_KEYS.USER_PROFILE),
          storageGet<MoodEntry[]>(STORAGE_KEYS.MOOD_HISTORY),
          storageGet<VaultCollection[]>(STORAGE_KEYS.VAULT_COLLECTIONS),
          storageGet<VaultEntry[]>(STORAGE_KEYS.VAULT_ENTRIES),
          storageGet<JournalEntry[]>(STORAGE_KEYS.JOURNAL_ENTRIES),
          storageGet<ModuleProgress[]>(STORAGE_KEYS.JOURNEY_PROGRESS),
          storageGet<Settings>(STORAGE_KEYS.SETTINGS),
          storageGet<number>(STORAGE_KEYS.CANDLE_COUNT),
          storageGet<number>(STORAGE_KEYS.CAPACITY_LEVEL),
        ]);
      const history = moodHistory ?? [];
      dispatch({
        type: 'HYDRATE',
        payload: {
          onboardingDone: onboardingDone ?? false,
          userProfile: userProfile ?? DEFAULT_PROFILE,
          moodHistory: history,
          currentMood: history.length > 0 ? history[0] : null,
          vaultCollections: vaultCollections ?? [],
          vaultEntries: vaultEntries ?? [],
          journalEntries: journalEntries ?? [],
          moduleProgress: moduleProgress ?? [],
          settings: settings ?? DEFAULT_SETTINGS,
          candleCount: candleCount ?? 4281,
          capacityLevel: capacityLevel ?? 0.5,
        },
      });
    })();
  }, []);

  const completeOnboarding = useCallback(async (profile: Partial<UserProfile>) => {
    const updated: UserProfile = { ...DEFAULT_PROFILE, ...profile, joinDate: new Date().toISOString() };
    await Promise.all([storageSet(STORAGE_KEYS.ONBOARDING_DONE, true), storageSet(STORAGE_KEYS.USER_PROFILE, updated)]);
    dispatch({ type: 'SET_PROFILE', payload: updated });
    dispatch({ type: 'SET_ONBOARDING_DONE', payload: true });
  }, []);

  const resetOnboarding = useCallback(async () => {
    await Promise.all([storageRemove(STORAGE_KEYS.ONBOARDING_DONE), storageRemove(STORAGE_KEYS.USER_PROFILE)]);
    dispatch({ type: 'SET_ONBOARDING_DONE', payload: false });
    dispatch({ type: 'SET_PROFILE', payload: DEFAULT_PROFILE });
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    const updated = { ...state.userProfile, ...updates };
    await storageSet(STORAGE_KEYS.USER_PROFILE, updated);
    dispatch({ type: 'SET_PROFILE', payload: updated });
  }, [state.userProfile]);

  const saveMoodEntry = useCallback(async (entry: Omit<MoodEntry, 'id' | 'date'>) => {
    const newEntry: MoodEntry = { ...entry, id: uid(), date: new Date().toISOString() };
    const updated = [newEntry, ...state.moodHistory].slice(0, 90);
    await storageSet(STORAGE_KEYS.MOOD_HISTORY, updated);
    dispatch({ type: 'ADD_MOOD', payload: newEntry });
  }, [state.moodHistory]);

  const createCollection = useCallback(async (title: string, icon: string): Promise<VaultCollection> => {
    const col: VaultCollection = { id: uid(), title, icon, createdAt: new Date().toISOString() };
    const updated = [...state.vaultCollections, col];
    await storageSet(STORAGE_KEYS.VAULT_COLLECTIONS, updated);
    dispatch({ type: 'SET_COLLECTIONS', payload: updated });
    return col;
  }, [state.vaultCollections]);

  const deleteCollection = useCallback(async (id: string) => {
    const cols = state.vaultCollections.filter(c => c.id !== id);
    const entries = state.vaultEntries.filter(e => e.collectionId !== id);
    await Promise.all([storageSet(STORAGE_KEYS.VAULT_COLLECTIONS, cols), storageSet(STORAGE_KEYS.VAULT_ENTRIES, entries)]);
    dispatch({ type: 'SET_COLLECTIONS', payload: cols });
    dispatch({ type: 'SET_ENTRIES', payload: entries });
  }, [state.vaultCollections, state.vaultEntries]);

  const addVaultEntry = useCallback(async (entry: Omit<VaultEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<VaultEntry> => {
    const now = new Date().toISOString();
    const newEntry: VaultEntry = { ...entry, id: uid(), createdAt: now, updatedAt: now };
    const updated = [...state.vaultEntries, newEntry];
    await storageSet(STORAGE_KEYS.VAULT_ENTRIES, updated);
    dispatch({ type: 'SET_ENTRIES', payload: updated });
    return newEntry;
  }, [state.vaultEntries]);

  const updateVaultEntry = useCallback(async (id: string, updates: Partial<VaultEntry>) => {
    const updated = state.vaultEntries.map(e => e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e);
    await storageSet(STORAGE_KEYS.VAULT_ENTRIES, updated);
    dispatch({ type: 'SET_ENTRIES', payload: updated });
  }, [state.vaultEntries]);

  const deleteVaultEntry = useCallback(async (id: string) => {
    const updated = state.vaultEntries.filter(e => e.id !== id);
    await storageSet(STORAGE_KEYS.VAULT_ENTRIES, updated);
    dispatch({ type: 'SET_ENTRIES', payload: updated });
  }, [state.vaultEntries]);

  const saveJournalEntry = useCallback(async (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    const newEntry: JournalEntry = { ...entry, id: uid(), createdAt: new Date().toISOString() };
    const updated = [newEntry, ...state.journalEntries];
    await storageSet(STORAGE_KEYS.JOURNAL_ENTRIES, updated);
    dispatch({ type: 'SET_JOURNAL', payload: updated });
  }, [state.journalEntries]);

  const deleteJournalEntry = useCallback(async (id: string) => {
    const updated = state.journalEntries.filter(e => e.id !== id);
    await storageSet(STORAGE_KEYS.JOURNAL_ENTRIES, updated);
    dispatch({ type: 'SET_JOURNAL', payload: updated });
  }, [state.journalEntries]);

  const updateModuleProgress = useCallback(async (moduleId: string, updates: Partial<ModuleProgress>) => {
    const existing = state.moduleProgress.find(m => m.moduleId === moduleId);
    const updated = existing
      ? state.moduleProgress.map(m => m.moduleId === moduleId ? { ...m, ...updates } : m)
      : [...state.moduleProgress, { moduleId, status: 'in_progress' as const, currentStep: 0, ...updates }];
    await storageSet(STORAGE_KEYS.JOURNEY_PROGRESS, updated);
    dispatch({ type: 'SET_MODULE_PROGRESS', payload: updated });
  }, [state.moduleProgress]);

  const updateSettings = useCallback(async (updates: Partial<Settings>) => {
    const updated = { ...state.settings, ...updates };
    await storageSet(STORAGE_KEYS.SETTINGS, updated);
    dispatch({ type: 'SET_SETTINGS', payload: updated });
  }, [state.settings]);

  const lightCandle = useCallback(async () => {
    const newCount = state.candleCount + 1;
    await storageSet(STORAGE_KEYS.CANDLE_COUNT, newCount);
    dispatch({ type: 'SET_CANDLE_COUNT', payload: newCount });
  }, [state.candleCount]);

  const setCapacityLevel = useCallback(async (level: number) => {
    await storageSet(STORAGE_KEYS.CAPACITY_LEVEL, level);
    dispatch({ type: 'SET_CAPACITY', payload: level });
  }, []);

  const value: AppContextType = {
    ...state, completeOnboarding, resetOnboarding, updateProfile, saveMoodEntry,
    createCollection, deleteCollection, addVaultEntry, updateVaultEntry, deleteVaultEntry,
    saveJournalEntry, deleteJournalEntry, updateModuleProgress, updateSettings,
    lightCandle, setCapacityLevel,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}