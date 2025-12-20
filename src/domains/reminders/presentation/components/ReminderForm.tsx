/**
 * ReminderForm Component
 * Form for creating and editing reminders
 */

import React, { useState, useMemo, useCallback } from 'react';
import { View, TextInput, StyleSheet, ScrollView } from 'react-native';
import { AtomicText } from '@umituz/react-native-design-system';
import { useAppDesignTokens } from '@umituz/react-native-design-system';
import { TimePresetSelector } from './TimePresetSelector';
import { FrequencySelector } from './FrequencySelector';
import { WeekdaySelector } from './WeekdaySelector';
import { FormButton } from './FormButton';
import { DEFAULT_TIME_PRESETS, FREQUENCY_OPTIONS } from '../../infrastructure/config/reminderPresets';
import type { Reminder, ReminderFrequency, CreateReminderInput, TimePreset } from '../../../../infrastructure/services/types';

export interface ReminderFormTranslations {
  titleLabel: string;
  titlePlaceholder: string;
  bodyLabel: string;
  bodyPlaceholder: string;
  timeLabel: string;
  frequencyLabel: string;
  weekdayLabel: string;
  saveButton: string;
  cancelButton: string;
  customTimeLabel: string;
  getPresetLabel: (key: string) => string;
  getFrequencyLabel: (key: string) => string;
  getWeekdayLabel: (key: string) => string;
}

export interface ReminderFormProps {
  initialData?: Reminder;
  translations: ReminderFormTranslations;
  onSave: (data: CreateReminderInput) => void;
  onCancel: () => void;
  timePresets?: TimePreset[];
}

export const ReminderForm: React.FC<ReminderFormProps> = ({
  initialData,
  translations,
  onSave,
  onCancel,
  timePresets = DEFAULT_TIME_PRESETS,
}) => {
  const tokens = useAppDesignTokens();
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  const [title, setTitle] = useState(initialData?.title || '');
  const [body, setBody] = useState(initialData?.body || '');
  const [frequency, setFrequency] = useState<ReminderFrequency>(initialData?.frequency || 'daily');
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>(initialData?.timePresetId);
  const [hour, setHour] = useState(initialData?.hour ?? 9);
  const [minute, setMinute] = useState(initialData?.minute ?? 0);
  const [weekday, setWeekday] = useState(initialData?.weekday ?? 2);
  const [isCustomTime, setIsCustomTime] = useState(!initialData?.timePresetId);

  const handlePresetSelect = useCallback((preset: TimePreset) => {
    setSelectedPresetId(preset.id);
    setHour(preset.hour);
    setMinute(preset.minute);
    setIsCustomTime(false);
  }, []);

  const handleCustomSelect = useCallback(() => {
    setSelectedPresetId(undefined);
    setIsCustomTime(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      body: body.trim(),
      frequency,
      timePresetId: isCustomTime ? undefined : selectedPresetId,
      hour,
      minute,
      weekday: frequency === 'weekly' ? weekday : undefined,
      dayOfMonth: frequency === 'monthly' ? 1 : undefined,
    });
  }, [title, body, frequency, selectedPresetId, hour, minute, weekday, isCustomTime, onSave]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <AtomicText type="bodyMedium" style={styles.label}>{translations.titleLabel}</AtomicText>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder={translations.titlePlaceholder}
          placeholderTextColor={tokens.colors.textSecondary}
        />
      </View>

      <View style={styles.section}>
        <AtomicText type="bodyMedium" style={styles.label}>{translations.bodyLabel}</AtomicText>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={body}
          onChangeText={setBody}
          placeholder={translations.bodyPlaceholder}
          placeholderTextColor={tokens.colors.textSecondary}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.section}>
        <AtomicText type="bodyMedium" style={styles.label}>{translations.frequencyLabel}</AtomicText>
        <FrequencySelector
          options={FREQUENCY_OPTIONS}
          selectedFrequency={frequency}
          onSelect={setFrequency}
          getLabel={translations.getFrequencyLabel}
        />
      </View>

      <View style={styles.section}>
        <AtomicText type="bodyMedium" style={styles.label}>{translations.timeLabel}</AtomicText>
        <TimePresetSelector
          presets={timePresets}
          selectedPresetId={selectedPresetId}
          customTime={isCustomTime ? { hour, minute } : undefined}
          onSelectPreset={handlePresetSelect}
          onSelectCustom={handleCustomSelect}
          getPresetLabel={translations.getPresetLabel}
          customLabel={translations.customTimeLabel}
          isCustomSelected={isCustomTime}
        />
      </View>

      {frequency === 'weekly' && (
        <View style={styles.section}>
          <AtomicText type="bodyMedium" style={styles.label}>{translations.weekdayLabel}</AtomicText>
          <WeekdaySelector selectedWeekday={weekday} onSelect={setWeekday} getLabel={translations.getWeekdayLabel} />
        </View>
      )}

      <View style={styles.buttonRow}>
        <FormButton label={translations.cancelButton} onPress={onCancel} variant="secondary" />
        <FormButton label={translations.saveButton} onPress={handleSave} disabled={!title.trim()} />
      </View>
    </ScrollView>
  );
};

const createStyles = (tokens: ReturnType<typeof useAppDesignTokens>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: tokens.colors.surface,
    },
    section: { marginBottom: 20 },
    label: { color: tokens.colors.textPrimary, marginBottom: 8 },
    input: {
      backgroundColor: tokens.colors.surfaceSecondary,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: tokens.colors.textPrimary,
    },
    multilineInput: { minHeight: 80, textAlignVertical: 'top' },
    buttonRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  });
