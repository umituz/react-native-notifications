/**
 * Notifications Configuration
 * Defines notification settings structure
 */

export interface NotificationSetting {
  id: string;
  titleKey: string;
  descKey: string;
  icon: string;
}

export interface NotificationSection {
  id: string;
  titleKey: string;
  settings: NotificationSetting[];
}

export interface NotificationsConfig {
  sections: NotificationSection[];
}

export const notificationsConfig: NotificationsConfig = {
  sections: [
    {
      id: 'channels',
      titleKey: 'notifications.channels',
      settings: [
        {
          id: 'pushNotifications',
          titleKey: 'notifications.push',
          descKey: 'notifications.pushDesc',
          icon: 'notifications',
        },
        {
          id: 'emailNotifications',
          titleKey: 'notifications.email',
          descKey: 'notifications.emailDesc',
          icon: 'email',
        },
        {
          id: 'smsNotifications',
          titleKey: 'notifications.sms',
          descKey: 'notifications.smsDesc',
          icon: 'message',
        },
      ],
    },
    {
      id: 'content',
      titleKey: 'notifications.content',
      settings: [
        {
          id: 'appUpdates',
          titleKey: 'notifications.updates',
          descKey: 'notifications.updatesDesc',
          icon: 'update',
        },
        {
          id: 'features',
          titleKey: 'notifications.features',
          descKey: 'notifications.featuresDesc',
          icon: 'new-releases',
        },
        {
          id: 'tips',
          titleKey: 'notifications.tips',
          descKey: 'notifications.tipsDesc',
          icon: 'tips-and-updates',
        },
      ],
    },
    {
      id: 'activity',
      titleKey: 'notifications.activity',
      settings: [
        {
          id: 'reminders',
          titleKey: 'notifications.reminders',
          descKey: 'notifications.remindersDesc',
          icon: 'alarm',
        },
        {
          id: 'achievements',
          titleKey: 'notifications.achievements',
          descKey: 'notifications.achievementsDesc',
          icon: 'emoji-events',
        },
        {
          id: 'social',
          titleKey: 'notifications.social',
          descKey: 'notifications.socialDesc',
          icon: 'people',
        },
      ],
    },
  ],
};
