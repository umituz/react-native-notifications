/**
 * NotificationSettingsScreen
 * Clean presentation-only screen for notification settings
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { AtomicText, AtomicIcon, AtomicCard, ScreenLayout } from '@umituz/react-native-design-system';
import { useAppDesignTokens } from '@umituz/react-native-design-system';
import { QuietHoursCard } from '../../domains/quietHours/presentation/components/QuietHoursCard';
import { SettingRow } from '../components/SettingRow';
import { useNotificationSettingsUI } from '../hooks/useNotificationSettingsUI';
import { useReminders } from '../../domains/reminders/infrastructure/storage/RemindersStore';
import type { NotificationSettingsTranslations, QuietHoursTranslations } from '../../infrastructure/services/types';

export interface NotificationSettingsScreenProps {
  translations: NotificationSettingsTranslations;
  quietHoursTranslations: QuietHoursTranslations;
  onRemindersPress: () => void;
  onStartTimePress: () => void;
  onEndTimePress: () => void;
  onHapticFeedback?: () => void;
}

export const NotificationSettingsScreen: React.FC<NotificationSettingsScreenProps> = ({
  translations,
  quietHoursTranslations,
  onRemindersPress,
  onStartTimePress,
  onEndTimePress,
  onHapticFeedback,
}) => {
  const tokens = useAppDesignTokens();
  const styles = useMemo(() => createStyles(tokens), [tokens]);
  const reminders = useReminders();

  const {
    preferences,
    quietHours,
    isLoading,
    handleMasterToggle,
    handleSoundToggle,
    handleVibrationToggle,
    handleQuietHoursToggle,
  } = useNotificationSettingsUI();

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
      <View style={styles.container}>
        <AtomicCard style={styles.card}>
          <SettingRow
            iconName="notifications"
            title={translations.masterToggleTitle}
            description={translations.masterToggleDescription}
            value={preferences.enabled}
            onToggle={handleMasterToggle}
            onHapticFeedback={onHapticFeedback}
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
                onHapticFeedback={onHapticFeedback}
              />
              <View style={styles.divider} />
              <SettingRow
                iconName="phone-portrait"
                title={translations.vibrationTitle}
                description={translations.vibrationDescription}
                value={preferences.vibration}
                onToggle={handleVibrationToggle}
                onHapticFeedback={onHapticFeedback}
              />
            </AtomicCard>

            <AtomicCard style={styles.card}>
              <TouchableOpacity style={styles.navRow} onPress={onRemindersPress} activeOpacity={0.7}>
                <View style={styles.iconContainer}>
                  <AtomicIcon name="time" size="md" color="primary" />
                </View>
                <View style={styles.textContainer}>
                  <AtomicText type="bodyLarge" style={{ color: tokens.colors.textPrimary }}>
                    {translations.remindersTitle}
                  </AtomicText>
                  <AtomicText type="bodySmall" style={{ color: tokens.colors.textSecondary }}>
                    {translations.remindersDescription}
                  </AtomicText>
                </View>
                {reminders.length > 0 && (
                  <View style={styles.badge}>
                    <AtomicText type="bodySmall" style={styles.badgeText}>
                      {reminders.length}
                    </AtomicText>
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
      </View>
    </ScreenLayout>
  );
};

const createStyles = (tokens: ReturnType<typeof useAppDesignTokens>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      marginBottom: 16,
      padding: 16,
      backgroundColor: tokens.colors.surface,
    },
    divider: {
      height: 1,
      backgroundColor: tokens.colors.surfaceSecondary,
      marginVertical: 12,
    },
    navRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: tokens.colors.surfaceSecondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
      marginRight: 12,
    },
    badge: {
      backgroundColor: tokens.colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
      marginRight: 8,
    },
    badgeText: {
      color: tokens.colors.surface,
      fontWeight: '600',
    },
  });
