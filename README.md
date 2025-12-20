# @umituz/react-native-notifications

Offline-first local notifications system for React Native apps using expo-notifications.

## Installation

```bash
npm install @umituz/react-native-notifications
```

## Peer Dependencies

- `react` >= 18.2.0
- `react-native` >= 0.74.0
- `expo-notifications` ~0.28.0
- `expo-device` ~6.0.2
- `@react-native-async-storage/async-storage` >= 1.21.0
- `zustand` >= 5.0.2

## Features

- ✅ Offline-first local notifications
- ✅ Schedule notifications for specific dates/times
- ✅ Repeating notifications (daily, weekly, monthly)
- ✅ Android notification channels
- ✅ Permission handling
- ✅ Cancel individual or all notifications
- ✅ Works completely offline (no backend required)
- ✅ Zustand state management

## Usage

### Basic Usage

```typescript
import { NotificationService, useNotificationSettings } from '@umituz/react-native-notifications';

// Request permissions
const hasPermissions = await NotificationService.getInstance().requestPermissions();

// Schedule a notification
const notificationId = await notificationService.notifications.scheduleNotification({
  title: 'Reminder',
  body: 'Don\'t forget to check your tasks!',
  trigger: { type: 'date', date: new Date('2025-01-15T09:00:00') }
});

// Daily reminder
const dailyId = await notificationService.notifications.scheduleNotification({
  title: 'Daily Workout',
  body: 'Time for your morning workout!',
  trigger: { type: 'daily', hour: 7, minute: 0 }
});
```

### Using Hooks

```typescript
import { useNotificationSettings, useNotificationsStore } from '@umituz/react-native-notifications';

const MyComponent = () => {
  const { notificationsEnabled, setNotificationsEnabled } = useNotificationSettings();
  const { hasPermissions } = useNotificationsStore();

  return (
    <Switch
      value={notificationsEnabled}
      onValueChange={setNotificationsEnabled}
    />
  );
};
```

## API

### NotificationService

- `requestPermissions()`: Request notification permissions
- `hasPermissions()`: Check if permissions are granted
- `notifications.scheduleNotification(options)`: Schedule a notification
- `notifications.cancelNotification(id)`: Cancel a notification
- `notifications.cancelAllNotifications()`: Cancel all notifications
- `notifications.getScheduledNotifications()`: Get all scheduled notifications

### Hooks

- `useNotificationSettings()`: Manage notification settings
- `useNotificationsStore()`: Access notification state

## License

MIT

