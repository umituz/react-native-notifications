/**
 * Offline-First Notification Types
 * Uses expo-notifications for local device notifications
 */

// ============================================================================
// NOTIFICATION CHANNEL TYPES
// ============================================================================

export interface NotificationChannel {
  id: string;
  channel_type: 'push' | 'in_app';
  channel_address: string;
  preferences: Record<string, unknown>;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

// ============================================================================
// NOTIFICATION TRIGGER TYPES
// ============================================================================

export type NotificationTrigger =
  | { type: 'date'; date: Date }
  | { type: 'daily'; hour: number; minute: number }
  | { type: 'weekly'; weekday: number; hour: number; minute: number }
  | { type: 'monthly'; day: number; hour: number; minute: number };

export interface ScheduleNotificationOptions {
  title: string;
  body: string;
  data?: Record<string, unknown>;
  trigger: NotificationTrigger;
  sound?: boolean | string;
  badge?: number;
  categoryIdentifier?: string;
}

export interface ScheduledNotification {
  identifier: string;
  content: {
    title: string;
    body: string;
    data: Record<string, unknown>;
  };
  trigger: unknown;
}

// ============================================================================
// TIME PRESET TYPES
// ============================================================================

export interface TimePreset {
  id: string;
  hour: number;
  minute: number;
  labelKey: string;
  iconName: string;
}

// ============================================================================
// REMINDER TYPES
// ============================================================================

export type ReminderFrequency = 'once' | 'daily' | 'weekly' | 'monthly';

export interface Reminder {
  id: string;
  title: string;
  body: string;
  frequency: ReminderFrequency;
  timePresetId?: string;
  hour: number;
  minute: number;
  weekday?: number;
  dayOfMonth?: number;
  enabled: boolean;
  notificationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReminderInput {
  title: string;
  body: string;
  frequency: ReminderFrequency;
  timePresetId?: string;
  hour: number;
  minute: number;
  weekday?: number;
  dayOfMonth?: number;
}

export interface UpdateReminderInput {
  title?: string;
  body?: string;
  frequency?: ReminderFrequency;
  timePresetId?: string;
  hour?: number;
  minute?: number;
  weekday?: number;
  dayOfMonth?: number;
  enabled?: boolean;
}

// ============================================================================
// QUIET HOURS TYPES
// ============================================================================

export interface QuietHoursConfig {
  enabled: boolean;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

// ============================================================================
// NOTIFICATION PREFERENCES
// ============================================================================

export interface NotificationPreferences {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  quietHours: QuietHoursConfig;
}

// ============================================================================
// SCREEN CONFIGURATION TYPES
// ============================================================================

export interface ReminderTranslations {
  screenTitle: string;
  emptyTitle: string;
  emptyDescription: string;
  addButtonLabel: string;
  editButtonLabel: string;
  deleteButtonLabel: string;
  enabledLabel: string;
  disabledLabel: string;
  frequencyOnce: string;
  frequencyDaily: string;
  frequencyWeekly: string;
  frequencyMonthly: string;
  timeLabel: string;
  titlePlaceholder: string;
  bodyPlaceholder: string;
  saveButtonLabel: string;
  cancelButtonLabel: string;
}

export interface QuietHoursTranslations {
  title: string;
  description: string;
  startTimeLabel: string;
  endTimeLabel: string;
  enabledLabel: string;
}

export interface NotificationSettingsTranslations {
  screenTitle: string;
  masterToggleTitle: string;
  masterToggleDescription: string;
  soundTitle: string;
  soundDescription: string;
  vibrationTitle: string;
  vibrationDescription: string;
  remindersTitle: string;
  remindersDescription: string;
  quietHoursTitle: string;
  quietHoursDescription: string;
}
