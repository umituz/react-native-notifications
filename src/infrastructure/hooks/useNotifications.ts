import { useEffect } from 'react';
import { useNotificationsState } from './state/useNotificationsState';
import { useNotificationActions } from './actions/useNotificationActions';
import { useNotificationRefresh } from './utils/useNotificationRefresh';
import type { UseNotificationsOptions } from './types';

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
  const refresh = useNotificationRefresh(pageSize, setters);

  const loadMoreNotifications = () => 
    refresh.loadMoreNotifications(state.notifications.length, state.hasMore, state.loading);

  // Load initial data
  useEffect(() => {
    if (userId) {
      refresh.refreshNotifications();
      refresh.refreshChannels();
      refresh.refreshPreferences();
    } else {
      setNotifications([]);
      setChannels([]);
      setUnreadCount(0);
      setPreferences(null);
    }
  }, [userId]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh || !userId) return;

    const interval = setInterval(() => {
      refresh.refreshNotifications();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, userId, refreshInterval]);

  return {
    ...state,
    ...actions,
    ...refresh,
    loadMoreNotifications,
  };
}
