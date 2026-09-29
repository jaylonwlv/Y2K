import { Text, View } from 'react-native';

import { DEFAULT_CITIES, zoneTime, type City } from '@/lib/world-time';

import { AnalogFace, type FaceStyle } from './analog-face';
import { Glass } from './glass';
import { Geist, MOCKUP_WIDGET, WIDGET_STYLES, type ThemeKey } from './tokens';

type Props = { width: number; height: number; theme?: ThemeKey; date?: Date; cities?: City[] };

/** App-side look-alike of the World Clocks widget (the Aero Night mockup's hero), in any theme. */
export function WorldClocksPreview({
  width,
  height,
  theme = 'night',
  date = new Date(),
  cities = DEFAULT_CITIES,
}: Props) {
  const k = height / MOCKUP_WIDGET;
  const { ink } = WIDGET_STYLES[theme];
  return (
    <Glass width={width} height={height} theme={theme}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingHorizontal: 8 * k,
        }}>
        {cities.map((city) => {
          const t = zoneTime(date, city.timeZone);
          const face: FaceStyle = theme === 'night' ? (t.isDay ? 'nightLit' : 'night') : theme;
          return (
            <View key={city.name} style={{ alignItems: 'center', width: 84 * k }}>
              <AnalogFace size={78 * k} hours={t.hours} minutes={t.minutes} style={face} numerals />
              <Text
                numberOfLines={1}
                style={{ fontFamily: Geist.semibold, fontSize: 14 * k, color: ink, marginTop: 8 * k }}>
                {city.name}
              </Text>
              <Text
                style={{ fontFamily: Geist.medium, fontSize: 13 * k, color: ink, opacity: 0.55, lineHeight: 16 * k }}>
                {t.day}
              </Text>
              <Text style={{ fontFamily: Geist.medium, fontSize: 13 * k, color: ink, opacity: 0.55 }}>{t.offset}</Text>
            </View>
          );
        })}
      </View>
    </Glass>
  );
}
