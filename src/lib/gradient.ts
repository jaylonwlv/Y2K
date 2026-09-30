import type { ViewStyle } from 'react-native';

/** A CSS gradient as a view background (`experimental_backgroundImage` on iOS and Android). */
export const gradient = (css: string): ViewStyle => ({ experimental_backgroundImage: css });
