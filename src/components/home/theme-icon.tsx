import { useId } from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { glyphs, type GlyphName } from './glyphs';

type Props = { name: GlyphName; size: number; hot?: boolean };

const PETALS = ['#ff5cb6', '#ff8fd0', '#c77dff', '#9fb4ff', '#7fd8ff', '#8ff0c8', '#ffe27a', '#ffab70'];
const WHITE_PETALS = PETALS.map(() => '#ffffff');

const CHROME = [
  ['0', '#ffffff'],
  ['0.18', '#f3ecff'],
  ['0.40', '#c4bde0'],
  ['0.52', '#ffffff'],
  ['0.72', '#d4cdea'],
  ['1', '#fbf9ff'],
];
const JELLY = [
  ['0', '#ffc0e6'],
  ['0.55', '#ff5cb6'],
  ['1', '#e3268f'],
];

// The glyphs use a 24 pt grid drawn into a 31.2-unit viewBox (home2.html pads by 3.6 units),
// so one icon pixel at the mockup's 81 px size is 31.2 / 81 units.
const VB = 31.2;
const PX = VB / 81;
const O = -3.6;

/** Gloss highlight from `.ic::before`: 6 px inset, 40 % tall, round top and a soft oval bottom. */
function glossPath() {
  const x = O + 6 * PX;
  const y = O + 3 * PX;
  const w = VB - 12 * PX;
  const h = VB * 0.4;
  const r = 15 * PX;
  const ry = 20 * PX;
  return [
    `M${x + r} ${y}`,
    `H${x + w - r}`,
    `A${r} ${r} 0 0 1 ${x + w} ${y + r}`,
    `V${y + h - ry}`,
    `A${w / 2} ${ry} 0 0 1 ${x + w / 2} ${y + h}`,
    `A${w / 2} ${ry} 0 0 1 ${x} ${y + h - ry}`,
    `V${y + r}`,
    `A${r} ${r} 0 0 1 ${x + r} ${y}`,
    'Z',
  ].join(' ');
}
const GLOSS = glossPath();

/** Rounded tile inset by `inset` px, for the background and the edge strokes. */
function Tile({ inset = 0, ...paint }: { inset?: number; fill?: string; stroke?: string; strokeWidth?: number }) {
  const d = inset * PX;
  return <Rect x={O + d} y={O + d} width={VB - 2 * d} height={VB - 2 * d} rx={(19 - inset) * PX} {...paint} />;
}

/**
 * Y2K app icon from home2.html: a polished chrome tile with a hot-pink glyph, or ("hot")
 * a pink jelly tile with a white glyph, both under a glossy highlight. Drawn entirely in SVG
 * so it renders the same everywhere, including in exports.
 */
export function ThemeIcon({ name, size, hot = false }: Props) {
  const id = useId().replace(/:/g, '');
  const paint = hot
    ? { fill: '#ffffff', contrast: '#ef3f9f', petals: WHITE_PETALS }
    : { fill: `url(#g${id})`, contrast: '#f6f0ff', petals: PETALS };

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: (19 * size) / 81,
        boxShadow: hot ? '0 6px 14px rgba(200, 40, 140, 0.35)' : '0 6px 14px rgba(150, 60, 160, 0.28)',
      }}>
      <Svg width={size} height={size} viewBox={`${O} ${O} ${VB} ${VB}`}>
        <Defs>
          {/* Chrome at 145°, jelly top to bottom. */}
          <LinearGradient
            id={`t${id}`}
            x1={hot ? 0.5 : 0.213}
            y1={hot ? 0 : 0.09}
            x2={hot ? 0.5 : 0.787}
            y2={hot ? 1 : 0.91}>
            {(hot ? JELLY : CHROME).map(([offset, color]) => (
              <Stop key={offset} offset={offset} stopColor={color} />
            ))}
          </LinearGradient>
          <LinearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#ff6fc0" />
            <Stop offset="1" stopColor="#d9269a" />
          </LinearGradient>
          <LinearGradient id={`s${id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#ffffff" stopOpacity={0.75} />
            <Stop offset="1" stopColor="#ffffff" stopOpacity={0} />
          </LinearGradient>
        </Defs>

        <Tile fill={`url(#t${id})`} />
        {!hot && <Tile inset={1.25} fill="none" stroke="rgba(255,160,220,0.28)" strokeWidth={2.5 * PX} />}
        {glyphs[name](paint)}
        <Path d={GLOSS} fill={`url(#s${id})`} />
        <Tile
          inset={0.5}
          fill="none"
          stroke={hot ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.95)'}
          strokeWidth={PX}
        />
      </Svg>
    </View>
  );
}
