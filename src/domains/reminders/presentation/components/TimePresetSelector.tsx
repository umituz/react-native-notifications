/**
 * TimePresetSelector Component
 * Allows selection of preset times or custom time
 */

import React, { useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AtomicText, AtomicIcon } from '@umituz/react-native-design-system';
import { useAppDesignTokens } from '@umituz/react-native-design-system';
import type { TimePreset } from '../../../../infrastructure/services/types';

export interface TimePresetSelectorProps {
  presets: TimePreset[];
  selectedPresetId?: string;
  customTime?: { hour: number; minute: number };
  onSelectPreset: (preset: TimePreset) => void;
  onSelectCustom: () => void;
  getPresetLabel: (labelKey: string) => string;
  customLabel: string;
  isCustomSelected: boolean;
}

const formatTime = (hour: number, minute: number): string => {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

export const TimePresetSelector: React.FC<TimePresetSelectorProps> = ({
  presets,
  selectedPresetId,
  customTime,
  onSelectPreset,
  onSelectCustom,
  getPresetLabel,
  customLabel,
  isCustomSelected,
}) => {
  const tokens = useAppDesignTokens();
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  return (
    <View style={styles.container}>
      {presets.map(preset => {
        const isSelected = selectedPresetId === preset.id && !isCustomSelected;
        return (
          <TouchableOpacity
            key={preset.id}
            style={[styles.button, isSelected ? styles.selectedButton : undefined]}
            onPress={() => onSelectPreset(preset)}
            activeOpacity={0.7}
          >
            <AtomicIcon
              name={preset.iconName}
              size="md"
              color={isSelected ? 'onSurface' : 'secondary'}
            />
            <AtomicText type="bodySmall" style={isSelected ? styles.selectedText : styles.text}>
              {getPresetLabel(preset.labelKey)}
            </AtomicText>
            <AtomicText type="bodySmall" style={isSelected ? styles.selectedText : styles.subText}>
              {formatTime(preset.hour, preset.minute)}
            </AtomicText>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        style={[styles.button, isCustomSelected ? styles.selectedButton : undefined]}
        onPress={onSelectCustom}
        activeOpacity={0.7}
      >
        <AtomicIcon name="time" size="md" color={isCustomSelected ? 'onSurface' : 'secondary'} />
        <AtomicText type="bodySmall" style={isCustomSelected ? styles.selectedText : styles.text}>
          {customLabel}
        </AtomicText>
        {customTime ? (
          <AtomicText type="bodySmall" style={isCustomSelected ? styles.selectedText : styles.subText}>
            {formatTime(customTime.hour, customTime.minute)}
          </AtomicText>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (tokens: ReturnType<typeof useAppDesignTokens>) =>
  StyleSheet.create({
    container: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    button: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: tokens.colors.surfaceSecondary,
      alignItems: 'center',
      minWidth: 72,
    },
    selectedButton: { backgroundColor: tokens.colors.primary },
    text: { color: tokens.colors.textSecondary, marginTop: 4 },
    subText: { color: tokens.colors.textSecondary, marginTop: 2, opacity: 0.7 },
    selectedText: { color: tokens.colors.surface, marginTop: 4 },
  });
