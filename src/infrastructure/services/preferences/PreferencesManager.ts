import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NotificationPreferences } from '../types';

/**
 * PreferencesManager - Offline Notification Preferences
 *
 * Stores preferences in AsyncStorage (offline-capable).
 * Only supports local push and in-app notifications.
 *
 * NO backend, NO email/SMS - pure offline.
 */
export class PreferencesManager {
  private static STORAGE_KEY = '@notifications:preferences';

  async get(): Promise<NotificationPreferences> {
    try {
      const data = await AsyncStorage.getItem(PreferencesManager.STORAGE_KEY);
      return data ? JSON.parse(data) : this.getDefaults();
    } catch (error) {
      return this.getDefaults();
    }
  }

  async update(preferences: Partial<NotificationPreferences>): Promise<boolean> {
    try {
      const current = await this.get();
      const updated = {
        ...current,
        ...preferences,
        categories: { ...current.categories, ...preferences.categories },
      };

      await AsyncStorage.setItem(
        PreferencesManager.STORAGE_KEY,
        JSON.stringify(updated)
      );

      return true;
    } catch (error) {
      return false;
    }
  }

  isChannelEnabled(
    channelType: 'push' | 'in_app',
    prefs: NotificationPreferences
  ): boolean {
    if (channelType === 'in_app') return true;
    return prefs.push_enabled ?? true;
  }

  isInQuietHours(quietHours: NotificationPreferences['quiet_hours']): boolean {
    if (!quietHours.enabled) return false;
    const currentTime = new Date().toTimeString().slice(0, 5);
    return (
      currentTime >= quietHours.start_time ||
      currentTime <= quietHours.end_time
    );
  }

  private getDefaults(): NotificationPreferences {
    return {
      push_enabled: true,
      quiet_hours: {
        enabled: false,
        start_time: '22:00',
        end_time: '08:00',
        timezone: 'UTC',
      },
      categories: {
        reminders: { push: true, in_app: true },
        updates: { push: true, in_app: true },
        alerts: { push: true, in_app: true },
      },
    };
  }
}
