import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'notifications_enabled';

/**
 * Simple notification settings hook
 * Manages a single toggle for enabling/disabling notifications
 */
export const useNotificationSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const value = await AsyncStorage.getItem(STORAGE_KEY);
        if (value !== null) {
          setNotificationsEnabled(value === 'true');
        }
      } catch (error) {
        // Silent failure - use default value
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, value.toString());
    } catch (error) {
      // Silent failure
    }
  };

  return {
    notificationsEnabled,
    setNotificationsEnabled: toggleNotifications,
    isLoading,
  };
};
