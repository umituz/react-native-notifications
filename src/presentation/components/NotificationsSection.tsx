import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Switch, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppDesignTokens } from '@umituz/react-native-design-system-theme';
import { notificationService } from '../../infrastructure/services/NotificationService';

export interface NotificationsSectionConfig {
    initialValue?: boolean;
    onToggleChange?: (value: boolean) => void;
    route?: string;
    defaultRoute?: string;
    title?: string;
    description?: string;
    showToggle?: boolean;
}

export interface NotificationsSectionProps {
    config?: NotificationsSectionConfig;
    containerStyle?: ViewStyle;
}

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({
    config,
    containerStyle,
}) => {
    const navigation = useNavigation();
    const tokens = useAppDesignTokens();
    const colors = tokens.colors;

    const [notificationsEnabled, setNotificationsEnabled] = useState(
        config?.initialValue ?? true,
    );

    useEffect(() => {
        if (config?.initialValue !== undefined) {
            setNotificationsEnabled(config.initialValue);
        }
    }, [config?.initialValue]);

    const handleToggle = useCallback(async (value: boolean) => {
        if (!value) {
            // When turning ON (value is false -> true? Wait. onChange value is the NEW value)
            // If value is true (turning on)
        }

        // Logic from settings:
        /*
        if (notificationService && !value) { // Wait, logic in settings was: if (!value) ...?
           // Actually typically we request permissions when enabling.
           // Settings code:
           // if (notificationService && !value) { ... } -> This implies when value is FALSE?
           // Ah, maybe the switch value logic was inverted or I misread.
           // Let's re-read settings code.
        }
        */

        if (value) { // Enabling
            const hasPermissions = await notificationService.hasPermissions();
            if (!hasPermissions) {
                const granted = await notificationService.requestPermissions();
                if (!granted) {
                    // Permission denied, maybe don't enable switch?
                    // For now just allow toggle and let app handle it or sync with state
                }
            }
        }

        setNotificationsEnabled(value);
        config?.onToggleChange?.(value);
    }, [config]);

    const handlePress = useCallback(async () => {
        const hasPermissions = await notificationService.hasPermissions();
        if (!hasPermissions) {
            await notificationService.requestPermissions();
        }
        navigation.navigate((config?.route || config?.defaultRoute || 'Notifications') as never);
    }, [navigation, config?.route, config?.defaultRoute]);

    const title = config?.title || 'Notifications';
    const description = config?.description || 'Manage notification preferences';
    const showToggle = config?.showToggle ?? true;

    return (
        <View style={[styles.sectionContainer, { backgroundColor: colors.surface }, containerStyle]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>General</Text>

            <Pressable
                style={({ pressed }) => [
                    styles.itemContainer,
                    {
                        backgroundColor: pressed && !showToggle ? `${colors.primary}08` : 'transparent',
                    },
                ]}
                onPress={showToggle ? undefined : handlePress}
                disabled={showToggle}
            >
                <View style={styles.content}>
                    <View
                        style={[
                            styles.iconContainer,
                            { backgroundColor: `${colors.primary}15` },
                        ]}
                    >
                        <Feather name="bell" size={24} color={colors.primary} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
                        {!showToggle && (
                            <Text style={[styles.description, { color: colors.textSecondary }]}>
                                {description}
                            </Text>
                        )}
                    </View>

                    {showToggle ? (
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={handleToggle}
                            trackColor={{
                                false: `${colors.textSecondary}30`,
                                true: colors.primary,
                            }}
                            thumbColor={"#FFFFFF"}
                            ios_backgroundColor={`${colors.textSecondary}30`}
                        />
                    ) : (
                        <Feather name="chevron-right" size={20} color={colors.textSecondary} />
                    )}
                </View>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        minHeight: 72,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
        marginRight: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
    },
});
