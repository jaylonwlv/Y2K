import { Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { Glass } from './glass';
import { Geist, MOCKUP_WIDGET, WIDGET_STYLES, type ThemeKey } from './tokens';

const HOURS: [string, number, boolean][] = [
  ['Now', 72, true],
  ['11AM', 74, true],
  ['12PM', 76, true],
  ['1PM', 77, false],
  ['2PM', 78, false],
  ['3PM', 77, true],
];

/**
 * The weather card from the Frutiger Aero mockup, with sample data. Preview and export only:
 * a live Weather widget needs WeatherKit set up on the developer account first.
 */
export function WeatherPreview({ width, height, theme = 'aero' }: { width: number; height: number; theme?: ThemeKey }) {
  const k = height / MOCKUP_WIDGET;
  const { ink } = WIDGET_STYLES[theme];
  const text = (size: number, family = Geist.semibold) => ({ fontFamily: family, fontSize: size * k, color: ink });
  return (
    <Glass width={width} height={height} theme={theme}>
      <View style={{ flex: 1, paddingVertical: 18 * k, paddingHorizontal: 20 * k }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={text(16, Geist.bold)}>
              Sunny Bay <Text style={text(11, Geist.bold)}>➤</Text>
            </Text>
            <Text style={[text(46, Geist.light), { letterSpacing: -1.4 * k, lineHeight: 50 * k }]}>72°</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Sun size={26 * k} />
            <Text style={text(14)}>Sunny</Text>
            <Text style={[text(14), { opacity: 0.75 }]}>H:78° L:64°</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 * k }}>
          {HOURS.map(([label, temp, sunny]) => (
            <View key={label} style={{ alignItems: 'center', gap: 5 * k }}>
              <Text style={[text(12.5), { opacity: 0.75 }]}>{label}</Text>
              {sunny ? <Sun size={22 * k} /> : <Cloudy size={22 * k} />}
              <Text style={text(15)}>{temp}°</Text>
            </View>
          ))}
        </View>
      </View>
    </Glass>
  );
}

function Sun({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={5.8} fill="#ffc21a" />
    </Svg>
  );
}

function Cloudy({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={9} cy={9} r={4} fill="#ffc21a" />
      <Path
        d="M8.3 19.6h9.2a4 4 0 00.5-8 5.6 5.6 0 00-10.5 1.7 3.2 3.2 0 00.8 6.3z"
        fill="#fff"
        stroke="#9fcde8"
        strokeWidth={0.6}
      />
    </Svg>
  );
}
