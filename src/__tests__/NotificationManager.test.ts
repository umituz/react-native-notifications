import { NotificationManager } from '../src/infrastructure/services/NotificationManager';
import type { ScheduleNotificationOptions } from '../src/infrastructure/services/NotificationManager';

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  getAllScheduledNotificationsAsync: jest.fn(),
  dismissAllNotificationsAsync: jest.fn(),
  getBadgeCountAsync: jest.fn(),
  setBadgeCountAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  AndroidImportance: {
    DEFAULT: 'default',
    HIGH: 'high',
    MAX: 'max',
  },
  AndroidNotificationPriority: {
    DEFAULT: 'default',
    HIGH: 'high',
  },
}));

// Mock expo-device
jest.mock('expo-device', () => ({
  isDevice: true,
}));

// Mock react-native
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

describe('NotificationManager', () => {
  let manager: NotificationManager;

  beforeEach(() => {
    manager = new NotificationManager();
    jest.clearAllMocks();
  });

  describe('scheduleNotification', () => {
    it('should schedule a notification with date trigger', async () => {
      const mockSchedule = require('expo-notifications').scheduleNotificationAsync;
      mockSchedule.mockResolvedValue('test-id');

      const options: ScheduleNotificationOptions = {
        title: 'Test Notification',
        body: 'Test body',
        trigger: { type: 'date', date: new Date('2025-01-15T09:00:00') },
      };

      const result = await manager.scheduleNotification(options);

      expect(result).toBe('test-id');
      expect(mockSchedule).toHaveBeenCalledWith({
        content: {
          title: 'Test Notification',
          body: 'Test body',
          data: {},
          sound: 'default',
          priority: 'HIGH',
          vibrate: [0, 250, 250, 250],
        },
        trigger: {
          date: new Date('2025-01-15T09:00:00'),
          channelId: 'default',
        },
      });
    });

    it('should schedule a daily notification', async () => {
      const mockSchedule = require('expo-notifications').scheduleNotificationAsync;
      mockSchedule.mockResolvedValue('daily-id');

      const options: ScheduleNotificationOptions = {
        title: 'Daily Reminder',
        body: 'Time for daily task',
        trigger: { type: 'daily', hour: 9, minute: 0 },
      };

      const result = await manager.scheduleNotification(options);

      expect(result).toBe('daily-id');
      expect(mockSchedule).toHaveBeenCalledWith({
        content: expect.objectContaining({
          title: 'Daily Reminder',
          body: 'Time for daily task',
        }),
        trigger: {
          hour: 9,
          minute: 0,
          repeats: true,
          channelId: 'reminders',
        },
      });
    });

    it('should handle scheduling errors', async () => {
      const mockSchedule = require('expo-notifications').scheduleNotificationAsync;
      mockSchedule.mockRejectedValue(new Error('Scheduling failed'));

      const options: ScheduleNotificationOptions = {
        title: 'Test',
        body: 'Test',
        trigger: { type: 'date', date: new Date() },
      };

      await expect(manager.scheduleNotification(options)).rejects.toThrow('Scheduling failed');
    });
  });

  describe('cancelNotification', () => {
    it('should cancel a scheduled notification', async () => {
      const mockCancel = require('expo-notifications').cancelScheduledNotificationAsync;
      mockCancel.mockResolvedValue(undefined);

      await manager.cancelNotification('test-id');

      expect(mockCancel).toHaveBeenCalledWith('test-id');
    });

    it('should handle cancellation errors', async () => {
      const mockCancel = require('expo-notifications').cancelScheduledNotificationAsync;
      mockCancel.mockRejectedValue(new Error('Cancel failed'));

      await expect(manager.cancelNotification('test-id')).rejects.toThrow('Cancel failed');
    });
  });

  describe('getScheduledNotifications', () => {
    it('should return scheduled notifications', async () => {
      const mockGetAll = require('expo-notifications').getAllScheduledNotificationsAsync;
      mockGetAll.mockResolvedValue([
        {
          identifier: 'test-id',
          content: {
            title: 'Test',
            body: 'Test body',
            data: { key: 'value' },
          },
          trigger: { type: 'date' },
        },
      ]);

      const result = await manager.getScheduledNotifications();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        identifier: 'test-id',
        content: {
          title: 'Test',
          body: 'Test body',
          data: { key: 'value' },
        },
        trigger: { type: 'date' },
      });
    });

    it('should handle empty notifications list', async () => {
      const mockGetAll = require('expo-notifications').getAllScheduledNotificationsAsync;
      mockGetAll.mockResolvedValue([]);

      const result = await manager.getScheduledNotifications();

      expect(result).toHaveLength(0);
    });

    it('should handle errors gracefully', async () => {
      const mockGetAll = require('expo-notifications').getAllScheduledNotificationsAsync;
      mockGetAll.mockRejectedValue(new Error('Fetch failed'));

      const result = await manager.getScheduledNotifications();

      expect(result).toHaveLength(0);
    });
  });

  describe('badge management', () => {
    it('should get badge count on iOS', async () => {
      const mockGetBadge = require('expo-notifications').getBadgeCountAsync;
      mockGetBadge.mockResolvedValue(5);

      const result = await manager.getBadgeCount();

      expect(result).toBe(5);
      expect(mockGetBadge).toHaveBeenCalled();
    });

    it('should return 0 on Android', async () => {
      jest.doMock('react-native', () => ({
        Platform: { OS: 'android' },
      }));

      const result = await manager.getBadgeCount();

      expect(result).toBe(0);
    });

    it('should set badge count on iOS', async () => {
      const mockSetBadge = require('expo-notifications').setBadgeCountAsync;
      mockSetBadge.mockResolvedValue(undefined);

      await manager.setBadgeCount(3);

      expect(mockSetBadge).toHaveBeenCalledWith(3);
    });
  });
});