import type { GlyphName } from './glyphs';

/** The 12 home-screen apps in the Y2K theme; `hot` ones are pink jelly, the rest chrome. */
export const Y2K_APPS: { name: GlyphName; hot: boolean }[] = [
  { name: 'messages', hot: true },
  { name: 'clock', hot: false },
  { name: 'photos', hot: false },
  { name: 'music', hot: true },
  { name: 'heart', hot: true },
  { name: 'star', hot: false },
  { name: 'mail', hot: false },
  { name: 'shop', hot: true },
  { name: 'notes', hot: false },
  { name: 'games', hot: true },
  { name: 'saved', hot: true },
  { name: 'maps', hot: false },
];

export const Y2K_DOCK: { name: GlyphName; hot: boolean }[] = [
  { name: 'phone', hot: true },
  { name: 'browser', hot: false },
  { name: 'camera', hot: true },
  { name: 'settings', hot: false },
];

type Cell = readonly [col: number, row: number];

export type HomeLayout = {
  mixtape: Cell;
  calendar: Cell;
  /** Icon cells, in the order given by `order`. */
  cells: readonly Cell[];
  /** Which app (index into Y2K_APPS) goes in each cell, so layouts don't read as the same page. */
  order: readonly number[];
};

/** The four Y2K layouts from home2.html (`Y_LAYOUTS`). */
export const Y2K_LAYOUTS: readonly HomeLayout[] = [
  {
    mixtape: [0, 0],
    calendar: [2, 3],
    cells: [
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
    order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
  {
    mixtape: [2, 0],
    calendar: [0, 3],
    cells: [
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
    order: [3, 0, 6, 1, 4, 9, 2, 7, 5, 11, 8, 10],
  },
  {
    mixtape: [2, 0],
    calendar: [0, 0],
    cells: [
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
    order: [4, 1, 0, 7, 2, 6, 3, 9, 11, 5, 10, 8],
  },
  {
    mixtape: [0, 2],
    calendar: [2, 2],
    cells: [
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
    order: [0, 6, 4, 1, 3, 9, 2, 7, 10, 5, 11, 8],
  },
];
