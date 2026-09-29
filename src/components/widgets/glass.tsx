import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { MOCKUP_WIDGET, WIDGET_STYLES, type ThemeKey } from './tokens';

type Props = {
  width: number;
  height: number;
  theme?: ThemeKey;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Replace the glass with something else, e.g. a photo. */
  background?: ReactNode;
};

/** `.glassw` from home2.html: frosted pink (Y2K), glossy aqua (Aero) or dark tinted (Night) glass. */
export function Glass({ width, height, theme = 'y2k', children, style, background }: Props) {
  const k = Math.min(width, height) / MOCKUP_WIDGET;
  const radius = 34 * k;
  const glass = WIDGET_STYLES[theme].glass;
  return (
    <View style={[{ width, height, borderRadius: radius, boxShadow: glass.shadow }, styles.continuous, style]}>
      <View style={[StyleSheet.absoluteFill, styles.clip, { borderRadius: radius }]}>
        {background ?? <View style={[StyleSheet.absoluteFill, { experimental_backgroundImage: glass.gradient }]} />}
        {glass.gloss && (
          // Aero's glossy top highlight (`.glassw::before`).
          <View
            style={[
              styles.gloss,
              {
                left: 8 * k,
                right: 8 * k,
                top: 4 * k,
                height: height * 0.38,
                borderTopLeftRadius: 30 * k,
                borderTopRightRadius: 30 * k,
                borderBottomLeftRadius: 26 * k,
                borderBottomRightRadius: 26 * k,
              },
            ]}
          />
        )}
        {children}
      </View>
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.edge, { borderRadius: radius, borderColor: glass.edge }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  continuous: { borderCurve: 'continuous' },
  clip: { overflow: 'hidden', borderCurve: 'continuous' },
  gloss: {
    position: 'absolute',
    experimental_backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)',
  },
  edge: { borderWidth: 1, borderCurve: 'continuous' },
});
