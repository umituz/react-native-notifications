/**
 * Notifications Domain - Public API
 * Offline-first local notifications using expo-notifications
 * NO backend, NO user IDs, NO push notifications
 */

// ============================================================================
// INFRASTRUCTURE LAYER EXPORTS
// ============================================================================

// Types
export type {
  NotificationTrigger,
  ScheduleNotificationOptions,
  ScheduledNotification,
} from './infrastructure/services/types';

// Configuration
export { notificationsConfig } from './infrastructure/config/notificationsConfig';
export type {
  NotificationSetting,
  NotificationSection,
  NotificationsConfig,
} from './infrastructure/config/notificationsConfig';

// State Store (Zustand)
export { useNotificationsStore, useNotifications } from './infrastructure/storage/NotificationsStore';

// Services
export { NotificationService, notificationService } from './infrastructure/services/NotificationService';
export { NotificationManager } from './infrastructure/services/NotificationManager';

// Hooks
export { useNotificationSettings } from './infrastructure/hooks/useNotificationSettings';

// ============================================================================
// PRESENTATION LAYER EXPORTS
// ============================================================================

// Screens
export { NotificationsScreen } from './presentation/screens/NotificationsScreen';
