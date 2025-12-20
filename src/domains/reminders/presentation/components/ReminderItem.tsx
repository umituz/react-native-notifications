/**
 * ReminderItem Component
 * Displays a single reminder with toggle and actions
 */

import React, { useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AtomicText, AtomicIcon } from '@umituz/react-native-design-system';
import { Switch } from 'react-native';
import { useAppDesignTokens } from '@umituz/react-native-design-system';
import type { Reminder, ReminderFrequency } from '../../../../infrastructure/services/types';

export interface ReminderItemTranslations {
  frequencyOnce: string;
  frequencyDaily: string;
  frequencyWeekly: string;
  frequencyMonthly: string;
}

export interface ReminderItemProps {
  reminder: Reminder;
  translations: ReminderItemTranslations;
  onToggle: (id: string) => void;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
}

const formatTime = (hour: number, minute: number): string => {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

const getFrequencyIcon = (frequency: ReminderFrequency): string => {
  const icons: Record<ReminderFrequency, string> = {
    once: 'calendar',
    daily: 'repeat',
    weekly: 'calendar',
    monthly: 'calendar',
  };
  return icons[frequency] || 'notifications';
};

export const ReminderItem: React.FC<ReminderItemProps> = ({
  reminder,
  translations,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const tokens = useAppDesignTokens();
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  const getFrequencyLabel = (frequency: ReminderFrequency): string => {
    const labels: Record<ReminderFrequency, string> = {
      once: translations.frequencyOnce,
      daily: translations.frequencyDaily,
      weekly: translations.frequencyWeekly,
      monthly: translations.frequencyMonthly,
    };
    return labels[frequency] || '';
  };

  return (
    <View style={[styles.container, !reminder.enabled ? styles.disabled : undefined]}>
      <TouchableOpacity style={styles.content} onPress={() => onEdit(reminder)} activeOpacity={0.7}>
        <View style={styles.iconContainer}>
          <AtomicIcon
            name={getFrequencyIcon(reminder.frequency)}
            size="md"
            color={reminder.enabled ? 'primary' : 'secondary'}
          />
        </View>
        <View style={styles.textContainer}>
          <AtomicText type="bodyLarge" style={!reminder.enabled ? styles.disabledText : undefined}>
            {reminder.title}
          </AtomicText>
          <View style={styles.metaRow}>
            <AtomicText type="bodySmall" style={styles.time}>
              {formatTime(reminder.hour, reminder.minute)}
            </AtomicText>
            <AtomicText type="bodySmall" style={styles.frequency}>
              {getFrequencyLabel(reminder.frequency)}
            </AtomicText>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(reminder.id)}>
          <AtomicIcon name="trash" size="sm" color="error" />
        </TouchableOpacity>
        <Switch
          value={reminder.enabled}
          onValueChange={() => onToggle(reminder.id)}
          trackColor={{ false: tokens.colors.surfaceSecondary, true: tokens.colors.primary }}
          thumbColor={tokens.colors.surface}
        />
      </View>
    </View>
  );
};

const createStyles = (tokens: ReturnType<typeof useAppDesignTokens>) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: tokens.colors.surface,
      borderRadius: 12,
      marginBottom: 8,
    },
    disabled: { opacity: 0.6 },
    content: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: tokens.colors.surfaceSecondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    textContainer: { flex: 1 },
    disabledText: { color: tokens.colors.textSecondary },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
    time: { color: tokens.colors.primary, fontWeight: '600' },
    frequency: { color: tokens.colors.textSecondary },
    actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    deleteButton: { padding: 4 },
  });
