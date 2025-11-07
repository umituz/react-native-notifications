import { useState } from 'react';
import type { NotificationsState } from '../types';

export const useNotificationsState = () => {
  const [state, setState] = useState<NotificationsState>({
    notifications: [],
    channels: [],
    unreadCount: 0,
    preferences: null,
    loading: false,
    error: null,
    hasMore: true,
  });

  const setNotifications = (notifications: NotificationsState['notifications']) =>
    setState(prev => ({ ...prev, notifications }));

  const setChannels = (channels: NotificationsState['channels']) =>
    setState(prev => ({ ...prev, channels }));

  const setUnreadCount = (unreadCount: number) =>
    setState(prev => ({ ...prev, unreadCount }));

  const setPreferences = (preferences: NotificationsState['preferences']) =>
    setState(prev => ({ ...prev, preferences }));

  const setLoading = (loading: boolean) =>
    setState(prev => ({ ...prev, loading }));

  const setError = (error: string | null) =>
    setState(prev => ({ ...prev, error }));

  const setHasMore = (hasMore: boolean) =>
    setState(prev => ({ ...prev, hasMore }));

  return {
    state,
    setNotifications,
    setChannels,
    setUnreadCount,
    setPreferences,
    setLoading,
    setError,
    setHasMore,
  };
};
