/**
 * WeekdaySelector Component
 * Allows selection of a weekday for weekly reminders
 */

import React, { useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AtomicText } from '@umituz/react-native-design-system';
import { useAppDesignTokens } from '@umituz/react-native-design-system-theme';
import { WEEKDAY_OPTIONS } from '../../infrastructure/config/reminderPresets';

export interface WeekdaySelectorProps {
  selectedWeekday: number;
  onSelect: (weekday: number) => void;
  getLabel: (key: string) => string;
}

export const WeekdaySelector: React.FC<WeekdaySelectorProps> = ({
  selectedWeekday,
  onSelect,
  getLabel,
}) => {
  const tokens = useAppDesignTokens();
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  return (
    <View style={styles.container}>
      {WEEKDAY_OPTIONS.map(option => {
        const isSelected = selectedWeekday === option.id;
        return (
          <TouchableOpacity
            key={option.id}
            style={[styles.button, isSelected ? styles.selectedButton : undefined]}
            onPress={() => onSelect(option.id)}
            activeOpacity={0.7}
          >
            <AtomicText type="bodySmall" style={isSelected ? styles.selectedText : styles.text}>
              {getLabel(option.shortLabelKey)}
            </AtomicText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const createStyles = (tokens: ReturnType<typeof useAppDesignTokens>) =>
  StyleSheet.create({
    container: { flexDirection: 'row', justifyContent: 'space-between', gap: 4 },
    button: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 4,
      borderRadius: 8,
      backgroundColor: tokens.colors.surfaceSecondary,
      alignItems: 'center',
    },
    selectedButton: { backgroundColor: tokens.colors.primary },
    text: { color: tokens.colors.textSecondary, fontWeight: '500' },
    selectedText: { color: tokens.colors.surface, fontWeight: '500' },
  });
