/**
 * useReminderActions Hook
 * Handles reminder CRUD operations with notification scheduling
 */

import { useCallback } from 'react';
import { useRemindersStore } from '../storage/RemindersStore';
import { NotificationScheduler } from '../services/NotificationScheduler';
import type {
  Reminder,
  CreateReminderInput,
  UpdateReminderInput,
  NotificationTrigger,
} from '../services/types';

const scheduler = new NotificationScheduler();

const generateId = (): string => {
  return `reminder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const buildTrigger = (reminder: Reminder): NotificationTrigger => {
  switch (reminder.frequency) {
    case 'once':
      const date = new Date();
      date.setHours(reminder.hour, reminder.minute, 0, 0);
      if (date <= new Date()) {
        date.setDate(date.getDate() + 1);
      }
      return { type: 'date', date };

    case 'daily':
      return { type: 'daily', hour: reminder.hour, minute: reminder.minute };

    case 'weekly':
      return {
        type: 'weekly',
        weekday: reminder.weekday || 2,
        hour: reminder.hour,
        minute: reminder.minute,
      };

    case 'monthly':
      return {
        type: 'monthly',
        day: reminder.dayOfMonth || 1,
        hour: reminder.hour,
        minute: reminder.minute,
      };

    default:
      return { type: 'daily', hour: reminder.hour, minute: reminder.minute };
  }
};

export const useReminderActions = () => {
  const { addReminder, updateReminder, deleteReminder, toggleReminder } = useRemindersStore();

  const createReminder = useCallback(async (input: CreateReminderInput): Promise<Reminder> => {
    const now = new Date().toISOString();
    const reminder: Reminder = {
      id: generateId(),
      ...input,
      enabled: true,
      createdAt: now,
      updatedAt: now,
    };

    const trigger = buildTrigger(reminder);
    const notificationId = await scheduler.scheduleNotification({
      title: reminder.title,
      body: reminder.body,
      trigger,
      data: { reminderId: reminder.id },
    });

    reminder.notificationId = notificationId;
    await addReminder(reminder);

    return reminder;
  }, [addReminder]);

  const editReminder = useCallback(async (id: string, input: UpdateReminderInput): Promise<void> => {
    const { reminders } = useRemindersStore.getState();
    const existing = reminders.find(r => r.id === id);
    if (!existing) return;

    if (existing.notificationId) {
      await scheduler.cancelNotification(existing.notificationId);
    }

    const updated: Reminder = { ...existing, ...input, updatedAt: new Date().toISOString() };

    if (updated.enabled) {
      const trigger = buildTrigger(updated);
      const notificationId = await scheduler.scheduleNotification({
        title: updated.title,
        body: updated.body,
        trigger,
        data: { reminderId: updated.id },
      });
      updated.notificationId = notificationId;
    } else {
      updated.notificationId = undefined;
    }

    await updateReminder(id, updated);
  }, [updateReminder]);

  const removeReminder = useCallback(async (id: string): Promise<void> => {
    const { reminders } = useRemindersStore.getState();
    const reminder = reminders.find(r => r.id === id);

    if (reminder?.notificationId) {
      await scheduler.cancelNotification(reminder.notificationId);
    }

    await deleteReminder(id);
  }, [deleteReminder]);

  const toggleReminderEnabled = useCallback(async (id: string): Promise<void> => {
    const { reminders } = useRemindersStore.getState();
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return;

    if (reminder.enabled && reminder.notificationId) {
      await scheduler.cancelNotification(reminder.notificationId);
      await updateReminder(id, { enabled: false, notificationId: undefined });
    } else if (!reminder.enabled) {
      const trigger = buildTrigger(reminder);
      const notificationId = await scheduler.scheduleNotification({
        title: reminder.title,
        body: reminder.body,
        trigger,
        data: { reminderId: reminder.id },
      });
      await updateReminder(id, { enabled: true, notificationId });
    }
  }, [updateReminder]);

  return {
    createReminder,
    editReminder,
    removeReminder,
    toggleReminderEnabled,
  };
};
