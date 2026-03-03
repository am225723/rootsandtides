import AsyncStorage from '@react-native-async-storage/async-storage';

export async function storageGet<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`[storage] get error for key "${key}":`, e);
    return null;
  }
}

export async function storageSet<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[storage] set error for key "${key}":`, e);
  }
}

export async function storageRemove(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.warn(`[storage] remove error for key "${key}":`, e);
  }
}

export async function storageClear(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.warn('[storage] clear error:', e);
  }
}

export const STORAGE_KEYS = {
  USER_PROFILE: 'rt_user_profile',
  MOOD_HISTORY: 'rt_mood_history',
  VAULT_COLLECTIONS: 'rt_vault_collections',
  VAULT_ENTRIES: 'rt_vault_entries',
  JOURNEY_PROGRESS: 'rt_journey_progress',
  SETTINGS: 'rt_settings',
  JOURNAL_ENTRIES: 'rt_journal_entries',
  CANDLE_COUNT: 'rt_candle_count',
  ONBOARDING_DONE: 'rt_onboarding_done',
  CAPACITY_LEVEL: 'rt_capacity_level',
} as const;