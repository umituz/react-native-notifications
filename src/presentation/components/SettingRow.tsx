/**
 * Setting Row Component
 * Reusable toggle row for settings
 */

import React, { useMemo, useCallback } from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { AtomicText, AtomicIcon } from '@umituz/react-native-design-system';
import { useAppDesignTokens } from '@umituz/react-native-design-system';

export interface SettingRowProps {
    iconName: string;
    title: string;
    description: string;
    value: boolean;
    onToggle: (value: boolean) => void;
    onHapticFeedback?: () => void;
}

export const SettingRow: React.FC<SettingRowProps> = ({
    iconName,
    title,
    description,
    value,
    onToggle,
    onHapticFeedback,
}) => {
    const tokens = useAppDesignTokens();
    const styles = useMemo(() => createStyles(tokens), [tokens]);

    const handleToggle = useCallback((newValue: boolean) => {
        onHapticFeedback?.();
        onToggle(newValue);
    }, [onToggle, onHapticFeedback]);

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <AtomicIcon name={iconName} size="md" color="primary" />
            </View>
            <View style={styles.textContainer}>
                <AtomicText type="bodyLarge" style={{ color: tokens.colors.textPrimary }}>
                    {title}
                </AtomicText>
                <AtomicText type="bodySmall" style={styles.description}>
                    {description}
                </AtomicText>
            </View>
            <Switch
                value={value}
                onValueChange={handleToggle}
                trackColor={{
                    false: tokens.colors.surfaceSecondary,
                    true: tokens.colors.primary
                }}
                thumbColor={tokens.colors.surface}
                ios_backgroundColor={tokens.colors.surfaceSecondary}
            />
        </View>
    );
};

const createStyles = (tokens: ReturnType<typeof useAppDesignTokens>) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        iconContainer: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: tokens.colors.surfaceSecondary,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        textContainer: {
            flex: 1,
            marginRight: 12,
        },
        description: {
            color: tokens.colors.textSecondary,
            marginTop: 2,
        },
    });
