import { Text, View } from 'react-native';

import { AnalogFace } from './analog-face';
import { BigNumber } from './big-number';
import { Glass } from './glass';
import { Geist, MOCKUP_WIDGET, WIDGET_STYLES, type ThemeKey } from './tokens';

/** App-side look-alike of the Clock widget: chrome digital in Y2K, an analog dial in Aero and Night. */
export function ClockPreview({
  size = MOCKUP_WIDGET,
  theme = 'y2k',
  date = new Date(),
}: {
  size?: number;
  theme?: ThemeKey;
  date?: Date;
}) {
  const k = size / MOCKUP_WIDGET;
  const style = WIDGET_STYLES[theme];

  if (theme !== 'y2k') {
    return (
      <Glass width={size} height={size} theme={theme}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <AnalogFace
            size={148 * k}
            hours={date.getHours()}
            minutes={date.getMinutes()}
            style={theme === 'aero' ? 'aero' : 'night'}
            numerals={theme === 'night'}
          />
        </View>
      </Glass>
    );
  }

  const weekday = date.toLocaleDateString(undefined, { weekday: 'long' }).toUpperCase();
  const time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const [clock, meridiem] = time.split(/\s+/);
  const day = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }).toLowerCase();
  return (
    <Glass width={size} height={size} theme={theme}>
      <View style={{ flex: 1, padding: 18 * k, justifyContent: 'space-between' }}>
        <Text style={{ fontFamily: Geist.bold, color: style.accent, fontSize: 14 * k, letterSpacing: 0.84 * k }}>
          {weekday}
        </Text>
        <BigNumber text={clock} size={60 * k} theme={theme} />
        <Text numberOfLines={1} style={{ fontFamily: Geist.bold, color: style.ink, fontSize: 13.5 * k }}>
          ✧ {meridiem ? `${meridiem.toLowerCase()} · ` : ''}
          {day}
        </Text>
      </View>
    </Glass>
  );
}
