import { useId } from 'react';
import Svg, { Circle, Defs, Line, RadialGradient, Stop, Text as SvgText } from 'react-native-svg';

import { Geist } from './tokens';

export type FaceStyle = 'aero' | 'night' | 'nightLit' | 'y2k';

type Props = { size: number; hours: number; minutes: number; style: FaceStyle; numerals?: boolean };

const FACES: Record<
  FaceStyle,
  { stops: [string, string][]; ring: string; hour: string; minute: string; tick: string; text: string }
> = {
  // Glossy sky-blue dial (Aero clock in home2.html).
  aero: {
    stops: [
      ['0', '#ffffff'],
      ['0.55', '#e6f7ff'],
      ['1', '#b5e2fa'],
    ],
    ring: 'rgba(255,255,255,0.95)',
    hour: '#073f6e',
    minute: '#0b5a96',
    tick: '#0b5a96',
    text: '#063a66',
  },
  // Dark dial with a neon rim (Night world clocks).
  night: {
    stops: [
      ['0', '#0e1114'],
      ['1', '#0e1114'],
    ],
    ring: 'rgba(95,255,224,0.35)',
    hour: '#e8fffb',
    minute: '#e8fffb',
    tick: 'rgba(232,255,251,0.6)',
    text: '#e8fffb',
  },
  // Glowing mint dial for cities where it's daytime.
  nightLit: {
    stops: [
      ['0', '#d9fff8'],
      ['0.6', '#8ff5e6'],
      ['1', '#4fd6d0'],
    ],
    ring: 'rgba(255,255,255,0.6)',
    hour: '#062a2c',
    minute: '#062a2c',
    tick: 'rgba(6,42,44,0.6)',
    text: '#062a2c',
  },
  // Chrome dial with pink hands.
  y2k: {
    stops: [
      ['0', '#ffffff'],
      ['0.55', '#efe9fb'],
      ['1', '#c4bde0'],
    ],
    ring: 'rgba(255,255,255,0.95)',
    hour: '#7d1a63',
    minute: '#e0339a',
    tick: '#b0267e',
    text: '#7d1a63',
  },
};

/** Analog clock face in a 100-unit box: ticks or numerals, hour/minute hands and an orange second hand. */
export function AnalogFace({ size, hours, minutes, style, numerals }: Props) {
  const id = useId().replace(/:/g, '');
  const face = FACES[style];
  const hand = (deg: number, length: number, tail = 0) => {
    const a = (deg * Math.PI) / 180;
    return {
      x1: 50 - Math.sin(a) * tail,
      y1: 50 + Math.cos(a) * tail,
      x2: 50 + Math.sin(a) * length,
      y2: 50 - Math.cos(a) * length,
    };
  };
  const hourDeg = ((hours % 12) + minutes / 60) * 30;
  const minuteDeg = minutes * 6;
  // The second hand is decoration: widgets refresh once a minute.
  const secondDeg = 200;

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <RadialGradient id={id} cx="35%" cy="28%" r="80%">
          {face.stops.map(([offset, color]) => (
            <Stop key={offset} offset={offset} stopColor={color} />
          ))}
        </RadialGradient>
      </Defs>
      <Circle cx={50} cy={50} r={49} fill={`url(#${id})`} stroke={face.ring} strokeWidth={style === 'aero' ? 3 : 1.4} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        if (numerals) {
          return (
            <SvgText
              key={i}
              x={50 + Math.sin(a) * 38}
              y={50 - Math.cos(a) * 38 + 4.5}
              fontSize={13}
              fontFamily={Geist.semibold}
              textAnchor="middle"
              fill={face.text}>
              {i === 0 ? 12 : i}
            </SvgText>
          );
        }
        const major = i % 3 === 0;
        return (
          <Line
            key={i}
            x1={50 + Math.sin(a) * 45}
            y1={50 - Math.cos(a) * 45}
            x2={50 + Math.sin(a) * (major ? 39 : 42)}
            y2={50 - Math.cos(a) * (major ? 39 : 42)}
            stroke={face.tick}
            strokeWidth={major ? 2.2 : 1.4}
            strokeLinecap="round"
          />
        );
      })}
      <Line {...hand(hourDeg, 25, 2)} stroke={face.hour} strokeWidth={4.5} strokeLinecap="round" />
      <Line {...hand(minuteDeg, 37, 2)} stroke={face.minute} strokeWidth={2.8} strokeLinecap="round" />
      <Line {...hand(secondDeg, 40, 6)} stroke="#ff8a00" strokeWidth={1.1} strokeLinecap="round" />
      <Circle cx={50} cy={50} r={4} fill="#ff8a00" stroke="#ffffff" strokeWidth={1.5} />
    </Svg>
  );
}
