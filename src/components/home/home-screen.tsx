import { Image } from 'expo-image';
import { StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import Animated, { LinearTransition, ZoomIn } from 'react-native-reanimated';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { CalendarPreview } from '@/components/widgets/calendar-preview';
import { ClockPreview } from '@/components/widgets/clock-preview';
import { MixtapePreview } from '@/components/widgets/mixtape-preview';
import { Geist, type ThemeKey } from '@/components/widgets/tokens';
import { WeatherPreview } from '@/components/widgets/weather-preview';
import { WorldClocksPreview } from '@/components/widgets/world-clocks-preview';
import { cellOrigin, homeGrid, type HomeGrid } from '@/lib/home-grid';

import { HOME_LAYOUTS, type HomeApp, type WidgetKind } from './layouts';
import { ThemeIcon } from './theme-icon';

type Props = {
  width: number;
  height: number;
  theme: ThemeKey;
  wallpaper: ImageSourcePropType;
  layout?: number;
  mixtape: { title: string; subtitle: string; coverUri?: string };
  /** Time shown on clocks and the calendar. */
  date?: Date;
  /** Draw a fake 9:41 status bar and Dynamic Island (for exports; on device the real one shows). */
  statusBar?: boolean;
  /** Pop icons in and glide them between layouts. Off for exports, which must render instantly. */
  animated?: boolean;
};

/** Search pill, dock and status bar colours per theme (`.search`, `.dock`, `.status` in home2.html). */
const CHROME: Record<
  ThemeKey,
  { searchBg: string; searchEdge: string; searchInk: string; dock: string; dockEdge: string; status: string }
> = {
  y2k: {
    searchBg: 'rgba(255,255,255,0.55)',
    searchEdge: 'rgba(255,255,255,0.8)',
    searchInk: '#6b1a55',
    dock: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,220,245,0.25) 100%)',
    dockEdge: 'rgba(255,255,255,0.75)',
    status: '#1a0a16',
  },
  aero: {
    searchBg: 'rgba(255,255,255,0.35)',
    searchEdge: 'rgba(255,255,255,0.6)',
    searchInk: '#ffffff',
    dock: 'linear-gradient(180deg, rgba(255,255,255,0.42) 0%, rgba(230,250,255,0.22) 100%)',
    dockEdge: 'rgba(255,255,255,0.6)',
    status: '#ffffff',
  },
  night: {
    searchBg: 'rgba(30,32,38,0.72)',
    searchEdge: 'rgba(255,255,255,0.12)',
    searchInk: '#ffffff',
    dock: 'linear-gradient(180deg, rgba(28,30,36,0.62) 0%, rgba(28,30,36,0.62) 100%)',
    dockEdge: 'rgba(255,255,255,0.08)',
    status: '#ffffff',
  },
};

/**
 * A full themed home screen from home2.html, built on the real grid: wallpaper, widgets, icons,
 * search pill and dock.
 */
export function HomeScreen({
  width,
  height,
  theme,
  wallpaper,
  layout = 0,
  mixtape,
  date = new Date(),
  statusBar,
  animated,
}: Props) {
  const grid = homeGrid(width, height);
  const s = width / 440;
  const layouts = HOME_LAYOUTS[theme];
  const setup = layouts[layout % layouts.length];
  const dockTop = height - 119 * s;
  const chrome = CHROME[theme];

  // Each item pops in 35 ms after the previous one.
  let order = 0;
  const pop = () => {
    const delay = 120 + order++ * 35;
    return animated ? ZoomIn.delay(delay).springify().damping(14) : undefined;
  };
  const glide = animated ? LinearTransition.springify().damping(18) : undefined;

  const widget = (kind: WidgetKind) => {
    switch (kind) {
      case 'mixtape':
        return <MixtapePreview size={grid.small} theme={theme} {...mixtape} />;
      case 'calendar':
        return <CalendarPreview size={grid.small} theme={theme} date={date} />;
      case 'clock':
        return <ClockPreview size={grid.small} theme={theme} date={date} />;
      case 'weather':
        return <WeatherPreview width={grid.medium} height={grid.small} theme={theme} />;
      case 'worldClocks':
        return <WorldClocksPreview width={grid.medium} height={grid.small} theme={theme} date={date} />;
    }
  };

  return (
    <View style={[styles.screen, { width, height }]}>
      <Image source={wallpaper} style={StyleSheet.absoluteFill} contentFit="cover" />

      {statusBar && <FakeStatusBar s={s} ink={chrome.status} />}

      {setup.widgets.map(({ kind, at }) => (
        <Animated.View key={`w-${kind}`} entering={pop()} layout={glide} style={[styles.abs, cellOrigin(grid, ...at)]}>
          {widget(kind)}
        </Animated.View>
      ))}

      {setup.icons.map(({ app, at }) => (
        <Animated.View key={app.name} entering={pop()} layout={glide} style={[styles.abs, cellOrigin(grid, ...at)]}>
          <AppIcon app={app} theme={theme} size={grid.icon} date={date} />
        </Animated.View>
      ))}

      <View style={[styles.abs, { top: dockTop - 54 * s, width, alignItems: 'center' }]}>
        <View
          style={[
            styles.search,
            {
              backgroundColor: chrome.searchBg,
              borderColor: chrome.searchEdge,
              height: 30 * s,
              borderRadius: 15 * s,
              paddingLeft: 11 * s,
              paddingRight: 13 * s,
              gap: 5 * s,
            },
          ]}>
          <Svg width={14 * s} height={14 * s} viewBox="0 0 24 24" fill="none">
            <Circle cx={10.5} cy={10.5} r={6.5} stroke={chrome.searchInk} strokeWidth={3} />
            <Path d="M15.5 15.5L20 20" stroke={chrome.searchInk} strokeWidth={3} strokeLinecap="round" />
          </Svg>
          <Text style={[styles.searchText, { color: chrome.searchInk, fontSize: 16 * s }]}>Search</Text>
        </View>
      </View>

      <Dock grid={grid} s={s} top={dockTop} theme={theme} apps={setup.dock} date={date} />
    </View>
  );
}

function AppIcon({ app, theme, size, date }: { app: HomeApp; theme: ThemeKey; size: number; date: Date }) {
  return <ThemeIcon name={app.name} theme={theme} hot={app.hot} tint={app.tint} size={size} date={date} />;
}

function Dock({
  grid,
  s,
  top,
  theme,
  apps,
  date,
}: {
  grid: HomeGrid;
  s: number;
  top: number;
  theme: ThemeKey;
  apps: HomeApp[];
  date: Date;
}) {
  const chrome = CHROME[theme];
  return (
    <View
      style={[
        styles.dock,
        {
          experimental_backgroundImage: chrome.dock,
          borderColor: chrome.dockEdge,
          top,
          left: 12 * s,
          right: 12 * s,
          height: 103 * s,
          borderRadius: 50 * s,
        },
      ]}>
      {apps.map((app, i) => (
        <View key={app.name} style={[styles.abs, { left: grid.margin + i * grid.pitch - 12 * s, top: 11 * s }]}>
          <AppIcon app={app} theme={theme} size={grid.icon} date={date} />
        </View>
      ))}
    </View>
  );
}

function FakeStatusBar({ s, ink }: { s: number; ink: string }) {
  return (
    <>
      <View
        style={[
          styles.island,
          { top: 11 * s, width: 126 * s, height: 37 * s, borderRadius: 19 * s, marginLeft: -63 * s },
        ]}
      />
      <Text style={[styles.abs, styles.time, { color: ink, left: 44 * s, top: 19 * s, fontSize: 17.5 * s }]}>9:41</Text>
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
  screen: { overflow: 'hidden' },
  abs: { position: 'absolute' },
  search: { flexDirection: 'row', alignItems: 'center', borderWidth: 0.5 },
  searchText: { fontFamily: Geist.medium },
  dock: { position: 'absolute', borderCurve: 'continuous', borderWidth: 1 },
  island: { position: 'absolute', left: '50%', backgroundColor: '#000' },
  time: { fontFamily: Geist.semibold, letterSpacing: -0.2 },
  statusRight: { flexDirection: 'row', alignItems: 'center' },
});
