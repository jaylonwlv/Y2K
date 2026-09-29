import { StyleSheet, Text, View } from 'react-native';

import { ChromeText } from './chrome-text';
import { Glass } from './glass';
import { Geist, MOCKUP_WIDGET, Y2K } from './tokens';

type Props = { size?: number; date?: Date; lines?: [string, string] };

/** App-side look-alike of the Chrome Calendar widget (`yCal` in home2.html). */
export function CalendarPreview({
  size = MOCKUP_WIDGET,
  date = new Date(),
  lines = ['✧ girls night 8PM', 'nails at 11 ♡'],
}: Props) {
  const k = size / MOCKUP_WIDGET;
  const weekday = date.toLocaleDateString(undefined, { weekday: 'long' }).toUpperCase();
  return (
    <Glass width={size} height={size}>
      <View style={{ padding: 18 * k }}>
        <Text style={[styles.weekday, { fontSize: 14 * k, letterSpacing: 0.84 * k }]}>{weekday}</Text>
        <View style={{ marginTop: 2 * k }}>
          <ChromeText text={String(date.getDate())} size={88 * k} letterSpacing={-4.4 * k} />
        </View>
        <Text numberOfLines={1} style={[styles.line1, { fontSize: 13.5 * k, marginTop: 6 * k }]}>
          {lines[0]}
        </Text>
        <Text numberOfLines={1} style={[styles.line2, { fontSize: 13 * k }]}>
          {lines[1]}
        </Text>
      </View>
    </Glass>
  );
}

const styles = StyleSheet.create({
  weekday: { fontFamily: Geist.bold, color: Y2K.hotPink },
  line1: { fontFamily: Geist.bold, color: Y2K.ink },
  line2: { fontFamily: Geist.medium, color: Y2K.ink, opacity: 0.65 },
});
