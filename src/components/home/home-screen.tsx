import { Image } from 'expo-image';
import { StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import Animated, { LinearTransition, ZoomIn } from 'react-native-reanimated';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { CalendarPreview } from '@/components/widgets/calendar-preview';
import { MixtapePreview } from '@/components/widgets/mixtape-preview';
import { Geist } from '@/components/widgets/tokens';
import { cellOrigin, homeGrid, type HomeGrid } from '@/lib/home-grid';

import { Y2K_APPS, Y2K_DOCK, Y2K_LAYOUTS } from './layouts';
import { ThemeIcon } from './theme-icon';

type Props = {
  width: number;
  height: number;
  wallpaper: ImageSourcePropType;
  layout?: number;
  mixtape: { title: string; subtitle: string; coverUri?: string };
  /** Draw a fake 9:41 status bar and Dynamic Island (for exports; on device the real one shows). */
  statusBar?: boolean;
  /** Pop icons in and glide them between layouts. Off for exports, which must render instantly. */
  animated?: boolean;
};

/**
 * The full Y2K home screen from home2.html, built from the real grid: wallpaper, Mixtape and
 * Calendar widgets, 12 chrome/jelly icons, search pill and dock.
 */
export function HomeScreen({ width, height, wallpaper, layout = 0, mixtape, statusBar, animated }: Props) {
  const grid = homeGrid(width, height);
  const s = width / 440;
  const L = Y2K_LAYOUTS[layout % Y2K_LAYOUTS.length];
  const dockTop = height - 119 * s;

  // Each item pops in 35 ms after the previous one.
  let order = 0;
  const pop = () => {
    const delay = 120 + order++ * 35;
    return animated ? ZoomIn.delay(delay).springify().damping(14) : undefined;
  };
  const glide = animated ? LinearTransition.springify().damping(18) : undefined;

  return (
    <View style={[styles.screen, { width, height }]}>
      <Image source={wallpaper} style={StyleSheet.absoluteFill} contentFit="cover" />

      {statusBar && <FakeStatusBar s={s} />}

      <Animated.View entering={pop()} layout={glide} style={[styles.abs, cellOrigin(grid, ...L.mixtape)]}>
        <MixtapePreview size={grid.small} {...mixtape} />
      </Animated.View>
      <Animated.View entering={pop()} layout={glide} style={[styles.abs, cellOrigin(grid, ...L.calendar)]}>
        <CalendarPreview size={grid.small} />
      </Animated.View>

      {L.cells.map((cell, i) => {
        const app = Y2K_APPS[L.order[i]];
        return (
          <Animated.View key={app.name} entering={pop()} layout={glide} style={[styles.abs, cellOrigin(grid, ...cell)]}>
            <ThemeIcon name={app.name} hot={app.hot} size={grid.icon} />
          </Animated.View>
        );
      })}

      <SearchPill s={s} top={dockTop - 54 * s} width={width} />
      <Dock grid={grid} s={s} top={dockTop} />
    </View>
  );
}

function SearchPill({ s, top, width }: { s: number; top: number; width: number }) {
  return (
    <View style={[styles.abs, { top, width, alignItems: 'center' }]}>
      <View
        style={[
          styles.search,
          { height: 30 * s, borderRadius: 15 * s, paddingLeft: 11 * s, paddingRight: 13 * s, gap: 5 * s },
        ]}>
        <Svg width={14 * s} height={14 * s} viewBox="0 0 24 24" fill="none">
          <Circle cx={10.5} cy={10.5} r={6.5} stroke="#6b1a55" strokeWidth={3} />
          <Path d="M15.5 15.5L20 20" stroke="#6b1a55" strokeWidth={3} strokeLinecap="round" />
        </Svg>
        <Text style={[styles.searchText, { fontSize: 16 * s }]}>Search</Text>
      </View>
    </View>
  );
}

function Dock({ grid, s, top }: { grid: HomeGrid; s: number; top: number }) {
  return (
    <View style={[styles.dock, { top, left: 12 * s, right: 12 * s, height: 103 * s, borderRadius: 50 * s }]}>
      {Y2K_DOCK.map((app, i) => (
        <View key={app.name} style={[styles.abs, { left: grid.margin + i * grid.pitch - 12 * s, top: 11 * s }]}>
          <ThemeIcon name={app.name} hot={app.hot} size={grid.icon} />
        </View>
      ))}
    </View>
  );
}

function FakeStatusBar({ s }: { s: number }) {
  const ink = '#1a0a16';
  return (
    <>
      <View
        style={[
          styles.island,
          { top: 11 * s, width: 126 * s, height: 37 * s, borderRadius: 19 * s, marginLeft: -63 * s },
        ]}
      />
      <Text style={[styles.abs, styles.time, { left: 44 * s, top: 19 * s, fontSize: 17.5 * s }]}>9:41</Text>
      <View style={[styles.abs, styles.statusRight, { right: 34 * s, top: 22 * s, gap: 7 * s }]}>
        <Svg width={19 * s} height={12 * s} viewBox="0 0 19 12" fill={ink}>
          <Rect x={0} y={8.2} width={3.2} height={3.8} rx={1} />
          <Rect x={5.2} y={5.6} width={3.2} height={6.4} rx={1} />
          <Rect x={10.4} y={2.9} width={3.2} height={9.1} rx={1} />
          <Rect x={15.6} y={0} width={3.2} height={12} rx={1} />
        </Svg>
        <Svg width={17 * s} height={12 * s} viewBox="0 0 16 12" fill={ink}>
          <Path d="M8 2.5c2.3 0 4.4.9 6 2.4l1.2-1.3A10.3 10.3 0 008 .7C5.2.7 2.7 1.8.8 3.6L2 4.9A8.5 8.5 0 018 2.5zm0 3.6c1.3 0 2.5.5 3.4 1.3l1.2-1.3A6.8 6.8 0 008 4.3c-1.8 0-3.4.7-4.6 1.8l1.2 1.3c.9-.8 2.1-1.3 3.4-1.3zM8 9.4a1.4 1.4 0 100 2.8 1.4 1.4 0 000-2.8z" />
        </Svg>
        <Svg width={28 * s} height={13 * s} viewBox="0 0 28 13">
          <Rect x={0.5} y={0.5} width={24} height={12} rx={4} fill="none" stroke={ink} opacity={0.4} />
          <Rect x={2} y={2} width={17} height={9} rx={2.5} fill={ink} />
          <Path d="M26 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill={ink} opacity={0.4} />
        </Svg>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { overflow: 'hidden', backgroundColor: '#f4c6ec' },
  abs: { position: 'absolute' },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  searchText: { fontFamily: Geist.medium, color: '#6b1a55' },
  dock: {
    position: 'absolute',
    borderCurve: 'continuous',
    experimental_backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,220,245,0.25) 100%)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
  },
  island: { position: 'absolute', left: '50%', backgroundColor: '#000' },
  time: { fontFamily: Geist.semibold, color: '#1a0a16', letterSpacing: -0.2 },
  statusRight: { flexDirection: 'row', alignItems: 'center' },
});
