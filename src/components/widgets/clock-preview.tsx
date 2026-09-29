import { StyleSheet, Text, View } from 'react-native';

import { ChromeText } from './chrome-text';
import { Glass } from './glass';
import { Geist, MOCKUP_WIDGET, Y2K } from './tokens';

/** App-side look-alike of the Chrome Clock widget. */
export function ClockPreview({ size = MOCKUP_WIDGET, date = new Date() }: { size?: number; date?: Date }) {
  const k = size / MOCKUP_WIDGET;
  const weekday = date.toLocaleDateString(undefined, { weekday: 'long' }).toUpperCase();
  const time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const [clock, meridiem] = time.split(/\s+/);
  const day = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }).toLowerCase();
  return (
    <Glass width={size} height={size}>
      <View style={{ flex: 1, padding: 18 * k, justifyContent: 'space-between' }}>
        <Text style={[styles.weekday, { fontSize: 14 * k, letterSpacing: 0.84 * k }]}>{weekday}</Text>
        <ChromeText text={clock} size={60 * k} letterSpacing={-3 * k} />
        <Text numberOfLines={1} style={[styles.detail, { fontSize: 13.5 * k }]}>
          ✧ {meridiem ? `${meridiem.toLowerCase()} · ` : ''}
          {day}
        </Text>
      </View>
    </Glass>
  );
}

const styles = StyleSheet.create({
  weekday: { fontFamily: Geist.bold, color: Y2K.hotPink },
  detail: { fontFamily: Geist.bold, color: Y2K.ink },
});
