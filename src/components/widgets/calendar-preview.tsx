import { Text, View } from 'react-native';

import { BigNumber } from './big-number';
import { Glass } from './glass';
import { Geist, MOCKUP_WIDGET, WIDGET_STYLES, type ThemeKey } from './tokens';

type Props = { size?: number; theme?: ThemeKey; date?: Date; lines?: [string, string] };

/** App-side look-alike of the Calendar widget (`yCal` in home2.html), in any theme. */
export function CalendarPreview({
  size = MOCKUP_WIDGET,
  theme = 'y2k',
  date = new Date(),
  lines = ['✧ girls night 8PM', 'nails at 11 ♡'],
}: Props) {
  const k = size / MOCKUP_WIDGET;
  const style = WIDGET_STYLES[theme];
  const weekday = date.toLocaleDateString(undefined, { weekday: 'long' }).toUpperCase();
  return (
    <Glass width={size} height={size} theme={theme}>
      <View style={{ padding: 18 * k }}>
        <Text style={{ fontFamily: Geist.bold, color: style.accent, fontSize: 14 * k, letterSpacing: 0.84 * k }}>
          {weekday}
        </Text>
        <View style={{ marginTop: 2 * k }}>
          <BigNumber text={String(date.getDate())} size={88 * k} theme={theme} />
        </View>
        <Text
          numberOfLines={1}
          style={{ fontFamily: Geist.bold, color: style.ink, fontSize: 13.5 * k, marginTop: 6 * k }}>
          {lines[0]}
        </Text>
        <Text numberOfLines={1} style={{ fontFamily: Geist.medium, color: style.ink, opacity: 0.65, fontSize: 13 * k }}>
          {lines[1]}
        </Text>
      </View>
    </Glass>
  );
}
