import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Notification } from '../types';
import { devLog, devError } from '../../utils/dev';

export class NotificationDelivery {
  private static STORAGE_KEY = '@notifications:delivered';

  async deliver(notification: Notification): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: { notificationId: notification.id },
        },
        trigger: notification.scheduled_for
          ? { date: new Date(notification.scheduled_for) }
          : null,
      });

      await this.updateStatus(notification.id, 'delivered');

      devLog('[NotificationDelivery] Notification delivered:', notification.id);
    } catch (error) {
      await this.updateStatus(notification.id, 'failed');
      
      devError('[NotificationDelivery] Delivery failed:', notification.id, error);
      throw error;
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

      devLog('[NotificationDelivery] Status updated:', notificationId, status);
    } catch (error) {
      devError('[NotificationDelivery] Status update failed:', notificationId, error);
    }
  }

  private async getDelivered(): Promise<Record<string, any>> {
    try {
      const data = await AsyncStorage.getItem(NotificationDelivery.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      devError('[NotificationDelivery] Failed to get delivered notifications:', error);
      return {};
    }
  }

  async getDeliveryStatus(notificationId: string): Promise<string | null> {
    try {
      const delivered = await this.getDelivered();
      return delivered[notificationId]?.status || null;
    } catch (error) {
      devError('[NotificationDelivery] Failed to get delivery status:', notificationId, error);
      return null;
    }
  }

  async clearDeliveryHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(NotificationDelivery.STORAGE_KEY);
      
      devLog('[NotificationDelivery] Delivery history cleared');
    } catch (error) {
      devError('[NotificationDelivery] Failed to clear delivery history:', error);
    }
  }
}