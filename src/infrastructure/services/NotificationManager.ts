/**
 * NotificationManager
 *
 * Offline-first notification system using expo-notifications.
 * Works in ALL apps (offline, online, hybrid) - no backend required.
 *
 * Features:
 * - Schedule notifications for specific dates/times
 * - Repeating notifications (daily, weekly, monthly)
 * - Android notification channels
 * - Permission handling
 * - Cancel individual or all notifications
 * - Works completely offline
 *
 * Use Cases:
 * - Reminders (bills, tasks, appointments)
 * - Habit tracking (daily streaks)
 * - Medication reminders
 * - Any app needing local notifications
 *
 * @module NotificationManager
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

/**
 * Trigger types for notifications
 */
export type NotificationTrigger =
  | { type: 'date'; date: Date }
  | { type: 'daily'; hour: number; minute: number }
  | { type: 'weekly'; weekday: number; hour: number; minute: number }
  | { type: 'monthly'; day: number; hour: number; minute: number };

/**
 * Options for scheduling a notification
 */
export interface ScheduleNotificationOptions {
  title: string;
  body: string;
  data?: Record<string, any>;
  trigger: NotificationTrigger;
  sound?: boolean | string;
  badge?: number;
  categoryIdentifier?: string;
}

/**
 * Scheduled notification details
 */
export interface ScheduledNotification {
  identifier: string;
  content: {
    title: string;
    body: string;
    data: Record<string, any>;
  };
  trigger: any;
}

/**
 * NotificationManager
 *
 * Handles all notification operations using expo-notifications.
 * Works completely offline - no backend, no user IDs, just device-local notifications.
 */
export class NotificationManager {
  /**
   * Configure notification handler (how notifications appear when app is in foreground)
   */
  static configure() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }

  /**
   * Request notification permissions
   * iOS: Shows system permission dialog
   * Android: Permissions granted by default (Android 13+ requires runtime permission)
   */
  async requestPermissions(): Promise<boolean> {
    try {
      if (!Device.isDevice) {
        console.warn('[NotificationManager] Notifications only work on physical devices');
        return false;
      }

      const permissionsResponse = await Notifications.getPermissionsAsync();
      const existingStatus = (permissionsResponse as any).status || ((permissionsResponse as any).granted ? 'granted' : 'denied');
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const requestResponse = await Notifications.requestPermissionsAsync();
        finalStatus = (requestResponse as any).status || ((requestResponse as any).granted ? 'granted' : 'denied');
      }

      if (Platform.OS === 'android') {
        await this.createAndroidChannels();
      }

      return finalStatus === 'granted';
    } catch (error) {
      console.error('[NotificationManager] Permission request failed:', error);
      return false;
    }
  }

  /**
   * Check if notification permissions are granted
   */
  async hasPermissions(): Promise<boolean> {
    try {
      if (!Device.isDevice) return false;
      const permissionsResponse = await Notifications.getPermissionsAsync();
      return (permissionsResponse as any).status === 'granted' || (permissionsResponse as any).granted === true;
    } catch (error) {
      console.error('[NotificationManager] Permission check failed:', error);
      return false;
    }
  }

  /**
   * Create Android notification channels (required for Android 8+)
   */
  private async createAndroidChannels(): Promise<void> {
    if (Platform.OS !== 'android') return;

    try {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        sound: 'default',
        lightColor: '#3B82F6',
      });

      await Notifications.setNotificationChannelAsync('reminders', {
        name: 'Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        sound: 'default',
        lightColor: '#3B82F6',
        enableVibrate: true,
      });

      await Notifications.setNotificationChannelAsync('urgent', {
        name: 'Urgent',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 250, 500],
        sound: 'default',
        lightColor: '#EF4444',
        enableVibrate: true,
      });
    } catch (error) {
      console.error('[NotificationManager] Android channel creation failed:', error);
    }
  }

  /**
   * Schedule a notification
   *
   * @example
   * // Specific date
   * const id = await manager.scheduleNotification({
   *   title: 'Bill Reminder',
   *   body: 'Electricity bill due today',
   *   trigger: { type: 'date', date: new Date('2025-01-15T09:00:00') }
   * });
   *
   * @example
   * // Daily reminder
   * const id = await manager.scheduleNotification({
   *   title: 'Daily Workout',
   *   body: 'Time for your morning workout!',
   *   trigger: { type: 'daily', hour: 7, minute: 0 }
   * });
   */
  async scheduleNotification(options: ScheduleNotificationOptions): Promise<string> {
    try {
      const { title, body, data = {}, trigger, sound = true, badge, categoryIdentifier } = options;

      let notificationTrigger: any;

      if (trigger.type === 'date') {
        notificationTrigger = {
          date: trigger.date,
          channelId: categoryIdentifier || 'default',
        };
      } else if (trigger.type === 'daily') {
        notificationTrigger = {
          hour: trigger.hour,
          minute: trigger.minute,
          repeats: true,
          channelId: categoryIdentifier || 'reminders',
        };
      } else if (trigger.type === 'weekly') {
        notificationTrigger = {
          weekday: trigger.weekday,
          hour: trigger.hour,
          minute: trigger.minute,
          repeats: true,
          channelId: categoryIdentifier || 'reminders',
        };
      } else if (trigger.type === 'monthly') {
        notificationTrigger = {
          day: trigger.day,
          hour: trigger.hour,
          minute: trigger.minute,
          repeats: true,
          channelId: categoryIdentifier || 'reminders',
        };
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: sound === true ? 'default' : sound || undefined,
          badge,
          categoryIdentifier,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          vibrate: [0, 250, 250, 250],
        },
        trigger: notificationTrigger,
      });

      return notificationId;
    } catch (error) {
      console.error('[NotificationManager] Schedule notification failed:', error);
      throw error;
    }
  }

  /**
   * Cancel a scheduled notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('[NotificationManager] Cancel notification failed:', error);
      throw error;
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('[NotificationManager] Cancel all notifications failed:', error);
      throw error;
    }
  }

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications(): Promise<ScheduledNotification[]> {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      return notifications.map(notification => ({
        identifier: notification.identifier,
        content: {
          title: notification.content.title || '',
          body: notification.content.body || '',
          data: notification.content.data as Record<string, any>,
        },
        trigger: notification.trigger,
      }));
    } catch (error) {
      console.error('[NotificationManager] Get scheduled notifications failed:', error);
      return [];
    }
  }

  /**
   * Dismiss all delivered notifications (clear from notification center)
   */
  async dismissAllNotifications(): Promise<void> {
    try {
      await Notifications.dismissAllNotificationsAsync();
    } catch (error) {
      console.error('[NotificationManager] Dismiss all notifications failed:', error);
      throw error;
    }
  }

  /**
   * Get notification badge count (iOS only)
   */
  async getBadgeCount(): Promise<number> {
    try {
      if (Platform.OS === 'ios') {
        return await Notifications.getBadgeCountAsync();
      }
      return 0;
    } catch (error) {
      console.error('[NotificationManager] Get badge count failed:', error);
      return 0;
    }
  }

  /**
   * Set notification badge count (iOS only)
   */
  async setBadgeCount(count: number): Promise<void> {
    try {
      if (Platform.OS === 'ios') {
        await Notifications.setBadgeCountAsync(count);
      }
    } catch (error) {
      console.error('[NotificationManager] Set badge count failed:', error);
      throw error;
    }
  }
}
