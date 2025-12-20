/**
 * useQuietHoursActions Hook
 * Manages quiet hours configuration
 */

import { useCallback } from 'react';
import { useRemindersStore, useQuietHours } from '../../../reminders/infrastructure/storage/RemindersStore';
import type { QuietHoursConfig } from '../../../../infrastructure/services/types';

export const useQuietHoursActions = () => {
  const quietHours = useQuietHours();
  const { updateQuietHours } = useRemindersStore();

  const setQuietHoursEnabled = useCallback(async (enabled: boolean): Promise<void> => {
    await updateQuietHours({ ...quietHours, enabled });
  }, [quietHours, updateQuietHours]);

  const setStartTime = useCallback(async (hour: number, minute: number): Promise<void> => {
    await updateQuietHours({ ...quietHours, startHour: hour, startMinute: minute });
  }, [quietHours, updateQuietHours]);

  const setEndTime = useCallback(async (hour: number, minute: number): Promise<void> => {
    await updateQuietHours({ ...quietHours, endHour: hour, endMinute: minute });
  }, [quietHours, updateQuietHours]);

  const setQuietHours = useCallback(async (config: QuietHoursConfig): Promise<void> => {
    await updateQuietHours(config);
  }, [updateQuietHours]);

  const isInQuietHours = useCallback((): boolean => {
    if (!quietHours.enabled) return false;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = quietHours.startHour * 60 + quietHours.startMinute;
    const endMinutes = quietHours.endHour * 60 + quietHours.endMinute;

    if (startMinutes <= endMinutes) {
      return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    }
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }, [quietHours]);

  return {
    quietHours,
    setQuietHoursEnabled,
    setStartTime,
    setEndTime,
    setQuietHours,
    isInQuietHours,
  };
};
