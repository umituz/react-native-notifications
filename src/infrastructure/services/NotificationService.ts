/**
 * NotificationService
 *
 * Simple facade for offline notification system.
 * Works in ALL apps - offline, online, hybrid - no backend required.
 *
 * @module NotificationService
 */

import { NotificationManager } from './NotificationManager';

export * from './types';

/**
 * Notification service singleton
 * Provides simple access to notification manager
 */
export class NotificationService {
  private static instance: NotificationService;

  readonly notifications = new NotificationManager();

  private constructor() {
    // Configure notification handler on initialization
    NotificationManager.configure();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    return await this.notifications.requestPermissions();
  }

  /**
   * Check if permissions are granted
   */
  async hasPermissions(): Promise<boolean> {
    return await this.notifications.hasPermissions();
  }
}

export const notificationService = NotificationService.getInstance();
