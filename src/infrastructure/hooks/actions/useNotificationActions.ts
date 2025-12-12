import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import type {
  SendNotificationOptions,
  Notification,
  NotificationChannel,
  NotificationPreferences,
} from '../types';
import { NotificationDelivery } from '../../services/delivery/NotificationDelivery';
import { ChannelManager } from '../../services/channels/ChannelManager';
import { PreferencesManager } from '../../services/preferences/PreferencesManager';
import { devLog } from '../../utils/dev';

export const useNotificationActions = (state: any, setters: any) => {
  const {
    setNotifications,
    setUnreadCount,
    setChannels,
    setPreferences,
    setError,
  } = setters;

  const notificationDelivery = new NotificationDelivery();
  const channelManager = new ChannelManager();
  const preferencesManager = new PreferencesManager();

  const sendNotification = useCallback(
    async (options: SendNotificationOptions): Promise<Notification[]> => {
      try {
        setError(null);

        const notification: Notification = {
          id: `notif_${Date.now()}`,
          title: options.title,
          body: options.body,
          data: options.data,
          scheduled_for: options.scheduled_for?.toISOString(),
          created_at: new Date().toISOString(),
          read: false,
        };

        const data = await AsyncStorage.getItem('@notifications:list');
        const notifications: Notification[] = data ? JSON.parse(data) : [];
        notifications.unshift(notification);
        await AsyncStorage.setItem(
          '@notifications:list',
          JSON.stringify(notifications)
        );

        await notificationDelivery.deliver(notification);

        devLog('[useNotificationActions] Notification sent:', notification.id);

        return [notification];
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to send notification'
        );
        return [];
      }
    },
    [setError]
  );

  const markAsRead = useCallback(
    async (notificationId: string): Promise<boolean> => {
      try {
        const data = await AsyncStorage.getItem('@notifications:list');
        const notifications: Notification[] = data ? JSON.parse(data) : [];

        const updated = notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        );

        await AsyncStorage.setItem(
          '@notifications:list',
          JSON.stringify(updated)
        );

        setNotifications((prev: Notification[]) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          )
        );
        setUnreadCount((prev: number) => Math.max(0, prev - 1));

        devLog('[useNotificationActions] Marked as read:', notificationId);

        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to mark as read'
        );
        return false;
      }
    },
    [setNotifications, setUnreadCount, setError]
  );

  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    try {
      const data = await AsyncStorage.getItem('@notifications:list');
      const notifications: Notification[] = data ? JSON.parse(data) : [];

      const updated = notifications.map((n) => ({ ...n, read: true }));

      await AsyncStorage.setItem('@notifications:list', JSON.stringify(updated));

      setNotifications((prev: Notification[]) =>
        prev.map((n) => ({ ...n, read: true }))
      );
      setUnreadCount(0);

      devLog('[useNotificationActions] All notifications marked as read');

      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to mark all as read'
      );
      return false;
    }
  }, [setNotifications, setUnreadCount, setError]);

  return {
    sendNotification,
    markAsRead,
    markAllAsRead,
  };
};