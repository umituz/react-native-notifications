import { renderHook, act } from '@testing-library/react-hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotificationActions } from '../src/infrastructure/hooks/actions/useNotificationActions';
import { useNotificationsState } from '../src/infrastructure/hooks/state/useNotificationsState';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn(),
}));

// Mock services
jest.mock('../src/infrastructure/services/delivery/NotificationDelivery', () => ({
  NotificationDelivery: jest.fn().mockImplementation(() => ({
    deliver: jest.fn().mockResolvedValue(undefined),
  })),
}));

jest.mock('../src/infrastructure/services/channels/ChannelManager', () => ({
  ChannelManager: jest.fn().mockImplementation(() => ({
    register: jest.fn(),
    verify: jest.fn(),
  })),
}));

jest.mock('../src/infrastructure/services/preferences/PreferencesManager', () => ({
  PreferencesManager: jest.fn().mockImplementation(() => ({
    update: jest.fn().mockResolvedValue(true),
  })),
}));

describe('useNotificationActions', () => {
  let mockState: any;
  let mockSetters: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockState = {
      notifications: [],
      channels: [],
      unreadCount: 0,
      preferences: null,
      loading: false,
      error: null,
      hasMore: true,
    };

    mockSetters = {
      setNotifications: jest.fn(),
      setChannels: jest.fn(),
      setUnreadCount: jest.fn(),
      setPreferences: jest.fn(),
      setLoading: jest.fn(),
      setError: jest.fn(),
      setHasMore: jest.fn(),
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('[]');
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  describe('sendNotification', () => {
    it('should send a notification successfully', async () => {
      const { result } = renderHook(() => useNotificationActions(mockState, mockSetters));

      const options = {
        title: 'Test Notification',
        body: 'Test body',
        data: { key: 'value' },
      };

      let resultNotifications: any[] = [];
      await act(async () => {
        resultNotifications = await result.current.sendNotification(options);
      });

      expect(resultNotifications).toHaveLength(1);
      expect(resultNotifications[0]).toMatchObject({
        title: 'Test Notification',
        body: 'Test body',
        data: { key: 'value' },
        read: false,
      });
      expect(AsyncStorage.setItem).toHaveBeenCalled();
      expect(mockSetters.setError).toHaveBeenCalledWith(null);
    });

    it('should handle send notification errors', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));
      const { result } = renderHook(() => useNotificationActions(mockState, mockSetters));

      const options = {
        title: 'Test',
        body: 'Test',
      };

      let resultNotifications: any[] = [];
      await act(async () => {
        resultNotifications = await result.current.sendNotification(options);
      });

      expect(resultNotifications).toHaveLength(0);
      expect(mockSetters.setError).toHaveBeenCalledWith('Storage error');
    });

    it('should schedule notification with date', async () => {
      const { result } = renderHook(() => useNotificationActions(mockState, mockSetters));

      const scheduledDate = new Date('2025-01-15T09:00:00');
      const options = {
        title: 'Scheduled Notification',
        body: 'Test body',
        scheduled_for: scheduledDate,
      };

      await act(async () => {
        await result.current.sendNotification(options);
      });

      const notificationData = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(notificationData[0]).toMatchObject({
        scheduled_for: scheduledDate.toISOString(),
      });
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read successfully', async () => {
      const mockNotifications = [
        { id: 'notif-1', title: 'Test 1', read: false },
        { id: 'notif-2', title: 'Test 2', read: false },
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockNotifications));

      const { result } = renderHook(() => useNotificationActions(mockState, mockSetters));

      let success = false;
      await act(async () => {
        success = await result.current.markAsRead('notif-1');
      });

      expect(success).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
      expect(mockSetters.setUnreadCount).toHaveBeenCalledWith(0);
    });

    it('should handle mark as read errors', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Read error'));
      const { result } = renderHook(() => useNotificationActions(mockState, mockSetters));

      let success = false;
      await act(async () => {
        success = await result.current.markAsRead('notif-1');
      });

      expect(success).toBe(false);
      expect(mockSetters.setError).toHaveBeenCalledWith('Read error');
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      const mockNotifications = [
        { id: 'notif-1', title: 'Test 1', read: false },
        { id: 'notif-2', title: 'Test 2', read: false },
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockNotifications));

      const { result } = renderHook(() => useNotificationActions(mockState, mockSetters));

      let success = false;
      await act(async () => {
        success = await result.current.markAllAsRead();
      });

      expect(success).toBe(true);
      expect(mockSetters.setUnreadCount).toHaveBeenCalledWith(0);
      
      const savedData = JSON.parse((AsyncStorage.setItem as jest.Mock).mock.calls[0][1]);
      expect(savedData.every((n: any) => n.read)).toBe(true);
    });
  });
});