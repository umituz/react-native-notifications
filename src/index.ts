/**
 * Notifications Package - Public API
 * Offline-first local notifications using expo-notifications
 */

// ============================================================================
// TYPES
// ============================================================================

export type {
  NotificationTrigger,
  ScheduleNotificationOptions,
  ScheduledNotification,
  TimePreset,
  ReminderFrequency,
  Reminder,
  CreateReminderInput,
  UpdateReminderInput,
  QuietHoursConfig,
  NotificationPreferences,
  ReminderTranslations,
  QuietHoursTranslations,
  NotificationSettingsTranslations,
} from './infrastructure/services/types';

// ============================================================================
// CONFIGURATION
// ============================================================================

export { notificationsConfig } from './infrastructure/config/notificationsConfig';
export type {
  NotificationSetting,
  NotificationSection,
  NotificationsConfig,
} from './infrastructure/config/notificationsConfig';

export {
  DEFAULT_TIME_PRESETS,
  FREQUENCY_OPTIONS,
  WEEKDAY_OPTIONS,
  getTimePresetById,
  formatTime,
  parseTime,
} from './domains/reminders/infrastructure/config/reminderPresets';
export type { FrequencyOption, WeekdayOption } from './domains/reminders/infrastructure/config/reminderPresets';

// ============================================================================
// SERVICES
// ============================================================================

export { NotificationService, notificationService } from './infrastructure/services/NotificationService';
export { NotificationManager } from './infrastructure/services/NotificationManager';

// ============================================================================
// STORES
// ============================================================================

export { useNotificationsStore, useNotifications } from './infrastructure/storage/NotificationsStore';
export {
  useRemindersStore,
  useReminders,
  useEnabledReminders,
  useReminderById,
  useNotificationPreferences,
  useQuietHours,
  useRemindersLoading,
  useRemindersInitialized,
} from './domains/reminders/infrastructure/storage/RemindersStore';

// ============================================================================
// HOOKS
// ============================================================================

export { useNotificationSettings } from './infrastructure/hooks/useNotificationSettings';
export { useReminderActions } from './domains/reminders/infrastructure/hooks/useReminderActions';
export { useQuietHoursActions } from './domains/quietHours/infrastructure/hooks/useQuietHoursActions';
export { useNotificationSettingsUI } from './presentation/hooks/useNotificationSettingsUI';

// ============================================================================
// SCREENS
// ============================================================================

export { NotificationsScreen } from './presentation/screens/NotificationsScreen';
export type { NotificationsScreenProps } from './presentation/screens/NotificationsScreen';

export { NotificationSettingsScreen } from './presentation/screens/NotificationSettingsScreen';
export type { NotificationSettingsScreenProps } from './presentation/screens/NotificationSettingsScreen';

export { ReminderListScreen } from './domains/reminders/presentation/screens/ReminderListScreen';
export type { ReminderListScreenProps } from './domains/reminders/presentation/screens/ReminderListScreen';

// ============================================================================
// COMPONENTS
// ============================================================================

export { NotificationsSection } from './presentation/components/NotificationsSection';
export type { NotificationsSectionProps, NotificationsSectionConfig } from './presentation/components/NotificationsSection';

export { TimePresetSelector } from './domains/reminders/presentation/components/TimePresetSelector';
export type { TimePresetSelectorProps } from './domains/reminders/presentation/components/TimePresetSelector';

export { FrequencySelector } from './domains/reminders/presentation/components/FrequencySelector';
export type { FrequencySelectorProps } from './domains/reminders/presentation/components/FrequencySelector';

export { WeekdaySelector } from './domains/reminders/presentation/components/WeekdaySelector';
export type { WeekdaySelectorProps } from './domains/reminders/presentation/components/WeekdaySelector';

export { ReminderItem } from './domains/reminders/presentation/components/ReminderItem';
export type { ReminderItemProps, ReminderItemTranslations } from './domains/reminders/presentation/components/ReminderItem';

export { ReminderForm } from './domains/reminders/presentation/components/ReminderForm';
export type { ReminderFormProps, ReminderFormTranslations } from './domains/reminders/presentation/components/ReminderForm';

export { FormButton } from './domains/reminders/presentation/components/FormButton';
export type { FormButtonProps } from './domains/reminders/presentation/components/FormButton';

export { QuietHoursCard } from './domains/quietHours/presentation/components/QuietHoursCard';
export type { QuietHoursCardProps } from './domains/quietHours/presentation/components/QuietHoursCard';

export { SettingRow } from './presentation/components/SettingRow';
export type { SettingRowProps } from './presentation/components/SettingRow';
