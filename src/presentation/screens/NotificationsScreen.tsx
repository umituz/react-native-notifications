/**
 * Notifications Screen - {{APP_NAME}}
 *
 * Simple notification toggle - enable or disable reminders
 * Theme: {{THEME_ID}} ({{CATEGORY}} category)
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { AtomicIcon, AtomicSwitch, AtomicCard, AtomicText, ScreenLayout, STATIC_TOKENS } from '@umituz/react-native-design-system';

import { useTheme } from '@umituz/react-native-theme';
import { useNotificationSettings } from '../../infrastructure/hooks/useNotificationSettings';
import type { DesignTokens } from '@umituz/react-native-design-system';

export const NotificationsScreen: React.FC = () => {
  
  const { tokens } = useTheme();
  const styles = useMemo(() => getStyles(tokens), [tokens]);
  const { notificationsEnabled, setNotificationsEnabled, isLoading } = useNotificationSettings();

  if (isLoading) {
    return (
      <ScreenLayout testID="notifications-screen">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tokens.colors.primary} />
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout testID="notifications-screen" hideScrollIndicator>
      <AtomicCard style={styles.card}>
        <View style={styles.settingItem}>
          <View style={styles.iconContainer}>
            <AtomicIcon name="Bell" size="lg" color="primary" />
          </View>
          <View style={styles.textContainer}>
            <AtomicText type="bodyLarge" style={{ color: tokens.colors.textPrimary }}>
              {t('settings.notifications.enableNotifications')}
            </AtomicText>
            <AtomicText type="bodySmall" style={{ color: tokens.colors.textSecondary, marginTop: STATIC_TOKENS.spacing.xs }}>
              {t('settings.notifications.description')}
            </AtomicText>
          </View>
          <AtomicSwitch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            testID="notifications-toggle"
          />
        </View>
      </AtomicCard>
    </ScreenLayout>
  );
};

const getStyles = (tokens: DesignTokens) => StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: STATIC_TOKENS.spacing.lg,
    backgroundColor: tokens.colors.surface,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: tokens.colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: STATIC_TOKENS.spacing.md,
  },
  textContainer: {
    flex: 1,
    marginRight: STATIC_TOKENS.spacing.md,
  },
});

export default NotificationsScreen;
