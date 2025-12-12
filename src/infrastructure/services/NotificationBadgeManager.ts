import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { devError } from '../utils/dev';

export class NotificationBadgeManager {
  async getBadgeCount(): Promise<number> {
    try {
      if (Platform.OS === 'ios') {
        return await Notifications.getBadgeCountAsync();
      }
      return 0;
    } catch (error) {
      devError('[NotificationBadgeManager] Get badge count failed:', error);
      return 0;
    }
  }

  async setBadgeCount(count: number): Promise<void> {
    try {
      if (Platform.OS === 'ios') {
        await Notifications.setBadgeCountAsync(count);
      }
    } catch (error) {
      devError('[NotificationBadgeManager] Set badge count failed:', error);
      throw error;
    }
  }
}