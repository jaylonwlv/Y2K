import { useId } from 'react';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

import { Geist, Y2K } from './tokens';

type Props = { text: string; size: number; letterSpacing?: number; width?: number };

/** `.chrome` from home2.html: gradient-filled Geist Black with a hot-pink edge underneath. */
export function ChromeText({ text, size, letterSpacing = 0, width }: Props) {
  const id = useId().replace(/:/g, '');
  const w = width ?? Math.ceil(text.length * (size * 0.62 + letterSpacing) + size * 0.1);
  const h = size * 0.95;
  const baseline = size * 0.8;
  const common = { x: 0, fontFamily: Geist.black, fontSize: size, letterSpacing };
  return (
    <Svg width={w} height={h}>
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          {Y2K.chromeStops.map(([offset, color]) => (
            <Stop key={offset} offset={offset} stopColor={color} />
          ))}
        </LinearGradient>
      </Defs>
      <SvgText {...common} y={baseline + 1.5} fill={Y2K.chromeEdge}>
        {text}
      </SvgText>
      <SvgText {...common} y={baseline} fill={`url(#${id})`}>
        {text}
      </SvgText>
    </Svg>
  );
}
