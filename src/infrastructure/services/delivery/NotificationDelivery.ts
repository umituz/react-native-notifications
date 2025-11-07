import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Notification } from '../types';

/**
 * NotificationDelivery - Offline Local Notification Delivery
 *
 * Uses expo-notifications for local push notifications only.
 * All data stored in AsyncStorage (offline-capable).
 *
 * NO backend, NO email/SMS - pure offline local notifications.
 */
export class NotificationDelivery {
  private static STORAGE_KEY = '@notifications:delivered';

  async deliver(notification: Notification): Promise<void> {
    try {
      // Schedule local notification using expo-notifications
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: { notificationId: notification.id },
        },
        trigger: notification.scheduled_for
          ? { date: new Date(notification.scheduled_for) }
          : null, // null = immediate delivery
      });

      // Update status in AsyncStorage (offline storage)
      await this.updateStatus(notification.id, 'delivered');
    } catch (error) {
      // Silent failure - update status to failed
      await this.updateStatus(notification.id, 'failed');
    }
  }

  private async updateStatus(
    notificationId: string,
    status: 'delivered' | 'failed'
  ): Promise<void> {
    try {
      const delivered = await this.getDelivered();
      delivered[notificationId] = {
        status,
        delivered_at: new Date().toISOString(),
      };
      await AsyncStorage.setItem(
        NotificationDelivery.STORAGE_KEY,
        JSON.stringify(delivered)
      );
    } catch (error) {
      // Silent failure
    }
  }

  private async getDelivered(): Promise<Record<string, any>> {
    try {
      const data = await AsyncStorage.getItem(NotificationDelivery.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      return {};
    }
  }
}
