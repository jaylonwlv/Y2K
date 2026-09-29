import type { ThemeKey } from '@/components/widgets/tokens';

import type { GlyphName } from './glyphs';
import type { AeroTint } from './theme-icon';

/** Widgets the home preview can place. `weather` and `worldClocks` are medium (4 columns wide). */
export type WidgetKind = 'mixtape' | 'calendar' | 'clock' | 'weather' | 'worldClocks';

type Spot = readonly [col: number, row: number];

export type HomeApp = { name: GlyphName | 'calendar'; hot?: boolean; tint?: AeroTint };

export type HomeSetup = {
  widgets: { kind: WidgetKind; at: Spot }[];
  icons: { app: HomeApp; at: Spot }[];
  dock: HomeApp[];
};

// MARK: Y2K Pink Chrome — the four layouts from home2.html (`Y_LAYOUTS`).

const Y2K_APPS: HomeApp[] = [
  { name: 'messages', hot: true },
  { name: 'clock' },
  { name: 'photos' },
  { name: 'music', hot: true },
  { name: 'heart', hot: true },
  { name: 'star' },
  { name: 'mail' },
  { name: 'shop', hot: true },
  { name: 'notes' },
  { name: 'games', hot: true },
  { name: 'saved', hot: true },
  { name: 'maps' },
];

const Y2K_DOCK: HomeApp[] = [
  { name: 'phone', hot: true },
  { name: 'browser' },
  { name: 'camera', hot: true },
  { name: 'settings' },
];

/** [mixtape, calendar, icon cells, which app goes in each cell] */
const Y2K_VARIANTS: [Spot, Spot, Spot[], number[]][] = [
  [
    [0, 0],
    [2, 3],
    [
      [2, 0],
      [3, 0],
      [2, 1],
      [3, 1],
      [0, 2],
      [1, 2],
      [2, 2],
      [3, 2],
      [0, 3],
      [1, 3],
      [0, 4],
      [1, 4],
    ],
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  ],
  [
    [2, 0],
    [0, 3],
    [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
      [3, 2],
      [2, 3],
      [3, 3],
      [2, 4],
      [3, 4],
    ],
    [3, 0, 6, 1, 4, 9, 2, 7, 5, 11, 8, 10],
  ],
  [
    [2, 0],
    [0, 0],
    [
      [0, 2],
      [1, 2],
      [2, 2],
      [3, 2],
      [0, 3],
      [1, 3],
      [2, 3],
      [3, 3],
      [0, 4],
      [1, 4],
      [2, 4],
      [3, 4],
    ],
    [4, 1, 0, 7, 2, 6, 3, 9, 11, 5, 10, 8],
  ],
  [
    [0, 2],
    [2, 2],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
      [0, 4],
      [1, 4],
      [2, 4],
      [3, 4],
    ],
    [0, 6, 4, 1, 3, 9, 2, 7, 10, 5, 11, 8],
  ],
];

const Y2K_LAYOUTS: HomeSetup[] = Y2K_VARIANTS.map(([mixtape, calendar, cells, order]) => ({
  widgets: [
    { kind: 'mixtape', at: mixtape },
    { kind: 'calendar', at: calendar },
  ],
  icons: cells.map((at, i) => ({ app: Y2K_APPS[order[i]], at })),
  dock: Y2K_DOCK,
}));

// MARK: Frutiger Aero — the mockup's layout, then one featuring the real widgets.

const aero = (name: HomeApp['name'], tint: AeroTint): HomeApp => ({ name, tint });

const AERO_DOCK = [aero('phone', 'green'), aero('browser', 'blue'), aero('wallet', 'teal'), aero('games', 'orange')];

const AERO_LAYOUTS: HomeSetup[] = [
  {
    widgets: [
      { kind: 'weather', at: [0, 0] },
      { kind: 'clock', at: [0, 4] },
    ],
    icons: [
      { app: aero('messages', 'green'), at: [0, 2] },
      { app: aero('camera', 'sky'), at: [1, 2] },
      { app: aero('photos', 'aqua'), at: [2, 2] },
      { app: aero('music', 'orange'), at: [3, 2] },
      { app: aero('mail', 'blue'), at: [0, 3] },
      { app: aero('maps', 'green'), at: [1, 3] },
      { app: aero('weather', 'sky'), at: [2, 3] },
      { app: aero('notes', 'orange'), at: [3, 3] },
      { app: aero('calendar', 'aqua'), at: [2, 4] },
      { app: aero('clock', 'teal'), at: [3, 4] },
      { app: aero('settings', 'sky'), at: [2, 5] },
      { app: aero('heart', 'teal'), at: [3, 5] },
    ],
    dock: AERO_DOCK,
  },
  {
    widgets: [
      { kind: 'mixtape', at: [0, 0] },
      { kind: 'calendar', at: [2, 0] },
      { kind: 'clock', at: [0, 4] },
    ],
    icons: [
      { app: aero('photos', 'aqua'), at: [0, 2] },
      { app: aero('music', 'orange'), at: [1, 2] },
      { app: aero('messages', 'green'), at: [2, 2] },
      { app: aero('camera', 'sky'), at: [3, 2] },
      { app: aero('weather', 'sky'), at: [0, 3] },
      { app: aero('mail', 'blue'), at: [1, 3] },
      { app: aero('notes', 'orange'), at: [2, 3] },
      { app: aero('maps', 'green'), at: [3, 3] },
      { app: aero('calendar', 'aqua'), at: [2, 4] },
      { app: aero('settings', 'sky'), at: [3, 4] },
      { app: aero('heart', 'teal'), at: [2, 5] },
      { app: aero('clock', 'teal'), at: [3, 5] },
    ],
    dock: AERO_DOCK,
  },
];

// MARK: Aero Night — the mockup's world clocks, then calendar + analog clock.

const NIGHT_DOCK: HomeApp[] = [{ name: 'phone' }, { name: 'browser' }, { name: 'wallet' }, { name: 'star' }];

const NIGHT_GRID: HomeApp['name'][] = [
  'messages',
  'calc',
  'photos',
  'mail',
  'clock',
  'music',
  'calendar',
  'games',
  'camera',
  'maps',
  'notes',
  'weather',
  'settings',
];

const NIGHT_LAYOUTS: HomeSetup[] = [
  {
    widgets: [{ kind: 'worldClocks', at: [0, 0] }],
    icons: NIGHT_GRID.map((name, i) => ({ app: { name }, at: [i % 4, 2 + Math.floor(i / 4)] as const })),
    dock: NIGHT_DOCK,
  },
  {
    widgets: [
      { kind: 'calendar', at: [0, 0] },
      { kind: 'clock', at: [2, 0] },
    ],
    icons: NIGHT_GRID.map((name, i) => ({ app: { name }, at: [i % 4, 2 + Math.floor(i / 4)] as const })),
    dock: NIGHT_DOCK,
  },
];

export const HOME_LAYOUTS: Record<ThemeKey, HomeSetup[]> = {
  y2k: Y2K_LAYOUTS,
  aero: AERO_LAYOUTS,
  night: NIGHT_LAYOUTS,
};
