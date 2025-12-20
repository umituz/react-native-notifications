/**
 * ReminderListScreen
 * Displays list of reminders with add, edit, delete functionality
 */

import React, { useEffect, useMemo, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { AtomicText, AtomicIcon } from '@umituz/react-native-design-system';
import { useAppDesignTokens } from '@umituz/react-native-design-system';
import { ReminderItem } from '../components/ReminderItem';
import { useRemindersStore, useReminders, useRemindersLoading } from '../../infrastructure/storage/RemindersStore';
import { useReminderActions } from '../../infrastructure/hooks/useReminderActions';
import type { Reminder, ReminderTranslations } from '../../../../infrastructure/services/types';

export interface ReminderListScreenProps {
  translations: ReminderTranslations;
  onAddPress: () => void;
  onEditPress: (reminder: Reminder) => void;
  maxReminders?: number;
}

export const ReminderListScreen: React.FC<ReminderListScreenProps> = ({
  translations,
  onAddPress,
  onEditPress,
  maxReminders = 20,
}) => {
  const tokens = useAppDesignTokens();
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  const reminders = useReminders();
  const isLoading = useRemindersLoading();
  const { loadReminders } = useRemindersStore();
  const { toggleReminderEnabled, removeReminder } = useReminderActions();

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  const handleToggle = useCallback(async (id: string) => {
    await toggleReminderEnabled(id);
  }, [toggleReminderEnabled]);

  const handleDelete = useCallback(async (id: string) => {
    await removeReminder(id);
  }, [removeReminder]);

  const canAddMore = reminders.length < maxReminders;

  const renderItem = useCallback(({ item }: { item: Reminder }) => (
    <ReminderItem
      reminder={item}
      translations={{
        frequencyOnce: translations.frequencyOnce,
        frequencyDaily: translations.frequencyDaily,
        frequencyWeekly: translations.frequencyWeekly,
        frequencyMonthly: translations.frequencyMonthly,
      }}
      onToggle={handleToggle}
      onEdit={onEditPress}
      onDelete={handleDelete}
    />
  ), [translations, handleToggle, onEditPress, handleDelete]);

  const renderEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <AtomicIcon name="notifications-off" size="xl" color="secondary" />
      </View>
      <AtomicText type="bodyLarge" style={styles.emptyTitle}>{translations.emptyTitle}</AtomicText>
      <AtomicText type="bodySmall" style={styles.emptyDescription}>{translations.emptyDescription}</AtomicText>
    </View>
  ), [translations, styles]);

  const keyExtractor = useCallback((item: Reminder) => item.id, []);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: tokens.colors.surface }]}>
        <ActivityIndicator size="large" color={tokens.colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={reminders}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[styles.listContent, { backgroundColor: tokens.colors.surface }]}
        showsVerticalScrollIndicator={false}
      />

      {canAddMore && (
        <TouchableOpacity style={styles.fab} onPress={onAddPress} activeOpacity={0.8}>
          <AtomicIcon name="add" size="md" color="onSurface" />
          <AtomicText type="bodyMedium" style={styles.fabText}>{translations.addButtonLabel}</AtomicText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const createStyles = (tokens: ReturnType<typeof useAppDesignTokens>) =>
  StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { padding: 16, paddingBottom: 100, flexGrow: 1 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
    emptyIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: tokens.colors.surfaceSecondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    emptyTitle: { color: tokens.colors.textPrimary, textAlign: 'center', marginBottom: 8 },
    emptyDescription: { color: tokens.colors.textSecondary, textAlign: 'center' },
    fab: {
      position: 'absolute',
      bottom: 24,
      left: 16,
      right: 16,
      backgroundColor: tokens.colors.primary,
      borderRadius: 12,
      paddingVertical: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    fabText: { color: tokens.colors.surface, fontWeight: '600' },
  });
