/**
 * NotificationManager - Core Notification Operations
 *
 * Offline-first notification system using expo-notifications.
 * Works in ALL apps (offline, online, hybrid) - no backend required.
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { NotificationPermissions } from './NotificationPermissions';
import { NotificationScheduler } from './NotificationScheduler';
import { NotificationBadgeManager } from './NotificationBadgeManager';
import { devLog, devError } from '../utils/dev';

export type NotificationTrigger =
  | { type: 'date'; date: Date }
  | { type: 'daily'; hour: number; minute: number }
  | { type: 'weekly'; weekday: number; hour: number; minute: number }
  | { type: 'monthly'; day: number; hour: number; minute: number };

export interface ScheduleNotificationOptions {
  title: string;
  body: string;
  data?: Record<string, any>;
  trigger: NotificationTrigger;
  sound?: boolean | string;
  badge?: number;
  categoryIdentifier?: string;
}

export interface ScheduledNotification {
  identifier: string;
  content: {
    title: string;
    body: string;
    data: Record<string, any>;
  };
  trigger: any;
}

export class NotificationManager {
  private permissions: NotificationPermissions;
  private scheduler: NotificationScheduler;
  private badgeManager: NotificationBadgeManager;

  constructor() {
    this.permissions = new NotificationPermissions();
    this.scheduler = new NotificationScheduler();
    this.badgeManager = new NotificationBadgeManager();
  }

  static configure() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    devLog('[NotificationManager] Configured notification handler');
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const result = await this.permissions.requestPermissions();
      
      devLog('[NotificationManager] Permissions requested:', result);
      
      return result;
    } catch (error) {
      devError('[NotificationManager] Permission request failed:', error);
      return false;
    }
  }

  async hasPermissions(): Promise<boolean> {
    try {
      return await this.permissions.hasPermissions();
    } catch (error) {
      devError('[NotificationManager] Permission check failed:', error);
      return false;
    }
  }

  async scheduleNotification(options: ScheduleNotificationOptions): Promise<string> {
    try {
      const id = await this.scheduler.scheduleNotification(options);
      
      devLog('[NotificationManager] Notification scheduled:', id);
      
      return id;
    } catch (error) {
      devError('[NotificationManager] Schedule notification failed:', error);
      throw error;
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await this.scheduler.cancelNotification(notificationId);
      
      devLog('[NotificationManager] Notification cancelled:', notificationId);
    } catch (error) {
      devError('[NotificationManager] Cancel notification failed:', error);
      throw error;
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await this.scheduler.cancelAllNotifications();
      
      devLog('[NotificationManager] All notifications cancelled');
    } catch (error) {
      devError('[NotificationManager] Cancel all notifications failed:', error);
      throw error;
    }
  }

  async getScheduledNotifications(): Promise<ScheduledNotification[]> {
    try {
      return await this.scheduler.getScheduledNotifications();
    } catch (error) {
      devError('[NotificationManager] Get scheduled notifications failed:', error);
      return [];
    }
  }

  async dismissAllNotifications(): Promise<void> {
    try {
      await Notifications.dismissAllNotificationsAsync();
      
      devLog('[NotificationManager] All notifications dismissed');
    } catch (error) {
      devError('[NotificationManager] Dismiss all notifications failed:', error);
      throw error;
    }
  }

  async getBadgeCount(): Promise<number> {
    try {
      return await this.badgeManager.getBadgeCount();
    } catch (error) {
      devError('[NotificationManager] Get badge count failed:', error);
      return 0;
    }
  }

  async setBadgeCount(count: number): Promise<void> {
    try {
      await this.badgeManager.setBadgeCount(count);
      
      devLog('[NotificationManager] Badge count set:', count);
    } catch (error) {
      devError('[NotificationManager] Set badge count failed:', error);
      throw error;
    }
  }
}