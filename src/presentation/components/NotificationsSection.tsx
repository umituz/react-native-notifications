/**
 * NotificationsSection Component
 * Settings section for notifications with toggle
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { AtomicText, AtomicIcon } from '@umituz/react-native-design-system';
import { useAppDesignTokens } from '@umituz/react-native-design-system';
// @ts-ignore - Optional peer dependency
import { useNavigation } from '@react-navigation/native';
import { notificationService } from '../../infrastructure/services/NotificationService';

export interface NotificationsSectionConfig {
  initialValue?: boolean;
  onToggleChange?: (value: boolean) => void;
  route?: string;
  title?: string;
  description?: string;
  showToggle?: boolean;
}

export interface NotificationsSectionProps {
  config?: NotificationsSectionConfig;
  containerStyle?: StyleProp<ViewStyle>;
}

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  config,
  containerStyle,
}) => {
  const navigation = useNavigation();
  const tokens = useAppDesignTokens();
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  const [enabled, setEnabled] = useState(config?.initialValue ?? false);

  useEffect(() => {
    if (config?.initialValue !== undefined) {
      setEnabled(config.initialValue);
    }
  }, [config?.initialValue]);

  const handleToggle = useCallback(async (value: boolean) => {
    if (value) {
      const hasPermissions = await notificationService.hasPermissions();
      if (!hasPermissions) {
        const granted = await notificationService.requestPermissions();
        if (!granted) return;
      }
    }
    setEnabled(value);
    config?.onToggleChange?.(value);
  }, [config]);

  const handlePress = useCallback(async () => {
    const route = config?.route || 'Notifications';
    navigation.navigate(route as never);
  }, [config?.route, navigation]);

  const title = config?.title || 'Notifications';
  const description = config?.description || 'Manage notification preferences';
  const showToggle = config?.showToggle ?? false;

  return (
    <View style={[styles.container, containerStyle]}>
      <AtomicText type="bodyLarge" style={styles.sectionTitle}>General</AtomicText>

      {showToggle ? (
        <View style={styles.itemContainer}>
          <View style={styles.iconContainer}>
            <AtomicIcon name="notifications" size="md" color="primary" />
          </View>
          <View style={styles.textContainer}>
            <AtomicText type="bodyLarge">{title}</AtomicText>
          </View>
          <Switch
            value={enabled}
            onValueChange={handleToggle}
            trackColor={{ false: tokens.colors.surfaceSecondary, true: tokens.colors.primary }}
            thumbColor={tokens.colors.surface}
          />
        </View>
      ) : (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <AtomicIcon name="notifications" size="md" color="primary" />
          </View>
          <View style={styles.textContainer}>
            <AtomicText type="bodyLarge">{title}</AtomicText>
            <AtomicText type="bodySmall" style={styles.description}>{description}</AtomicText>
          </View>
          <AtomicIcon name="chevron-forward" size="md" color="secondary" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const createStyles = (tokens: ReturnType<typeof useAppDesignTokens>) =>
  StyleSheet.create({
    container: { marginBottom: 16, borderRadius: 12, overflow: 'hidden', backgroundColor: tokens.colors.surface },
    sectionTitle: { fontWeight: '600', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
    itemContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, minHeight: 72 },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      backgroundColor: tokens.colors.surfaceSecondary,
    },
    textContainer: { flex: 1, marginRight: 8 },
    description: { color: tokens.colors.textSecondary, marginTop: 4 },
  });
