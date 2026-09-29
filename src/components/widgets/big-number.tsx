import { Text } from 'react-native';

import { ChromeText } from './chrome-text';
import { Geist, WIDGET_STYLES, type ThemeKey } from './tokens';

type Props = { text: string; size: number; theme: ThemeKey };

/** The widget's hero number: chrome in Y2K, thin deep blue in Aero, thin neon white in Night. */
export function BigNumber({ text, size, theme }: Props) {
  const style = WIDGET_STYLES[theme];
  if (style.numeral === 'chrome') return <ChromeText text={text} size={size} letterSpacing={-size * 0.05} />;
  return (
    <Text
      numberOfLines={1}
      style={{
        fontFamily: Geist.light,
        fontSize: size * 0.95,
        lineHeight: size * 0.98,
        letterSpacing: -size * 0.035,
        color: style.numeral === 'neon' ? '#eafffb' : style.ink,
        textShadowColor: style.numeral === 'neon' ? 'rgba(90, 255, 220, 0.7)' : 'rgba(255, 255, 255, 0.8)',
        textShadowOffset: { width: 0, height: style.numeral === 'neon' ? 0 : 1 },
        textShadowRadius: style.numeral === 'neon' ? 10 : 0,
      }}>
      {text}
    </Text>
  );
}
