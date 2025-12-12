import { renderHook, act } from '@testing-library/react-hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotificationRefresh } from '../src/infrastructure/hooks/utils/useNotificationRefresh';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock services
jest.mock('../src/infrastructure/services/channels/ChannelManager', () => ({
  ChannelManager: jest.fn().mockImplementation(() => ({
    getActiveChannels: jest.fn().mockResolvedValue([]),
  })),
}));

jest.mock('../src/infrastructure/services/preferences/PreferencesManager', () => ({
  PreferencesManager: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockResolvedValue(null),
  })),
}));

describe('useNotificationRefresh', () => {
  let mockSetters: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
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
  });

  describe('refreshNotifications', () => {
    it('should refresh notifications successfully', async () => {
      const mockNotifications = [
        { id: 'notif-1', title: 'Test 1', read: false },
        { id: 'notif-2', title: 'Test 2', read: true },
        { id: 'notif-3', title: 'Test 3', read: false },
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockNotifications));

      const { result } = renderHook(() => useNotificationRefresh(2, mockSetters));

      await act(async () => {
        await result.current.refreshNotifications();
      });

      expect(mockSetters.setLoading).toHaveBeenCalledWith(true);
      expect(mockSetters.setError).toHaveBeenCalledWith(null);
      expect(mockSetters.setNotifications).toHaveBeenCalledWith(mockNotifications.slice(0, 2));
      expect(mockSetters.setUnreadCount).toHaveBeenCalledWith(2);
      expect(mockSetters.setHasMore).toHaveBeenCalledWith(true);
      expect(mockSetters.setLoading).toHaveBeenCalledWith(false);
    });

    it('should handle empty notifications list', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('[]');

      const { result } = renderHook(() => useNotificationRefresh(10, mockSetters));

      await act(async () => {
        await result.current.refreshNotifications();
      });

      expect(mockSetters.setNotifications).toHaveBeenCalledWith([]);
      expect(mockSetters.setUnreadCount).toHaveBeenCalledWith(0);
      expect(mockSetters.setHasMore).toHaveBeenCalledWith(false);
    });

    it('should handle refresh errors', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Refresh error'));

      const { result } = renderHook(() => useNotificationRefresh(10, mockSetters));

      await act(async () => {
        await result.current.refreshNotifications();
      });

      expect(mockSetters.setError).toHaveBeenCalledWith('Refresh error');
      expect(mockSetters.setLoading).toHaveBeenCalledWith(false);
    });
  });

  describe('loadMoreNotifications', () => {
    it('should load more notifications', async () => {
      const mockNotifications = Array.from({ length: 15 }, (_, i) => ({
        id: `notif-${i}`,
        title: `Test ${i}`,
        read: false,
      }));
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockNotifications));

      const { result } = renderHook(() => useNotificationRefresh(5, mockSetters));

      // First load
      await act(async () => {
        await result.current.refreshNotifications();
      });

      // Load more
      await act(async () => {
        await result.current.loadMoreNotifications(5, true, false);
      });

      expect(mockSetters.setNotifications).toHaveBeenCalledTimes(2);
      expect(mockSetters.setHasMore).toHaveBeenCalledWith(true);
    });

    it('should not load more if no more notifications', async () => {
      const { result } = renderHook(() => useNotificationRefresh(10, mockSetters));

      await act(async () => {
        await result.current.loadMoreNotifications(5, false, false);
      });

      expect(mockSetters.setNotifications).not.toHaveBeenCalled();
    });

    it('should not load more if already loading', async () => {
      const { result } = renderHook(() => useNotificationRefresh(10, mockSetters));

      await act(async () => {
        await result.current.loadMoreNotifications(5, true, true);
      });

      expect(mockSetters.setNotifications).not.toHaveBeenCalled();
    });
  });

  describe('refreshChannels', () => {
    it('should refresh channels successfully', async () => {
      const mockChannels = [
        { id: 'channel-1', name: 'Channel 1' },
        { id: 'channel-2', name: 'Channel 2' },
      ];

      const { result } = renderHook(() => useNotificationRefresh(10, mockSetters));

      await act(async () => {
        await result.current.refreshChannels();
      });

      expect(mockSetters.setChannels).toHaveBeenCalledWith(mockChannels);
    });

    it('should handle channel refresh errors silently', async () => {
      const ChannelManager = require('../src/infrastructure/services/channels/ChannelManager').ChannelManager;
      ChannelManager.mockImplementation(() => ({
        getActiveChannels: jest.fn().mockRejectedValue(new Error('Channel error')),
      }));

      const { result } = renderHook(() => useNotificationRefresh(10, mockSetters));

      await act(async () => {
        await result.current.refreshChannels();
      });

      expect(mockSetters.setChannels).not.toHaveBeenCalled();
    });
  });

  describe('refreshPreferences', () => {
    it('should refresh preferences successfully', async () => {
      const mockPreferences = { enabled: true, sound: false };

      const { result } = renderHook(() => useNotificationRefresh(10, mockSetters));

      await act(async () => {
        await result.current.refreshPreferences();
      });

      expect(mockSetters.setPreferences).toHaveBeenCalledWith(mockPreferences);
    });

    it('should handle preferences refresh errors silently', async () => {
      const PreferencesManager = require('../src/infrastructure/services/preferences/PreferencesManager').PreferencesManager;
      PreferencesManager.mockImplementation(() => ({
        get: jest.fn().mockRejectedValue(new Error('Preferences error')),
      }));

      const { result } = renderHook(() => useNotificationRefresh(10, mockSetters));

      await act(async () => {
        await result.current.refreshPreferences();
      });

      expect(mockSetters.setPreferences).not.toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('should cleanup properly', async () => {
      const { result } = renderHook(() => useNotificationRefresh(10, mockSetters));

      await act(async () => {
        result.current.cleanup();
      });

      // Should not throw any errors
      expect(true).toBe(true);
    });
  });
});