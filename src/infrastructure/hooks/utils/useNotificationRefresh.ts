import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Notification } from '../types';
import { ChannelManager } from '../../services/channels/ChannelManager';
import { PreferencesManager } from '../../services/preferences/PreferencesManager';

/**
 * useNotificationRefresh - Offline Notification Refresh
 *
 * Uses AsyncStorage for local data.
 * NO backend - pure offline.
 */
export const useNotificationRefresh = (pageSize: number, setters: any) => {
  const {
    setNotifications,
    setUnreadCount,
    setChannels,
    setPreferences,
    setLoading,
    setError,
    setHasMore,
  } = setters;

  const channelManager = new ChannelManager();
  const preferencesManager = new PreferencesManager();

  const refreshNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load from AsyncStorage
      const data = await AsyncStorage.getItem('@notifications:list');
      const allNotifications: Notification[] = data ? JSON.parse(data) : [];

      // Paginate
      const paginated = allNotifications.slice(0, pageSize);
      const unread = allNotifications.filter((n) => !n.read).length;

      setNotifications(paginated);
      setUnreadCount(unread);
      setHasMore(allNotifications.length > pageSize);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load notifications'
      );
    } finally {
      setLoading(false);
    }
  }, [pageSize, setNotifications, setUnreadCount, setHasMore, setLoading, setError]);

  const loadMoreNotifications = useCallback(
    async (currentLength: number, hasMore: boolean, loading: boolean) => {
      if (!hasMore || loading) return;

      try {
        setLoading(true);
        setError(null);

        const data = await AsyncStorage.getItem('@notifications:list');
        const allNotifications: Notification[] = data ? JSON.parse(data) : [];

        const moreNotifications = allNotifications.slice(
          currentLength,
          currentLength + pageSize
        );

        setNotifications((prev: any[]) => [...prev, ...moreNotifications]);
        setHasMore(allNotifications.length > currentLength + pageSize);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load more notifications'
        );
      } finally {
        setLoading(false);
      }
    },
    [pageSize, setNotifications, setHasMore, setLoading, setError]
  );

  const refreshChannels = useCallback(async () => {
    try {
      const channelsData = await channelManager.getActiveChannels();
      setChannels(channelsData);
    } catch (err) {
      // Silent failure
    }
  }, [setChannels]);

  const refreshPreferences = useCallback(async () => {
    try {
      const prefsData = await preferencesManager.get();
      setPreferences(prefsData);
    } catch (err) {
      // Silent failure
    }
  }, [setPreferences]);

  return {
    refreshNotifications,
    loadMoreNotifications,
    refreshChannels,
    refreshPreferences,
  };
};
