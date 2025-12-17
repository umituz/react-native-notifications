/**
 * Reminders Store - Zustand State Management
 * Manages reminder state with AsyncStorage persistence
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Reminder, QuietHoursConfig, NotificationPreferences } from '../../../../infrastructure/services/types';

const STORAGE_KEYS = {
  REMINDERS: '@notifications:reminders',
  PREFERENCES: '@notifications:preferences',
  QUIET_HOURS: '@notifications:quiet_hours',
} as const;

// ============================================================================
// STORE INTERFACE
// ============================================================================

interface RemindersState {
  reminders: Reminder[];
  preferences: NotificationPreferences;
  isLoading: boolean;
  isInitialized: boolean;
}

interface RemindersActions {
  initialize: () => Promise<void>;
  loadReminders: () => Promise<void>;
  addReminder: (reminder: Reminder) => Promise<void>;
  updateReminder: (id: string, updates: Partial<Reminder>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  toggleReminder: (id: string) => Promise<void>;
  loadPreferences: () => Promise<void>;
  updatePreferences: (updates: Partial<NotificationPreferences>) => Promise<void>;
  updateQuietHours: (quietHours: QuietHoursConfig) => Promise<void>;
  reset: () => Promise<void>;
}

type RemindersStore = RemindersState & RemindersActions;

// ============================================================================
// DEFAULT VALUES
// ============================================================================

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  sound: true,
  vibration: true,
  quietHours: {
    enabled: false,
    startHour: 22,
    startMinute: 0,
    endHour: 7,
    endMinute: 0,
  },
};

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useRemindersStore = create<RemindersStore>((set, get) => ({
  reminders: [],
  preferences: DEFAULT_PREFERENCES,
  isLoading: true,
  isInitialized: false,

  initialize: async () => {
    try {
      const [remindersData, preferencesData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.REMINDERS),
        AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES)
      ]);

      const reminders = remindersData ? JSON.parse(remindersData) : [];
      let preferences = DEFAULT_PREFERENCES;

      if (preferencesData) {
        const parsed = JSON.parse(preferencesData);
        preferences = { ...DEFAULT_PREFERENCES, ...parsed };
      }

      set({ reminders, preferences, isLoading: false, isInitialized: true });
    } catch {
      set({ reminders: [], preferences: DEFAULT_PREFERENCES, isLoading: false, isInitialized: true });
    }
  },

  loadReminders: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.REMINDERS);
      const reminders = data ? JSON.parse(data) : [];
      set({ reminders });
    } catch {
      set({ reminders: [] });
    }
  },

  addReminder: async (reminder: Reminder) => {
    const { reminders } = get();
    const updated = [...reminders, reminder];
    set({ reminders: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
  },

  updateReminder: async (id: string, updates: Partial<Reminder>) => {
    const { reminders } = get();
    const updated = reminders.map(r =>
      r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
    );
    set({ reminders: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
  },

  deleteReminder: async (id: string) => {
    const { reminders } = get();
    const updated = reminders.filter(r => r.id !== id);
    set({ reminders: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
  },

  toggleReminder: async (id: string) => {
    const { reminders } = get();
    const updated = reminders.map(r =>
      r.id === id ? { ...r, enabled: !r.enabled, updatedAt: new Date().toISOString() } : r
    );
    set({ reminders: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(updated));
  },

  loadPreferences: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
      const preferences = data ? { ...DEFAULT_PREFERENCES, ...JSON.parse(data) } : DEFAULT_PREFERENCES;
      set({ preferences });
    } catch {
      set({ preferences: DEFAULT_PREFERENCES });
    }
  },

  updatePreferences: async (updates: Partial<NotificationPreferences>) => {
    const { preferences } = get();
    const updated = { ...preferences, ...updates };
    set({ preferences: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
  },

  updateQuietHours: async (quietHours: QuietHoursConfig) => {
    const { preferences } = get();
    const updated = { ...preferences, quietHours };
    set({ preferences: updated });
    await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
  },

  reset: async () => {
    set({ reminders: [], preferences: DEFAULT_PREFERENCES });
    await AsyncStorage.multiRemove([STORAGE_KEYS.REMINDERS, STORAGE_KEYS.PREFERENCES]);
  },
}));

// ============================================================================
// SELECTOR HOOKS
// ============================================================================

export const useReminders = () => useRemindersStore(state => state.reminders);
export const useEnabledReminders = () => useRemindersStore(state => state.reminders.filter(r => r.enabled));
export const useReminderById = (id: string) => useRemindersStore(state => state.reminders.find(r => r.id === id));
export const useNotificationPreferences = () => useRemindersStore(state => state.preferences);
export const useQuietHours = () => useRemindersStore(state => state.preferences.quietHours);
export const useRemindersLoading = () => useRemindersStore(state => state.isLoading);
export const useRemindersInitialized = () => useRemindersStore(state => state.isInitialized);
