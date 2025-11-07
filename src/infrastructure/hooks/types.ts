/**
 * Notification Hook Types - Offline-First
 *
 * All types for offline local notifications.
 * NO backend dependencies.
 */

/**
 * Local notification entity
 */
export interface Notification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  scheduled_for?: string;
  created_at: string;
  read: boolean;
}

/**
 * Notification channel (push or in-app only)
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
 * Notification preferences
 */
export interface NotificationPreferences {
  push_enabled: boolean;
  quiet_hours: {
    enabled: boolean;
    start_time: string;
    end_time: string;
    timezone: string;
  };
  categories: {
    reminders: { push: boolean; in_app: boolean };
    updates: { push: boolean; in_app: boolean };
    alerts: { push: boolean; in_app: boolean };
  };
}

/**
 * Options for sending notification
 */
export interface SendNotificationOptions {
  title: string;
  body: string;
  data?: Record<string, any>;
  scheduled_for?: Date;
  category?: 'reminders' | 'updates' | 'alerts';
}

/**
 * State for useNotifications hook
 */
export interface NotificationsState {
  notifications: Notification[];
  channels: NotificationChannel[];
  unreadCount: number;
  preferences: NotificationPreferences | null;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

/**
 * Options for useNotifications hook
 */
export interface UseNotificationsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  pageSize?: number;
}
