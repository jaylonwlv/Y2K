import { useId } from 'react';
import { View } from 'react-native';
import Svg, { Defs, G, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

import { Geist, type ThemeKey } from '@/components/widgets/tokens';

import { glyphs, type GlyphName } from './glyphs';

export type AeroTint = 'aqua' | 'green' | 'blue' | 'teal' | 'orange' | 'sky';

type Props = {
  name: GlyphName | 'calendar';
  size: number;
  theme?: ThemeKey;
  /** Y2K: pink jelly instead of chrome. */
  hot?: boolean;
  /** Aero: the glossy tile's colour. */
  tint?: AeroTint;
  /** Date shown on the calendar icon. */
  date?: Date;
};

type Stops = [string, string][];

const AERO_TINTS: Record<AeroTint, [string, string]> = {
  aqua: ['#19a7e6', '#0676bd'],
  green: ['#45c23a', '#1f8f2a'],
  blue: ['#3b7ee8', '#1d4fb8'],
  teal: ['#1bb9a6', '#0c847e'],
  orange: ['#ffa42b', '#e0700e'],
  sky: ['#6fcdf3', '#2a9fd8'],
};

const Y2K_PETALS = ['#ff5cb6', '#ff8fd0', '#c77dff', '#9fb4ff', '#7fd8ff', '#8ff0c8', '#ffe27a', '#ffab70'];
const NIGHT_PETALS = ['#5fffe0', '#46e6ff', '#3fb3ff', '#6f8bff', '#9f7bff', '#ff7bd8', '#ffd36b', '#8dff9e'];
const AERO_PETALS = Y2K_PETALS.map((_, i) => (i % 2 ? '#e8fbff' : '#ffffff'));
const WHITE_PETALS = Y2K_PETALS.map(() => '#ffffff');

/** Gradient direction as objectBoundingBox points for a CSS angle (0° = up, clockwise). */
function direction(deg: number) {
  const a = (deg * Math.PI) / 180;
  const dx = Math.sin(a) / 2;
  const dy = -Math.cos(a) / 2;
  return { x1: 0.5 - dx, y1: 0.5 - dy, x2: 0.5 + dx, y2: 0.5 + dy };
}

/** Everything that differs between themes, from `.ic` in home2.html. */
function iconStyle(theme: ThemeKey, hot: boolean, tint: AeroTint, glyphFill: string) {
  if (theme === 'aero') {
    const [a, b] = AERO_TINTS[tint];
    return {
      angle: 170,
      stops: [
        ['0', 'rgba(255,255,255,0.62)'],
        ['0.42', 'rgba(210,240,255,0.35)'],
        ['0.58', a],
        ['1', b],
      ] as Stops,
      paint: { fill: '#ffffff', contrast: 'rgba(0,90,170,0.85)', petals: AERO_PETALS },
      gloss: { height: 0.44, bottom: 22, from: 0.8, to: 0.08 },
      edge: 'rgba(255,255,255,0.75)',
      ring: undefined,
      shadow: '0 6px 14px rgba(0, 50, 110, 0.28)',
      glyphShadow: true,
      glow: false,
      calendar: { top: '#ff3b30', num: '#ffffff' },
    };
  }
  if (theme === 'night') {
    return {
      angle: 180,
      stops: [
        ['0', '#2a2d33'],
        ['1', '#17191d'],
      ] as Stops,
      paint: { fill: glyphFill, contrast: '#15181c', petals: NIGHT_PETALS },
      gloss: undefined,
      edge: 'rgba(255,255,255,0.12)',
      ring: undefined,
      shadow: '0 6px 14px rgba(0, 0, 0, 0.45)',
      glyphShadow: false,
      glow: true,
      calendar: { top: '#ff5a5f', num: '#eafffb' },
    };
  }
  return {
    angle: hot ? 180 : 145,
    stops: (hot
      ? [
          ['0', '#ffc0e6'],
          ['0.55', '#ff5cb6'],
          ['1', '#e3268f'],
        ]
      : [
          ['0', '#ffffff'],
          ['0.18', '#f3ecff'],
          ['0.40', '#c4bde0'],
          ['0.52', '#ffffff'],
          ['0.72', '#d4cdea'],
          ['1', '#fbf9ff'],
        ]) as Stops,
    paint: hot
      ? { fill: '#ffffff', contrast: '#ef3f9f', petals: WHITE_PETALS }
      : { fill: glyphFill, contrast: '#f6f0ff', petals: Y2K_PETALS },
    gloss: { height: 0.4, bottom: 20, from: 0.75, to: 0 },
    edge: hot ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.95)',
    ring: hot ? undefined : 'rgba(255,160,220,0.28)',
    shadow: hot ? '0 6px 14px rgba(200, 40, 140, 0.35)' : '0 6px 14px rgba(150, 60, 160, 0.28)',
    glyphShadow: false,
    glow: false,
    calendar: hot ? { top: '#ffffff', num: '#ffffff' } : { top: '#e0339a', num: '#b0267e' },
  };
}

// The glyphs use a 24 pt grid drawn into a 31.2-unit viewBox (home2.html pads by 3.6 units),
// so one icon pixel at the mockup's 81 px size is 31.2 / 81 units.
const VB = 31.2;
const PX = VB / 81;
const O = -3.6;

/** Gloss highlight from `.ic::before`: 6 px inset, round top and a soft oval bottom. */
function glossPath(heightFraction: number, bottomRadius: number) {
  const x = O + 6 * PX;
  const y = O + 3 * PX;
  const w = VB - 12 * PX;
  const h = VB * heightFraction;
  const r = 15 * PX;
  const ry = bottomRadius * PX;
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

/** Rounded tile inset by `inset` px, for the background and the edge strokes. */
function Tile({ inset = 0, ...paint }: { inset?: number; fill?: string; stroke?: string; strokeWidth?: number }) {
  const d = inset * PX;
  return <Rect x={O + d} y={O + d} width={VB - 2 * d} height={VB - 2 * d} rx={(19 - inset) * PX} {...paint} />;
}

/**
 * Themed app icon from home2.html, drawn entirely in SVG so it renders the same everywhere,
 * including in exports:
 * - Y2K: polished chrome with a hot-pink glyph, or pink jelly with a white glyph.
 * - Aero: glossy tinted glass with a white glyph and a soft drop shadow.
 * - Night: dark tinted tile with a neon glyph.
 */
export function ThemeIcon({ name, size, theme = 'y2k', hot = false, tint = 'aqua', date = new Date() }: Props) {
  const id = useId().replace(/:/g, '');
  const glyphFill = `url(#g${id})`;
  const style = iconStyle(theme, hot, tint, glyphFill);
  const shadowPaint = {
    fill: 'rgba(0,40,90,0.35)',
    contrast: 'rgba(0,40,90,0.35)',
    petals: AERO_PETALS.map(() => 'rgba(0,40,90,0.35)'),
  };
  const glowPaint = { fill: '#50ffdc', contrast: '#50ffdc', petals: NIGHT_PETALS };

  const glyph = (paint: typeof style.paint) =>
    name === 'calendar' ? (
      <G>
        <SvgText x={12} y={8.6} fontSize={3.6} fontFamily={Geist.bold} textAnchor="middle" fill={style.calendar.top}>
          {date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
        </SvgText>
        <SvgText x={12} y={19.4} fontSize={12} fontFamily={Geist.light} textAnchor="middle" fill={style.calendar.num}>
          {date.getDate()}
        </SvgText>
      </G>
    ) : (
      glyphs[name](paint)
    );

  return (
    <View style={{ width: size, height: size, borderRadius: (19 * size) / 81, boxShadow: style.shadow }}>
      <Svg width={size} height={size} viewBox={`${O} ${O} ${VB} ${VB}`}>
        <Defs>
          <LinearGradient id={`t${id}`} {...direction(style.angle)}>
            {style.stops.map(([offset, color]) => (
              <Stop key={offset} offset={offset} stopColor={color} />
            ))}
          </LinearGradient>
          {theme === 'night' ? (
            <LinearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#7dfff0" />
              <Stop offset="1" stopColor="#3aa6ff" />
            </LinearGradient>
          ) : (
            <LinearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#ff6fc0" />
              <Stop offset="1" stopColor="#d9269a" />
            </LinearGradient>
          )}
          {style.gloss && (
            <LinearGradient id={`s${id}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#ffffff" stopOpacity={style.gloss.from} />
              <Stop offset="1" stopColor="#ffffff" stopOpacity={style.gloss.to} />
            </LinearGradient>
          )}
        </Defs>

        <Tile fill={`url(#t${id})`} />
        {style.ring && <Tile inset={1.25} fill="none" stroke={style.ring} strokeWidth={2.5 * PX} />}
        {/* Aero's drop shadow and Night's neon glow: the glyph again, offset or enlarged, underneath. */}
        {style.glyphShadow && name !== 'calendar' && <G transform={`translate(0 ${1.5 * PX})`}>{glyph(shadowPaint)}</G>}
        {style.glow && name !== 'calendar' && (
          <G opacity={0.3} transform="translate(12 12) scale(1.1) translate(-12 -12)">
            {glyph(glowPaint)}
          </G>
        )}
        {glyph(style.paint)}
        {style.gloss && <Path d={glossPath(style.gloss.height, style.gloss.bottom)} fill={`url(#s${id})`} />}
        <Tile inset={0.5} fill="none" stroke={style.edge} strokeWidth={PX} />
      </Svg>
    </View>
  );
}
