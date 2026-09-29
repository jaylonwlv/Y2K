import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { MOCKUP_WIDGET } from './tokens';

type Props = {
  width: number;
  height: number;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Replace the frosted glass with something else, e.g. a photo. */
  background?: ReactNode;
};

/** `.glassw` from home2.html: frosted pink glass with a 1 pt white inner edge. */
export function Glass({ width, height, children, style, background }: Props) {
  const k = Math.min(width, height) / MOCKUP_WIDGET;
  const radius = 34 * k;
  return (
    <View style={[{ width, height, borderRadius: radius }, styles.shadow, style]}>
      <View style={[StyleSheet.absoluteFill, styles.clip, { borderRadius: radius }]}>
        {background ?? <View style={[StyleSheet.absoluteFill, styles.frost]} />}
        {children}
      </View>
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.edge, { borderRadius: radius }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: { borderCurve: 'continuous', boxShadow: '0 10px 28px rgba(160, 50, 140, 0.18)' },
  clip: { overflow: 'hidden', borderCurve: 'continuous' },
  frost: {
    experimental_backgroundImage: 'linear-gradient(170deg, rgba(255,255,255,0.62) 0%, rgba(255,225,245,0.38) 100%)',
  },
  edge: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.85)', borderCurve: 'continuous' },
});
