/**
 * Notifications Screen - Dynamic and Reusable
 *
 * A clean notification settings screen that accepts all text and configuration
 * as props to make it completely reusable across different applications.
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { AtomicIcon, AtomicSwitch, AtomicCard, AtomicText, ScreenLayout, STATIC_TOKENS } from '@umituz/react-native-design-system';
import { useAppDesignTokens } from '@umituz/react-native-design-system-theme';
import { useNotificationSettings } from '../../infrastructure/hooks/useNotificationSettings';
import type { DesignTokens } from '@umituz/react-native-design-system';

export interface NotificationsScreenProps {
  translations: {
    title: string;
    description: string;
    loadingText?: string;
  };
  iconName?: string;
  iconColor?: string;
  testID?: string;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  translations,
  iconName = 'bell',
  iconColor = 'primary',
  testID = 'notifications-screen',
}) => {
  const tokens = useAppDesignTokens();
  const styles = useMemo(() => getStyles(tokens), [tokens]);
  const { notificationsEnabled, setNotificationsEnabled, isLoading } = useNotificationSettings();

  if (isLoading) {
    return (
      <ScreenLayout testID={testID}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tokens.colors.primary} />
          <AtomicText 
            type="bodyMedium" 
            style={{ color: tokens.colors.textSecondary, marginTop: STATIC_TOKENS.spacing.md }}
          >
            {translations.loadingText || 'Loading...'}
          </AtomicText>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout testID={testID} hideScrollIndicator>
      <AtomicCard style={styles.card}>
        <View style={styles.settingItem}>
          <View style={styles.iconContainer}>
            <AtomicIcon name={iconName} size="lg" color={iconColor} />
          </View>
          <View style={styles.textContainer}>
            <AtomicText type="bodyLarge" style={{ color: tokens.colors.textPrimary }}>
              {translations.title}
            </AtomicText>
            <AtomicText type="bodySmall" style={{ color: tokens.colors.textSecondary, marginTop: STATIC_TOKENS.spacing.xs }}>
              {translations.description}
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