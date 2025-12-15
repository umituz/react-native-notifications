/**
 * QuietHoursCard Component
 * Displays and manages quiet hours settings
 */

import React, { useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AtomicText, AtomicIcon, AtomicSwitch, AtomicCard } from '@umituz/react-native-design-system';
import { useAppDesignTokens } from '@umituz/react-native-design-system-theme';
import type { QuietHoursConfig, QuietHoursTranslations } from '../../infrastructure/services/types';

export interface QuietHoursCardProps {
  config: QuietHoursConfig;
  translations: QuietHoursTranslations;
  onToggle: (enabled: boolean) => void;
  onStartTimePress: () => void;
  onEndTimePress: () => void;
}

const formatTime = (hour: number, minute: number): string => {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

export const QuietHoursCard: React.FC<QuietHoursCardProps> = ({
  config,
  translations,
  onToggle,
  onStartTimePress,
  onEndTimePress,
}) => {
  const tokens = useAppDesignTokens();
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  return (
    <AtomicCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <AtomicIcon name="moon" size="md" color="primary" />
        </View>
        <View style={styles.headerText}>
          <AtomicText type="bodyLarge">{translations.title}</AtomicText>
          <AtomicText type="bodySmall" style={styles.description}>{translations.description}</AtomicText>
        </View>
        <AtomicSwitch value={config.enabled} onValueChange={onToggle} />
      </View>

      {config.enabled && (
        <View style={styles.timeContainer}>
          <TouchableOpacity style={styles.timeButton} onPress={onStartTimePress} activeOpacity={0.7}>
            <AtomicText type="bodySmall" style={styles.timeLabel}>{translations.startTimeLabel}</AtomicText>
            <AtomicText type="bodyLarge" style={styles.timeValue}>
              {formatTime(config.startHour, config.startMinute)}
            </AtomicText>
          </TouchableOpacity>

          <View style={styles.timeSeparator}>
            <AtomicIcon name="arrow-right" size="sm" color="textSecondary" />
          </View>

          <TouchableOpacity style={styles.timeButton} onPress={onEndTimePress} activeOpacity={0.7}>
            <AtomicText type="bodySmall" style={styles.timeLabel}>{translations.endTimeLabel}</AtomicText>
            <AtomicText type="bodyLarge" style={styles.timeValue}>
              {formatTime(config.endHour, config.endMinute)}
            </AtomicText>
          </TouchableOpacity>
        </View>
      )}
    </AtomicCard>
  );
};

const createStyles = (tokens: ReturnType<typeof useAppDesignTokens>) =>
  StyleSheet.create({
    card: { padding: 16, backgroundColor: tokens.colors.surface },
    header: { flexDirection: 'row', alignItems: 'center' },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: tokens.colors.surfaceSecondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    headerText: { flex: 1, marginRight: 12 },
    description: { color: tokens.colors.textSecondary, marginTop: 2 },
    timeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: tokens.colors.surfaceSecondary,
    },
    timeButton: {
      flex: 1,
      backgroundColor: tokens.colors.surfaceSecondary,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
    },
    timeLabel: { color: tokens.colors.textSecondary, marginBottom: 4 },
    timeValue: { color: tokens.colors.textPrimary, fontWeight: '600' },
    timeSeparator: { paddingHorizontal: 12 },
  });
