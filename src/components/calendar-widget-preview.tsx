import { StyleSheet, Text, View } from 'react-native';

type Props = {
  date?: Date;
  lines?: [string, string];
  size?: number;
};

/** React Native look-alike of the SwiftUI calendar widget, for in-app previews. */
export function CalendarWidgetPreview({
  date = new Date(),
  lines = ['✧ girls night 8PM', 'nails at 11 ♡'],
  size = 170,
}: Props) {
  const scale = size / 170;
  const weekday = date.toLocaleDateString(undefined, { weekday: 'long' }).toUpperCase();
  return (
    <View style={[styles.glass, { width: size, height: size, borderRadius: 26 * scale, padding: 16 * scale }]}>
      <Text style={[styles.weekday, { fontSize: 14 * scale }]}>{weekday}</Text>
      <View>
        <Text style={[styles.day, styles.dayShadow, { fontSize: 62 * scale, lineHeight: 70 * scale }]}>
          {date.getDate()}
        </Text>
        <Text style={[styles.day, { fontSize: 62 * scale, lineHeight: 70 * scale }]}>{date.getDate()}</Text>
      </View>
      <View style={{ flex: 1 }} />
      <Text numberOfLines={1} style={[styles.line1, { fontSize: 13 * scale }]}>
        {lines[0]}
      </Text>
      <Text numberOfLines={1} style={[styles.line2, { fontSize: 12 * scale }]}>
        {lines[1]}
      </Text>
      <Text style={[styles.sparkle, { top: 12 * scale, right: 14 * scale, fontSize: 14 * scale }]}>✦</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  glass: {
    experimental_backgroundImage: 'linear-gradient(180deg, rgba(253,232,248,0.82) 0%, rgba(246,203,238,0.72) 100%)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.85)',
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  weekday: { color: '#E3268F', fontWeight: '900', letterSpacing: 0.6 },
  day: {
    position: 'absolute',
    top: 0,
    fontWeight: '900',
    color: '#C9C3E3',
    textShadowColor: 'rgba(255,255,255,0.9)',
    textShadowOffset: { width: 0, height: -1 },
    textShadowRadius: 0,
  },
  dayShadow: { position: 'relative', color: 'rgba(227,38,143,0.85)', left: 1, top: 2.5, textShadowRadius: 0 },
  line1: { color: '#6E1B5E', fontWeight: '800' },
  line2: { color: '#9E4F8C', fontWeight: '500', marginTop: 2 },
  sparkle: { position: 'absolute', color: '#fff', textShadowColor: '#fff', textShadowRadius: 6 },
});
