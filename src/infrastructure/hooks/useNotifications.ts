import { useEffect, useCallback } from 'react';
import { useNotificationsState } from './state/useNotificationsState';
import { useNotificationActions } from './actions/useNotificationActions';
import { useNotificationManagementActions } from './actions/useNotificationManagementActions';
import { useNotificationRefresh } from './utils/useNotificationRefresh';
import type { UseNotificationsOptions } from './types';
import { devLog } from '../utils/dev';

export * from './types';

export function useNotifications(userId: string, options: UseNotificationsOptions = {}) {
  const { autoRefresh = false, refreshInterval = 30000, pageSize = 20 } = options;

  const {
    state,
    setNotifications,
    setChannels,
    setUnreadCount,
    setPreferences,
    setLoading,
    setError,
    setHasMore,
  } = useNotificationsState();

  const setters = {
    setNotifications,
    setChannels,
    setUnreadCount,
    setPreferences,
    setLoading,
    setError,
    setHasMore,
  };

  const actions = useNotificationActions(state, setters);
  const managementActions = useNotificationManagementActions(state, setters);
  const refresh = useNotificationRefresh(pageSize, setters);

  const loadMoreNotifications = useCallback(() => 
    refresh.loadMoreNotifications(state.notifications.length, state.hasMore, state.loading),
    [refresh, state.notifications.length, state.hasMore, state.loading]
  );

  const cleanup = useCallback(() => {
    setNotifications([]);
    setChannels([]);
    setUnreadCount(0);
    setPreferences(null);
    setError(null);
    setLoading(false);
    setHasMore(true);

    devLog('[useNotifications] Cleaned up notification state');
  }, [setNotifications, setChannels, setUnreadCount, setPreferences, setError, setLoading, setHasMore]);

  // Load initial data
  useEffect(() => {
    if (userId) {
      refresh.refreshNotifications();
      refresh.refreshChannels();
      refresh.refreshPreferences();
    } else {
      cleanup();
    }
  }, [userId, cleanup]);

  // Auto-refresh setup with proper cleanup
  useEffect(() => {
    if (!autoRefresh || !userId) return;

    const interval = setInterval(() => {
      refresh.refreshNotifications();
    }, refreshInterval);

    return () => {
      clearInterval(interval);
      devLog('[useNotifications] Auto-refresh interval cleared');
    };
  }, [autoRefresh, userId, refreshInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      devLog('[useNotifications] Component unmounted, cleaning up');
    };
  }, []);

  return {
    ...state,
    ...actions,
    ...managementActions,
    ...refresh,
    loadMoreNotifications,
    cleanup,
  };
}