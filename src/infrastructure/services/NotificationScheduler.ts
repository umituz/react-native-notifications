import * as Notifications from 'expo-notifications';
import type { NotificationTrigger, ScheduleNotificationOptions, ScheduledNotification } from './NotificationManager';

export class NotificationScheduler {
  async scheduleNotification(options: ScheduleNotificationOptions): Promise<string> {
    const { title, body, data = {}, trigger, sound = true, badge, categoryIdentifier } = options;

    let notificationTrigger: any;

    if (trigger.type === 'date') {
      notificationTrigger = {
        date: trigger.date,
        channelId: categoryIdentifier || 'default',
      };
    } else if (trigger.type === 'daily') {
      notificationTrigger = {
        hour: trigger.hour,
        minute: trigger.minute,
        repeats: true,
        channelId: categoryIdentifier || 'reminders',
      };
    } else if (trigger.type === 'weekly') {
      notificationTrigger = {
        weekday: trigger.weekday,
        hour: trigger.hour,
        minute: trigger.minute,
        repeats: true,
        channelId: categoryIdentifier || 'reminders',
      };
    } else if (trigger.type === 'monthly') {
      notificationTrigger = {
        day: trigger.day,
        hour: trigger.hour,
        minute: trigger.minute,
        repeats: true,
        channelId: categoryIdentifier || 'reminders',
      };
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: sound === true ? 'default' : sound || undefined,
        badge,
        categoryIdentifier,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        vibrate: [0, 250, 250, 250],
      },
      trigger: notificationTrigger,
    });

    return notificationId;
  }

  async cancelNotification(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async getScheduledNotifications(): Promise<ScheduledNotification[]> {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    return notifications.map(notification => ({
      identifier: notification.identifier,
      content: {
        title: notification.content.title || '',
        body: notification.content.body || '',
        data: notification.content.data as Record<string, any>,
      },
      trigger: notification.trigger,
    }));
  }
}