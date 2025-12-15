/**
 * FrequencySelector Component
 * Allows selection of reminder frequency
 */

import React, { useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AtomicText, AtomicIcon } from '@umituz/react-native-design-system';
import { useAppDesignTokens } from '@umituz/react-native-design-system-theme';
import type { ReminderFrequency } from '../../infrastructure/services/types';
import type { FrequencyOption } from '../../infrastructure/config/reminderPresets';

export interface FrequencySelectorProps {
  options: FrequencyOption[];
  selectedFrequency: ReminderFrequency;
  onSelect: (frequency: ReminderFrequency) => void;
  getLabel: (labelKey: string) => string;
}

export const FrequencySelector: React.FC<FrequencySelectorProps> = ({
  options,
  selectedFrequency,
  onSelect,
  getLabel,
}) => {
  const tokens = useAppDesignTokens();
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  return (
    <View style={styles.container}>
      {options.map(option => {
        const isSelected = selectedFrequency === option.id;
        return (
          <TouchableOpacity
            key={option.id}
            style={[styles.button, isSelected ? styles.selectedButton : undefined]}
            onPress={() => onSelect(option.id)}
            activeOpacity={0.7}
          >
            <AtomicIcon
              name={option.iconName}
              size="sm"
              color={isSelected ? 'surface' : 'textSecondary'}
            />
            <AtomicText type="bodySmall" style={isSelected ? styles.selectedText : styles.text}>
              {getLabel(option.labelKey)}
            </AtomicText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const createStyles = (tokens: ReturnType<typeof useAppDesignTokens>) =>
  StyleSheet.create({
    container: { flexDirection: 'row', gap: 8 },
    button: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderRadius: 8,
      backgroundColor: tokens.colors.surfaceSecondary,
      gap: 6,
    },
    selectedButton: { backgroundColor: tokens.colors.primary },
    text: { color: tokens.colors.textSecondary },
    selectedText: { color: tokens.colors.surface },
  });
