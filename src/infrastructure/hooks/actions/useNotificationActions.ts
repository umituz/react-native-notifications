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

/**
 * useNotificationActions - Offline Notification Actions
 *
 * All actions use AsyncStorage and expo-notifications.
 * NO backend - pure offline.
 */
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

        // Create notification
        const notification: Notification = {
          id: `notif_${Date.now()}`,
          title: options.title,
          body: options.body,
          data: options.data,
          scheduled_for: options.scheduled_for?.toISOString(),
          created_at: new Date().toISOString(),
          read: false,
        };

        // Save to AsyncStorage
        const data = await AsyncStorage.getItem('@notifications:list');
        const notifications: Notification[] = data ? JSON.parse(data) : [];
        notifications.unshift(notification);
        await AsyncStorage.setItem(
          '@notifications:list',
          JSON.stringify(notifications)
        );

        // Deliver using expo-notifications
        await notificationDelivery.deliver(notification);

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

      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to mark all as read'
      );
      return false;
    }
  }, [setNotifications, setUnreadCount, setError]);

  const deleteNotification = useCallback(
    async (notificationId: string): Promise<boolean> => {
      try {
        const data = await AsyncStorage.getItem('@notifications:list');
        const notifications: Notification[] = data ? JSON.parse(data) : [];

        const deleted = notifications.find((n) => n.id === notificationId);
        const filtered = notifications.filter((n) => n.id !== notificationId);

        await AsyncStorage.setItem(
          '@notifications:list',
          JSON.stringify(filtered)
        );

        setNotifications((prev: Notification[]) =>
          prev.filter((n) => n.id !== notificationId)
        );

        if (deleted && !deleted.read) {
          setUnreadCount((prev: number) => Math.max(0, prev - 1));
        }

        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to delete notification'
        );
        return false;
      }
    },
    [setNotifications, setUnreadCount, setError]
  );

  const registerChannel = useCallback(
    async (
      channelType: 'push' | 'in_app',
      preferences: Record<string, any> = {}
    ): Promise<NotificationChannel | null> => {
      try {
        const channel = await channelManager.register(channelType, preferences);
        if (channel) {
          setChannels((prev: NotificationChannel[]) => [...prev, channel]);
        }
        return channel;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to register channel'
        );
        return null;
      }
    },
    [setChannels, setError]
  );

  const verifyChannel = useCallback(
    async (channelId: string): Promise<boolean> => {
      try {
        const success = await channelManager.verify(channelId);
        if (success) {
          setChannels((prev: NotificationChannel[]) =>
            prev.map((c) =>
              c.id === channelId ? { ...c, is_verified: true } : c
            )
          );
        }
        return success;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to verify channel'
        );
        return false;
      }
    },
    [setChannels, setError]
  );

  const updatePreferences = useCallback(
    async (newPreferences: Partial<NotificationPreferences>): Promise<boolean> => {
      try {
        const success = await preferencesManager.update(newPreferences);
        if (success) {
          setPreferences((prev: NotificationPreferences | null) =>
            prev ? { ...prev, ...newPreferences } : null
          );
        }
        return success;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to update preferences'
        );
        return false;
      }
    },
    [setPreferences, setError]
  );

  return {
    sendNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    registerChannel,
    verifyChannel,
    updatePreferences,
  };
};
