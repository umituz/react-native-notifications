/**
 * Notifications Store - Zustand State Management
 * Simple offline-first notification state
 * NO backend, NO user IDs, NO notification history
 */

import { create } from 'zustand';

interface NotificationsStore {
  // State
  hasPermissions: boolean;
  isInitialized: boolean;

  // Actions
  setPermissions: (granted: boolean) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useNotificationsStore = create<NotificationsStore>((set) => ({
  hasPermissions: false,
  isInitialized: false,

  setPermissions: (granted) => set({ hasPermissions: granted }),
  setInitialized: (initialized) => set({ isInitialized: initialized }),
}));

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