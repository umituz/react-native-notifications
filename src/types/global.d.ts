declare const __DEV__: boolean;

declare global {
  namespace React {
    interface ReactElement {
      type: any;
      props: any;
      key: any;
    }
    
    interface ReactNode {
      [key: string]: any;
    }
  }
}

declare module 'react' {
  export interface FunctionComponent<P = {}> {
    (props: P): React.ReactElement | null;
    displayName?: string;
  }
  
  export type FC<P = {}> = FunctionComponent<P>;
  
  export function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prevState: S) => S)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useRef<T>(initialValue: T): { current: T };
  
  export interface ReactElement {
    type: any;
    props: any;
    key: any;
  }
  
  export interface ReactNode {
    [key: string]: any;
  }
  
  const createElement: any;
  const Component: any;
}

declare module '@react-native-async-storage/async-storage' {
  export interface AsyncStorageStatic {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
    getAllKeys(): Promise<string[]>;
    multiGet(keys: string[]): Promise<[string, string | null][]>;
    multiSet(keyValuePairs: [string, string][]): Promise<void>;
    multiRemove(keys: string[]): Promise<void>;
  }
  const AsyncStorage: AsyncStorageStatic;
  export default AsyncStorage;
}

declare module 'expo-notifications' {
  export interface NotificationContentInput {
    title: string;
    body: string;
    data?: Record<string, any>;
    sound?: string | boolean;
    badge?: number;
    categoryIdentifier?: string;
    priority?: AndroidNotificationPriority;
    vibrate?: number[];
  }

  export interface NotificationRequestInput {
    content: NotificationContentInput;
    trigger?: NotificationTriggerInput | null;
  }

  export interface NotificationTriggerInput {
    date?: Date;
    repeats?: boolean;
    channelId?: string;
    hour?: number;
    minute?: number;
    weekday?: number;
    day?: number;
  }

  export interface ScheduledNotification {
    identifier: string;
    content: NotificationContentInput;
    trigger: NotificationTriggerInput;
  }

  export enum AndroidImportance {
    DEFAULT = 'default',
    HIGH = 'high',
    MAX = 'max',
    LOW = 'low',
    MIN = 'min',
    UNSPECIFIED = 'unspecified',
  }

  export enum AndroidNotificationPriority {
    DEFAULT = 'default',
    HIGH = 'high',
    LOW = 'low',
    MAX = 'max',
    MIN = 'min',
  }

  export interface AndroidChannel {
    name: string;
    importance: AndroidImportance;
    vibrationPattern?: number[];
    sound?: string;
    lightColor?: string;
    enableVibrate?: boolean;
  }

  export interface NotificationPermissionsResponse {
    status: 'granted' | 'denied' | 'undetermined';
    granted?: boolean;
  }

  export function setNotificationHandler(handler: {
    handleNotification: () => Promise<{
      shouldShowAlert: boolean;
      shouldPlaySound: boolean;
      shouldSetBadge: boolean;
    }>;
  }): void;

  export function scheduleNotificationAsync(request: NotificationRequestInput): Promise<string>;
  export function cancelScheduledNotificationAsync(identifier: string): Promise<void>;
  export function cancelAllScheduledNotificationsAsync(): Promise<void>;
  export function getAllScheduledNotificationsAsync(): Promise<ScheduledNotification[]>;
  export function dismissAllNotificationsAsync(): Promise<void>;
  export function getPermissionsAsync(): Promise<NotificationPermissionsResponse>;
  export function requestPermissionsAsync(): Promise<NotificationPermissionsResponse>;
  export function setNotificationChannelAsync(id: string, channel: AndroidChannel): Promise<void>;
  export function getBadgeCountAsync(): Promise<number>;
  export function setBadgeCountAsync(count: number): Promise<void>;
  export function getExpoPushTokenAsync(options?: any): Promise<{ data: string }>;
}

declare module 'expo-device' {
  export const isDevice: boolean;
}

declare module 'react-native' {
  export interface PlatformStatic {
    OS: 'ios' | 'android';
    Version: string | number;
    isPad?: boolean;
    isTVOS?: boolean;
    select<T>(specifics: { ios?: T; android?: T; default?: T }): T;
  }
  export const Platform: PlatformStatic;

  export interface StyleSheetStatic {
    create<T>(styles: T): T;
  }
  export const StyleSheet: StyleSheetStatic;

  export interface ViewStatic {
    new (props: any): any;
  }
  export const View: ViewStatic;

  export interface ActivityIndicatorStatic {
    new (props: any): any;
  }
  export const ActivityIndicator: ActivityIndicatorStatic;
}

declare module 'zustand' {
  export interface StoreApi<T> {
    getState: () => T;
    setState: (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: boolean) => void;
    subscribe: (listener: (state: T, prevState: T) => void) => () => void;
    destroy: () => void;
  }

  export function create<TState extends object>(
    stateCreator: (
      set: (
        partial: TState | Partial<TState> | ((state: TState) => TState | Partial<TState>),
        replace?: boolean,
      ) => void,
      get: () => TState,
      api: StoreApi<TState>,
    ) => TState,
  ): StoreApi<TState> & ((selector?: (state: TState) => any) => any);
}

declare module '@umituz/react-native-design-system' {
  export interface AtomicIconProps {
    name: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    color?: string;
  }

  export interface AtomicSwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    testID?: string;
  }

  export interface AtomicCardProps {
    style?: any;
    children?: React.ReactNode;
  }

  export interface AtomicTextProps {
    type: 'bodySmall' | 'bodyMedium' | 'bodyLarge';
    style?: any;
    children?: React.ReactNode;
  }

  export interface ScreenLayoutProps {
    testID?: string;
    hideScrollIndicator?: boolean;
    children?: React.ReactNode;
  }

  export const AtomicIcon: React.FC<AtomicIconProps>;
  export const AtomicSwitch: React.FC<AtomicSwitchProps>;
  export const AtomicCard: React.FC<AtomicCardProps>;
  export const AtomicText: React.FC<AtomicTextProps>;
  export const ScreenLayout: React.FC<ScreenLayoutProps>;

  export const STATIC_TOKENS: {
    spacing: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
  };

  export interface DesignTokens {
    colors: {
      primary: string;
      textPrimary: string;
      textSecondary: string;
      surface: string;
      surfaceSecondary: string;
    };
  }
}

declare module '@umituz/react-native-design-system-theme' {
  export function useAppDesignTokens(): import('@umituz/react-native-design-system').DesignTokens;
}

