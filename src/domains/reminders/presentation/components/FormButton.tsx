/**
 * FormButton Component
 * Simple button for forms
 */

import React, { useMemo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { AtomicText } from '@umituz/react-native-design-system';
import { useAppDesignTokens } from '@umituz/react-native-design-system';

export interface FormButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const FormButton: React.FC<FormButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
}) => {
  const tokens = useAppDesignTokens();
  const styles = useMemo(() => createStyles(tokens), [tokens]);

  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        disabled ? styles.disabled : undefined,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <AtomicText
        type="bodyMedium"
        style={[styles.label, isPrimary ? styles.primaryLabel : styles.secondaryLabel]}
      >
        {label}
      </AtomicText>
    </TouchableOpacity>
  );
};

const createStyles = (tokens: ReturnType<typeof useAppDesignTokens>) =>
  StyleSheet.create({
    button: {
      flex: 1,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryButton: { backgroundColor: tokens.colors.primary },
    secondaryButton: { backgroundColor: tokens.colors.surfaceSecondary },
    disabled: { opacity: 0.5 },
    label: { fontWeight: '600' },
    primaryLabel: { color: tokens.colors.surface },
    secondaryLabel: { color: tokens.colors.textPrimary },
  });
