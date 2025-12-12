import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  Notification,
  NotificationChannel,
  NotificationPreferences,
} from '../types';
import { ChannelManager } from '../../services/channels/ChannelManager';
import { PreferencesManager } from '../../services/preferences/PreferencesManager';
import { devLog } from '../../utils/dev';

export const useNotificationManagementActions = (state: any, setters: any) => {
  const { setNotifications, setUnreadCount, setChannels, setPreferences, setError } = setters;

  const channelManager = new ChannelManager();
  const preferencesManager = new PreferencesManager();

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

        devLog('[useNotificationManagementActions] Deleted notification:', notificationId);

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

        devLog('[useNotificationManagementActions] Channel registered:', channel?.id);

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

        devLog('[useNotificationManagementActions] Channel verified:', channelId, success);

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

        devLog('[useNotificationManagementActions] Preferences updated:', newPreferences);

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
    deleteNotification,
    registerChannel,
    verifyChannel,
    updatePreferences,
  };
};