/**
 * Notifications Store - Zustand State Management
 * Simple offline-first notification state
 * NO backend, NO user IDs, NO notification history
 */

import { createStore } from '@umituz/react-native-storage';

interface NotificationsState {
  hasPermissions: boolean;
  isInitialized: boolean;
}

interface NotificationsActions {
  setPermissions: (granted: boolean) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useNotificationsStore = createStore<NotificationsState, NotificationsActions>({
  name: 'notifications-store',
  initialState: {
    hasPermissions: false,
    isInitialized: false,
  },
  persist: false,
  actions: (set) => ({
    setPermissions: (granted) => set({ hasPermissions: granted }),
    setInitialized: (initialized) => set({ isInitialized: initialized }),
  }),
});

/**
 * Hook for accessing notifications state
 */
export const useNotifications = () => {
  const store = useNotificationsStore();
  const { hasPermissions, isInitialized, setPermissions, setInitialized } = store;

  return {
    hasPermissions,
    isInitialized,
    setPermissions,
    setInitialized,
  };
};