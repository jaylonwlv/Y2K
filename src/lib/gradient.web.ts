import type { ViewStyle } from 'react-native';

/** On web the CSS gradient goes straight to `background-image`. */
export const gradient = (css: string): ViewStyle => ({ backgroundImage: css }) as ViewStyle;
