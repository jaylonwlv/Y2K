import { Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Glass } from './glass';
import { Geist, MOCKUP_WIDGET, WIDGET_STYLES, type ThemeKey } from './tokens';

type Sky = 'sun' | 'sunCloud' | 'moon' | 'moonCloud';

type Forecast = {
  city: string;
  temp: number;
  sky: Sky;
  condition: string;
  high: number;
  low: number;
  hours: [label: string, temp: number, sky: Sky][];
};

/**
 * Typical late-September conditions for real cities, timed to the exports' 9:41 status bar:
 * a sunny San Diego morning for Aero, a clear Los Angeles night for Aero Night.
 */
const DAY: Forecast = {
  city: 'San Diego',
  temp: 72,
  sky: 'sun',
  condition: 'Sunny',
  high: 76,
  low: 66,
  hours: [
    ['Now', 72, 'sun'],
    ['10AM', 73, 'sun'],
    ['11AM', 74, 'sun'],
    ['12PM', 75, 'sunCloud'],
    ['1PM', 76, 'sunCloud'],
    ['2PM', 76, 'sun'],
  ],
};

const NIGHT: Forecast = {
  city: 'Los Angeles',
  temp: 67,
  sky: 'moon',
  condition: 'Clear',
  high: 80,
  low: 62,
  hours: [
    ['Now', 67, 'moon'],
    ['10PM', 66, 'moon'],
    ['11PM', 65, 'moon'],
    ['12AM', 64, 'moonCloud'],
    ['1AM', 63, 'moon'],
    ['2AM', 63, 'moon'],
  ],
};

/**
 * The weather card from the Frutiger Aero mockup, with sample data. Preview and export only:
 * a live Weather widget needs WeatherKit set up on the developer account first.
 */
export function WeatherPreview({ width, height, theme = 'aero' }: { width: number; height: number; theme?: ThemeKey }) {
  const k = height / MOCKUP_WIDGET;
  const { ink } = WIDGET_STYLES[theme];
  const f = theme === 'night' ? NIGHT : DAY;
  const text = (size: number, family = Geist.semibold) => ({ fontFamily: family, fontSize: size * k, color: ink });
  return (
    <Glass width={width} height={height} theme={theme}>
      <View style={{ flex: 1, paddingVertical: 18 * k, paddingHorizontal: 20 * k }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 * k }}>
              <Text style={text(16, Geist.bold)}>{f.city}</Text>
              <LocationArrow size={11 * k} color={ink} />
            </View>
            <Text style={[text(46, Geist.light), { letterSpacing: -1.4 * k, lineHeight: 50 * k }]}>{f.temp}°</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <SkyIcon sky={f.sky} size={26 * k} />
            <Text style={text(14)}>{f.condition}</Text>
            <Text style={[text(14), { opacity: 0.75 }]}>
              H:{f.high}° L:{f.low}°
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 * k }}>
          {f.hours.map(([label, temp, sky]) => (
            <View key={label} style={{ alignItems: 'center', gap: 5 * k }}>
              <Text style={[text(12.5), { opacity: 0.75 }]}>{label}</Text>
              <SkyIcon sky={sky} size={22 * k} />
              <Text style={text(15)}>{temp}°</Text>
            </View>
          ))}
        </View>
      </View>
    </Glass>
  );
}

function LocationArrow({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M21 3L3 10.6l7.6 2.8L13.4 21z" fill={color} />
    </Svg>
  );
}

const CLOUD = 'M8.3 19.6h9.2a4 4 0 00.5-8 5.6 5.6 0 00-10.5 1.7 3.2 3.2 0 00.8 6.3z';
/** Eight short rays around the sun, 8 to 10.5 from the centre. */
const RAYS = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4;
  const p = (r: number) => `${(12 + r * Math.cos(a)).toFixed(2)} ${(12 + r * Math.sin(a)).toFixed(2)}`;
  return `M${p(8)}L${p(10.5)}`;
}).join('');
const CRESCENT = 'M13.5 3.2A8.8 8.8 0 1020.8 14 7 7 0 0113.5 3.2z';

function SkyIcon({ sky, size }: { sky: Sky; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {sky === 'sun' && (
        <>
          <Circle cx={12} cy={12} r={5} fill="#ffc21a" />
          <Path d={RAYS} stroke="#ffc21a" strokeWidth={2} strokeLinecap="round" />
        </>
      )}
      {sky === 'sunCloud' && (
        <>
          <Circle cx={9} cy={9} r={4} fill="#ffc21a" />
          <Path d={CLOUD} fill="#fff" stroke="#9fcde8" strokeWidth={0.6} />
        </>
      )}
      {sky === 'moon' && <Path d={CRESCENT} fill="#EAF7FF" />}
      {sky === 'moonCloud' && (
        <>
          <Path d={CRESCENT} fill="#EAF7FF" transform="translate(0.5 -0.5) scale(0.62)" />
          <Path d={CLOUD} fill="#8C99AD" />
        </>
      )}
    </Svg>
  );
}
