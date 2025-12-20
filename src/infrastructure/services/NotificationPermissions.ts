import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { devWarn, devError, devLog } from '../utils/dev';

export class NotificationPermissions {
  async requestPermissions(): Promise<boolean> {
    try {
      if (!Device.isDevice) {
        devWarn('[NotificationPermissions] Notifications only work on physical devices');
        return false;
      }

      const permissionsResponse = await Notifications.getPermissionsAsync();
      const existingStatus = (permissionsResponse as any).status || ((permissionsResponse as any).granted ? 'granted' : 'denied');
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const requestResponse = await Notifications.requestPermissionsAsync();
        finalStatus = (requestResponse as any).status || ((requestResponse as any).granted ? 'granted' : 'denied');
      }

      if (Platform.OS === 'android') {
        await this.createAndroidChannels();
      }

      return finalStatus === 'granted';
    } catch (error) {
      devError('[NotificationPermissions] Permission request failed:', error);
      return false;
    }
  }

  async hasPermissions(): Promise<boolean> {
    try {
      if (!Device.isDevice) return false;
      const permissionsResponse = await Notifications.getPermissionsAsync();
      return (permissionsResponse as any).status === 'granted' || (permissionsResponse as any).granted === true;
    } catch (error) {
      devError('[NotificationPermissions] Permission check failed:', error);
      return false;
    }
  }

  private async createAndroidChannels(): Promise<void> {
    if (Platform.OS !== 'android') return;

    try {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        sound: 'default',
        lightColor: '#3B82F6',
      });

      await Notifications.setNotificationChannelAsync('reminders', {
        name: 'Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        sound: 'default',
        lightColor: '#3B82F6',
        enableVibrate: true,
      });

      await Notifications.setNotificationChannelAsync('urgent', {
        name: 'Urgent',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 250, 500],
        sound: 'default',
        lightColor: '#EF4444',
        enableVibrate: true,
      });

      devLog('[NotificationPermissions] Android channels created');
    } catch (error) {
      devError('[NotificationPermissions] Android channel creation failed:', error);
    }
  }
}