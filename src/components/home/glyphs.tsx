import type { ReactNode } from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

/**
 * Original filled glyphs on a 24 pt grid, ported from home2.html. No real app logos.
 * `fill` is the glyph colour, `contrast` the colour for holes and details.
 */
export type GlyphName =
  | 'phone'
  | 'messages'
  | 'camera'
  | 'music'
  | 'photos'
  | 'mail'
  | 'maps'
  | 'notes'
  | 'clock'
  | 'settings'
  | 'browser'
  | 'heart'
  | 'games'
  | 'saved'
  | 'shop'
  | 'star';

type Paint = { fill: string; contrast: string; petals: readonly string[] };

const EIGHT = [0, 45, 90, 135, 180, 225, 270, 315];

export const glyphs: Record<GlyphName, (p: Paint) => ReactNode> = {
  phone: ({ fill }) => (
    <Path
      fill={fill}
      d="M6.6 2.8c.6-.4 1.4-.3 1.9.2l2.3 2.6c.5.6.5 1.4.1 2l-1.3 1.8c1 2.2 2.8 4 5 5l1.8-1.3c.6-.4 1.4-.4 2 .1l2.6 2.3c.5.5.6 1.3.2 1.9l-1.2 1.8c-.6.9-1.7 1.3-2.7 1.1C9.9 19.2 4.8 14.1 3.7 6.7c-.2-1 .2-2.1 1.1-2.7z"
    />
  ),
  messages: ({ fill }) => (
    <Path
      fill={fill}
      d="M12 3.2c-5.4 0-9.8 3.5-9.8 7.8 0 2.4 1.3 4.5 3.4 5.9-.2 1.3-.9 2.5-2 3.3 2 .1 3.8-.6 5.1-1.6 1.1.2 2.2.4 3.3.4 5.4 0 9.8-3.5 9.8-7.9S17.4 3.2 12 3.2z"
    />
  ),
  camera: ({ fill }) => (
    <G>
      <Path
        fill={fill}
        fillRule="evenodd"
        d="M4.2 7h2.9l1.5-2.1c.3-.5.9-.8 1.5-.8h3.8c.6 0 1.2.3 1.5.8L16.9 7h2.9A2.2 2.2 0 0122 9.2v8.6a2.2 2.2 0 01-2.2 2.2H4.2A2.2 2.2 0 012 17.8V9.2A2.2 2.2 0 014.2 7zM12 8.9a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
      />
      <Circle cx={12} cy={13.4} r={2.7} fill={fill} opacity={0.8} />
    </G>
  ),
  music: ({ fill }) => (
    <Path fill={fill} d="M20 3.2v12.4a3.1 3.1 0 11-2-2.9V7.4l-8.3 1.9v8.3a3.1 3.1 0 11-2-2.9V5.8z" />
  ),
  photos: ({ petals }) => (
    <G transform="translate(12 12)">
      {EIGHT.map((a, i) => (
        <Ellipse key={a} cx={0} cy={-5.2} rx={2.9} ry={4.6} transform={`rotate(${a})`} fill={petals[i]} opacity={0.9} />
      ))}
    </G>
  ),
  mail: ({ fill, contrast }) => (
    <G>
      <Rect x={2.5} y={5} width={19} height={14} rx={2.6} fill={fill} />
      <Path d="M3.4 6.6l8.6 6.2 8.6-6.2" fill="none" stroke={contrast} strokeWidth={1.7} strokeLinejoin="round" />
    </G>
  ),
  maps: ({ fill }) => (
    <Path
      fill={fill}
      fillRule="evenodd"
      d="M12 2.2a7.1 7.1 0 00-7.1 7.1c0 5.2 7.1 12.5 7.1 12.5s7.1-7.3 7.1-12.5A7.1 7.1 0 0012 2.2zm0 4.3a2.8 2.8 0 110 5.6 2.8 2.8 0 010-5.6z"
    />
  ),
  notes: ({ fill, contrast }) => (
    <G>
      <Rect x={4} y={3} width={16} height={18} rx={2.6} fill={fill} />
      <Path d="M7.5 8.5h9M7.5 12h9M7.5 15.5h5.5" stroke={contrast} strokeWidth={1.6} strokeLinecap="round" />
    </G>
  ),
  clock: ({ fill, contrast }) => (
    <G>
      <Circle cx={12} cy={12} r={9.2} fill={fill} />
      <Path d="M12 6.6V12l3.6 2.2" stroke={contrast} strokeWidth={1.8} strokeLinecap="round" fill="none" />
    </G>
  ),
  settings: ({ fill, contrast }) => (
    <G transform="translate(12 12)">
      {EIGHT.map((a) => (
        <Rect key={a} x={-1.7} y={-9.6} width={3.4} height={4.4} rx={0.9} transform={`rotate(${a})`} fill={fill} />
      ))}
      <Circle r={6.8} fill={fill} />
      <Circle r={2.8} fill={contrast} />
    </G>
  ),
  browser: ({ fill, contrast }) => (
    <G>
      <Circle cx={12} cy={12} r={9.2} fill={fill} />
      <Path d="M12 12l4.6-4.6-2.4 6.9z" fill="#ff5a5f" />
      <Path d="M12 12l-4.6 4.6 2.4-6.9z" fill={contrast} />
    </G>
  ),
  heart: ({ fill }) => (
    <Path fill={fill} d="M12 20.8s-8.1-5.2-8.1-11.1A4.8 4.8 0 0112 6.4a4.8 4.8 0 018.1 3.3c0 5.9-8.1 11.1-8.1 11.1z" />
  ),
  games: ({ fill, contrast }) => (
    <G>
      <Path
        fill={fill}
        d="M7.2 7.8h9.6a5.1 5.1 0 015.1 5.1v.9a4 4 0 01-7 2.7l-.8-.8H9.9l-.8.8a4 4 0 01-7-2.7v-.9a5.1 5.1 0 015.1-5.1z"
      />
      <Path d="M7.4 10.6v3.6M5.6 12.4h3.6" stroke={contrast} strokeWidth={1.6} strokeLinecap="round" />
      <Circle cx={16.4} cy={11.4} r={1} fill={contrast} />
      <Circle cx={18.2} cy={13.3} r={1} fill={contrast} />
    </G>
  ),
  saved: ({ fill }) => <Path fill={fill} d="M6.5 3h11a1.8 1.8 0 011.8 1.8V21L12 17.4 4.7 21V4.8A1.8 1.8 0 016.5 3z" />,
  shop: ({ fill }) => (
    <G>
      <Path fill={fill} d="M5.8 8.2h12.4l-1 12.2H6.8z" />
      <Path d="M9 9V7.3a3 3 0 016 0V9" fill="none" stroke={fill} strokeWidth={1.8} />
    </G>
  ),
  star: ({ fill }) => (
    <Path fill={fill} d="M12 2.8l2.8 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17.1l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9z" />
  ),
};
