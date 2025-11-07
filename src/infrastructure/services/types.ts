/**
 * Offline-First Notification Types
 * Uses expo-notifications for local device notifications
 * NO backend, NO user IDs, NO push notifications
 */

/**
 * Notification channel for managing notification delivery
 */
export interface NotificationChannel {
  id: string;
  channel_type: 'push' | 'in_app';
  channel_address: string;
  preferences: Record<string, any>;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

/**
 * Notification data structure
 */
export interface Notification {
  id: string;
  title: string;
  body: string;
  scheduled_for?: string;
  data?: Record<string, any>;
}

/**
 * User notification preferences
 */
export interface NotificationPreferences {
  push_enabled: boolean;
  quiet_hours: {
    enabled: boolean;
    start_time: string;
    end_time: string;
    timezone: string;
  };
  categories: Record<string, {
    push: boolean;
    in_app: boolean;
  }>;
}

/**
 * Trigger types for scheduling notifications
 */
export type NotificationTrigger =
  | { type: 'date'; date: Date }
  | { type: 'daily'; hour: number; minute: number }
  | { type: 'weekly'; weekday: number; hour: number; minute: number }
  | { type: 'monthly'; day: number; hour: number; minute: number };

/**
 * Options for scheduling a notification
 */
export interface ScheduleNotificationOptions {
  title: string;
  body: string;
  data?: Record<string, any>;
  trigger: NotificationTrigger;
  sound?: boolean | string;
  badge?: number;
  categoryIdentifier?: string;
}

/**
 * Scheduled notification details
 */
export interface ScheduledNotification {
  identifier: string;
  content: {
    title: string;
    body: string;
    data: Record<string, any>;
  };
  trigger: any;
}
