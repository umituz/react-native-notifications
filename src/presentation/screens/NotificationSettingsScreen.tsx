/**
 * NotificationSettingsScreen
 * Professional notification settings with all options
 */

import React, { useEffect, useMemo, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { AtomicText, AtomicIcon, AtomicCard, ScreenLayout } from '@umituz/react-native-design-system';
import { Switch } from 'react-native';
import { useAppDesignTokens } from '@umituz/react-native-design-system-theme';
import { QuietHoursCard } from '../components/QuietHoursCard';
import { useRemindersStore, useNotificationPreferences, useQuietHours, useReminders } from '../../infrastructure/storage/RemindersStore';
import { notificationService } from '../../infrastructure/services/NotificationService';
import type { NotificationSettingsTranslations, QuietHoursTranslations } from '../../infrastructure/services/types';

export interface NotificationSettingsScreenProps {
  translations: NotificationSettingsTranslations;
  quietHoursTranslations: QuietHoursTranslations;
  onRemindersPress: () => void;
  onStartTimePress: () => void;
  onEndTimePress: () => void;
}

export const NotificationSettingsScreen: React.FC<NotificationSettingsScreenProps> = ({
  translations,
  quietHoursTranslations,
  onRemindersPress,
  onStartTimePress,
  onEndTimePress,
}) => {
  const tokens = useAppDesignTokens();
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  const preferences = useNotificationPreferences();
  const quietHours = useQuietHours();
  const reminders = useReminders();
  const { loadPreferences, updatePreferences, updateQuietHours, isLoading } = useRemindersStore();

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const handleMasterToggle = useCallback(async (value: boolean) => {
    if (value) {
      const hasPermission = await notificationService.hasPermissions();
      if (!hasPermission) {
        const granted = await notificationService.requestPermissions();
        if (!granted) return;
      }
    }
    await updatePreferences({ enabled: value });
  }, [updatePreferences]);

  const handleSoundToggle = useCallback(async (value: boolean) => {
    await updatePreferences({ sound: value });
  }, [updatePreferences]);

  const handleVibrationToggle = useCallback(async (value: boolean) => {
    await updatePreferences({ vibration: value });
  }, [updatePreferences]);

  const handleQuietHoursToggle = useCallback(async (value: boolean) => {
    await updateQuietHours({ ...quietHours, enabled: value });
  }, [quietHours, updateQuietHours]);

  if (isLoading) {
    return (
      <ScreenLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tokens.colors.primary} />
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout hideScrollIndicator>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <AtomicCard style={styles.card}>
          <SettingRow
            iconName="notifications"
            title={translations.masterToggleTitle}
            description={translations.masterToggleDescription}
            value={preferences.enabled}
            onToggle={handleMasterToggle}
            tokens={tokens}
          />
        </AtomicCard>

        {preferences.enabled && (
          <>
            <AtomicCard style={styles.card}>
              <SettingRow
                iconName="volume-high"
                title={translations.soundTitle}
                description={translations.soundDescription}
                value={preferences.sound}
                onToggle={handleSoundToggle}
                tokens={tokens}
              />
              <View style={styles.divider} />
              <SettingRow
                iconName="phone-portrait"
                title={translations.vibrationTitle}
                description={translations.vibrationDescription}
                value={preferences.vibration}
                onToggle={handleVibrationToggle}
                tokens={tokens}
              />
            </AtomicCard>

            <AtomicCard style={styles.card}>
              <TouchableOpacity style={styles.navRow} onPress={onRemindersPress} activeOpacity={0.7}>
                <View style={styles.iconContainer}>
                  <AtomicIcon name="time" size="md" color="primary" />
                </View>
                <View style={styles.textContainer}>
                  <AtomicText type="bodyLarge">{translations.remindersTitle}</AtomicText>
                  <AtomicText type="bodySmall" style={styles.description}>{translations.remindersDescription}</AtomicText>
                </View>
                {reminders.length > 0 && (
                  <View style={styles.badge}>
                    <AtomicText type="bodySmall" style={styles.badgeText}>{reminders.length}</AtomicText>
                  </View>
                )}
                <AtomicIcon name="chevron-forward" size="md" color="secondary" />
              </TouchableOpacity>
            </AtomicCard>

            <QuietHoursCard
              config={quietHours}
              translations={quietHoursTranslations}
              onToggle={handleQuietHoursToggle}
              onStartTimePress={onStartTimePress}
              onEndTimePress={onEndTimePress}
            />
          </>
        )}
      </ScrollView>
    </ScreenLayout>
  );
};

interface SettingRowProps {
  iconName: string;
  title: string;
  description: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  tokens: ReturnType<typeof useAppDesignTokens>;
}

const SettingRow: React.FC<SettingRowProps> = ({ iconName, title, description, value, onToggle, tokens }) => {
  const styles = useMemo(() => createRowStyles(tokens), [tokens]);
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <AtomicIcon name={iconName} size="md" color="primary" />
      </View>
      <View style={styles.textContainer}>
        <AtomicText type="bodyLarge">{title}</AtomicText>
        <AtomicText type="bodySmall" style={styles.description}>{description}</AtomicText>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: tokens.colors.surfaceSecondary, true: tokens.colors.primary }}
        thumbColor={tokens.colors.surface}
      />
    </View>
  );
};

const createStyles = (tokens: ReturnType<typeof useAppDesignTokens>) =>
  StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollView: { flex: 1, padding: 16 },
    card: { marginBottom: 16, padding: 16, backgroundColor: tokens.colors.surface },
    divider: { height: 1, backgroundColor: tokens.colors.surfaceSecondary, marginVertical: 12 },
    navRow: { flexDirection: 'row', alignItems: 'center' },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: tokens.colors.surfaceSecondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    textContainer: { flex: 1, marginRight: 12 },
    description: { color: tokens.colors.textSecondary, marginTop: 2 },
    badge: {
      backgroundColor: tokens.colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
      marginRight: 8,
    },
    badgeText: { color: tokens.colors.surface, fontWeight: '600' },
  });

const createRowStyles = (tokens: ReturnType<typeof useAppDesignTokens>) =>
  StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center' },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: tokens.colors.surfaceSecondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    textContainer: { flex: 1, marginRight: 12 },
    description: { color: tokens.colors.textSecondary, marginTop: 2 },
  });
