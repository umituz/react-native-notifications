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
} from './infrastructure/config/reminderPresets';
export type { FrequencyOption, WeekdayOption } from './infrastructure/config/reminderPresets';

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
} from './infrastructure/storage/RemindersStore';

// ============================================================================
// HOOKS
// ============================================================================

export { useNotificationSettings } from './infrastructure/hooks/useNotificationSettings';
export { useReminderActions } from './infrastructure/hooks/useReminderActions';
export { useQuietHoursActions } from './infrastructure/hooks/useQuietHoursActions';

// ============================================================================
// SCREENS
// ============================================================================

export { NotificationsScreen } from './presentation/screens/NotificationsScreen';
export type { NotificationsScreenProps } from './presentation/screens/NotificationsScreen';

export { NotificationSettingsScreen } from './presentation/screens/NotificationSettingsScreen';
export type { NotificationSettingsScreenProps } from './presentation/screens/NotificationSettingsScreen';

export { ReminderListScreen } from './presentation/screens/ReminderListScreen';
export type { ReminderListScreenProps } from './presentation/screens/ReminderListScreen';

// ============================================================================
// COMPONENTS
// ============================================================================

export { NotificationsSection } from './presentation/components/NotificationsSection';
export type { NotificationsSectionProps, NotificationsSectionConfig } from './presentation/components/NotificationsSection';

export { TimePresetSelector } from './presentation/components/TimePresetSelector';
export type { TimePresetSelectorProps } from './presentation/components/TimePresetSelector';

export { FrequencySelector } from './presentation/components/FrequencySelector';
export type { FrequencySelectorProps } from './presentation/components/FrequencySelector';

export { WeekdaySelector } from './presentation/components/WeekdaySelector';
export type { WeekdaySelectorProps } from './presentation/components/WeekdaySelector';

export { ReminderItem } from './presentation/components/ReminderItem';
export type { ReminderItemProps, ReminderItemTranslations } from './presentation/components/ReminderItem';

export { ReminderForm } from './presentation/components/ReminderForm';
export type { ReminderFormProps, ReminderFormTranslations } from './presentation/components/ReminderForm';

export { FormButton } from './presentation/components/FormButton';
export type { FormButtonProps } from './presentation/components/FormButton';

export { QuietHoursCard } from './presentation/components/QuietHoursCard';
export type { QuietHoursCardProps } from './presentation/components/QuietHoursCard';
