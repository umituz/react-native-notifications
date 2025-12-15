/**
 * Reminder Presets Configuration
 * Default time presets and frequency options for reminders
 */

import type { TimePreset, ReminderFrequency } from '../services/types';

// ============================================================================
// DEFAULT TIME PRESETS
// ============================================================================

export const DEFAULT_TIME_PRESETS: TimePreset[] = [
  {
    id: 'morning',
    hour: 8,
    minute: 0,
    labelKey: 'notifications.presets.morning',
    iconName: 'sunrise',
  },
  {
    id: 'noon',
    hour: 12,
    minute: 0,
    labelKey: 'notifications.presets.noon',
    iconName: 'sun',
  },
  {
    id: 'afternoon',
    hour: 15,
    minute: 0,
    labelKey: 'notifications.presets.afternoon',
    iconName: 'cloud-sun',
  },
  {
    id: 'evening',
    hour: 18,
    minute: 0,
    labelKey: 'notifications.presets.evening',
    iconName: 'sunset',
  },
  {
    id: 'night',
    hour: 21,
    minute: 0,
    labelKey: 'notifications.presets.night',
    iconName: 'moon',
  },
];

// ============================================================================
// FREQUENCY OPTIONS
// ============================================================================

export interface FrequencyOption {
  id: ReminderFrequency;
  labelKey: string;
  iconName: string;
}

export const FREQUENCY_OPTIONS: FrequencyOption[] = [
  {
    id: 'once',
    labelKey: 'notifications.frequency.once',
    iconName: 'calendar',
  },
  {
    id: 'daily',
    labelKey: 'notifications.frequency.daily',
    iconName: 'repeat',
  },
  {
    id: 'weekly',
    labelKey: 'notifications.frequency.weekly',
    iconName: 'calendar-days',
  },
  {
    id: 'monthly',
    labelKey: 'notifications.frequency.monthly',
    iconName: 'calendar-range',
  },
];

// ============================================================================
// WEEKDAY OPTIONS
// ============================================================================

export interface WeekdayOption {
  id: number;
  labelKey: string;
  shortLabelKey: string;
}

export const WEEKDAY_OPTIONS: WeekdayOption[] = [
  { id: 1, labelKey: 'notifications.weekdays.sunday', shortLabelKey: 'notifications.weekdays.sun' },
  { id: 2, labelKey: 'notifications.weekdays.monday', shortLabelKey: 'notifications.weekdays.mon' },
  { id: 3, labelKey: 'notifications.weekdays.tuesday', shortLabelKey: 'notifications.weekdays.tue' },
  { id: 4, labelKey: 'notifications.weekdays.wednesday', shortLabelKey: 'notifications.weekdays.wed' },
  { id: 5, labelKey: 'notifications.weekdays.thursday', shortLabelKey: 'notifications.weekdays.thu' },
  { id: 6, labelKey: 'notifications.weekdays.friday', shortLabelKey: 'notifications.weekdays.fri' },
  { id: 7, labelKey: 'notifications.weekdays.saturday', shortLabelKey: 'notifications.weekdays.sat' },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getTimePresetById = (id: string): TimePreset | undefined => {
  return DEFAULT_TIME_PRESETS.find(preset => preset.id === id);
};

export const formatTime = (hour: number, minute: number): string => {
  const h = hour.toString().padStart(2, '0');
  const m = minute.toString().padStart(2, '0');
  return `${h}:${m}`;
};

export const parseTime = (timeString: string): { hour: number; minute: number } => {
  const [hour, minute] = timeString.split(':').map(Number);
  return { hour: hour || 0, minute: minute || 0 };
};
