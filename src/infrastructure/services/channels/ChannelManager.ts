import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import type { NotificationChannel } from '../types';

/**
 * ChannelManager - Offline Notification Channel Management
 *
 * Manages push notification tokens and preferences in AsyncStorage.
 * Only supports local push and in-app notifications.
 *
 * NO backend, NO email/SMS - pure offline.
 */
export class ChannelManager {
  private static STORAGE_KEY = '@notifications:channels';

  async register(
    channelType: 'push' | 'in_app',
    preferences: Record<string, any> = {}
  ): Promise<NotificationChannel | null> {
    try {
      // Get push token for local notifications
      const token =
        channelType === 'push'
          ? (await Notifications.getExpoPushTokenAsync()).data
          : 'in_app';

      const channel: NotificationChannel = {
        id: `${channelType}_${Date.now()}`,
        channel_type: channelType,
        channel_address: token,
        preferences,
        is_verified: true, // Local channels always verified
        is_active: true,
        created_at: new Date().toISOString(),
      };

      // Store in AsyncStorage
      const channels = await this.getAllChannels();
      channels.push(channel);
      await AsyncStorage.setItem(
        ChannelManager.STORAGE_KEY,
        JSON.stringify(channels)
      );

      return channel;
    } catch (error) {
      return null;
    }
  }

  async verify(channelId: string): Promise<boolean> {
    try {
      const channels = await this.getAllChannels();
      const index = channels.findIndex((c) => c.id === channelId);

      if (index !== -1) {
        channels[index].is_verified = true;
        await AsyncStorage.setItem(
          ChannelManager.STORAGE_KEY,
          JSON.stringify(channels)
        );
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  async getActiveChannels(): Promise<NotificationChannel[]> {
    try {
      const channels = await this.getAllChannels();
      return channels.filter((c) => c.is_active && c.is_verified);
    } catch (error) {
      return [];
    }
  }

  private async getAllChannels(): Promise<NotificationChannel[]> {
    try {
      const data = await AsyncStorage.getItem(ChannelManager.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  private async update(
    channelId: string,
    updates: Partial<NotificationChannel>
  ): Promise<NotificationChannel | null> {
    try {
      const channels = await this.getAllChannels();
      const index = channels.findIndex((c) => c.id === channelId);

      if (index !== -1) {
        channels[index] = { ...channels[index], ...updates };
        await AsyncStorage.setItem(
          ChannelManager.STORAGE_KEY,
          JSON.stringify(channels)
        );
        return channels[index];
      }

      return null;
    } catch (error) {
      return null;
    }
  }
}
