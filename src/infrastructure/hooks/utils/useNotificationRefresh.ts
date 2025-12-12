import { useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Notification } from '../types';
import { ChannelManager } from '../../services/channels/ChannelManager';
import { PreferencesManager } from '../../services/preferences/PreferencesManager';
import { devLog, devError } from '../../utils/dev';

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

  const channelManager = useRef(new ChannelManager()).current;
  const preferencesManager = useRef(new PreferencesManager()).current;
  const abortController = useRef<AbortController | null>(null);

  const cleanup = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    try {
      cleanup();
      abortController.current = new AbortController();

      setLoading(true);
      setError(null);

      const data = await AsyncStorage.getItem('@notifications:list');
      const allNotifications: Notification[] = data ? JSON.parse(data) : [];

      const paginated = allNotifications.slice(0, pageSize);
      const unread = allNotifications.filter((n) => !n.read).length;

      setNotifications(paginated);
      setUnreadCount(unread);
      setHasMore(allNotifications.length > pageSize);

      devLog('[useNotificationRefresh] Refreshed notifications:', paginated.length);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError(
        err instanceof Error ? err.message : 'Failed to load notifications'
      );
    } finally {
      setLoading(false);
      cleanup();
    }
  }, [pageSize, setNotifications, setUnreadCount, setHasMore, setLoading, setError, cleanup]);

  const loadMoreNotifications = useCallback(
    async (currentLength: number, hasMore: boolean, loading: boolean) => {
      if (!hasMore || loading) return;

      try {
        cleanup();
        abortController.current = new AbortController();

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

        devLog('[useNotificationRefresh] Loaded more notifications:', moreNotifications.length);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load more notifications'
        );
      } finally {
        setLoading(false);
        cleanup();
      }
    },
    [pageSize, setNotifications, setHasMore, setLoading, setError, cleanup]
  );

  const refreshChannels = useCallback(async () => {
    try {
      const channelsData = await channelManager.getActiveChannels();
      setChannels(channelsData);

      devLog('[useNotificationRefresh] Refreshed channels:', channelsData.length);
    } catch (err) {
      devError('[useNotificationRefresh] Failed to refresh channels:', err);
    }
  }, [setChannels]);

  const refreshPreferences = useCallback(async () => {
    try {
      const prefsData = await preferencesManager.get();
      setPreferences(prefsData);

      devLog('[useNotificationRefresh] Refreshed preferences');
    } catch (err) {
      devError('[useNotificationRefresh] Failed to refresh preferences:', err);
    }
  }, [setPreferences]);

  return {
    refreshNotifications,
    loadMoreNotifications,
    refreshChannels,
    refreshPreferences,
    cleanup,
  };
};