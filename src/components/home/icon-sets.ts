import type { ThemeKey } from '@/components/widgets/tokens';

import type { GlyphName } from './glyphs';
import type { AeroTint } from './theme-icon';

export type IconChoice = { name: GlyphName; hot?: boolean; tint?: AeroTint };
export type IconSet = { title: string; blurb: string; icons: IconChoice[] };

/** Every glyph, with the kind of app it suits (shown under the icon; no brand names). */
export const GLYPH_USES: { name: GlyphName; use: string }[] = [
  { name: 'phone', use: 'Phone' },
  { name: 'messages', use: 'Messages' },
  { name: 'camera', use: 'Camera' },
  { name: 'photos', use: 'Photos' },
  { name: 'music', use: 'Music' },
  { name: 'mail', use: 'Mail' },
  { name: 'browser', use: 'Browser' },
  { name: 'maps', use: 'Maps' },
  { name: 'notes', use: 'Notes' },
  { name: 'clock', use: 'Clock' },
  { name: 'weather', use: 'Weather' },
  { name: 'settings', use: 'Settings' },
  { name: 'heart', use: 'Health & dating' },
  { name: 'star', use: 'Favourites' },
  { name: 'saved', use: 'Saved & boards' },
  { name: 'shop', use: 'Shopping' },
  { name: 'wallet', use: 'Wallet & banking' },
  { name: 'games', use: 'Games' },
  { name: 'calc', use: 'Calculator' },
];

/** Aero's tint for each glyph, following the mockup's colour choices. */
const AERO_TINT: Record<GlyphName, AeroTint> = {
  phone: 'green',
  messages: 'green',
  camera: 'sky',
  photos: 'aqua',
  music: 'orange',
  mail: 'blue',
  browser: 'blue',
  maps: 'green',
  notes: 'orange',
  clock: 'teal',
  weather: 'sky',
  settings: 'sky',
  heart: 'teal',
  star: 'orange',
  saved: 'aqua',
  shop: 'orange',
  wallet: 'teal',
  games: 'orange',
  calc: 'blue',
};

export function iconSets(theme: ThemeKey): IconSet[] {
  const names = GLYPH_USES.map((g) => g.name);
  switch (theme) {
    case 'y2k':
      return [
        {
          title: 'Jelly pink',
          blurb: 'Glossy hot-pink jelly, white glyphs.',
          icons: names.map((name) => ({ name, hot: true })),
        },
        { title: 'Chrome', blurb: 'Polished chrome, hot-pink glyphs.', icons: names.map((name) => ({ name })) },
      ];
    case 'aero':
      return [
        {
          title: 'Glossy aqua',
          blurb: 'Tinted glass tiles, white glyphs.',
          icons: names.map((name) => ({ name, tint: AERO_TINT[name] })),
        },
      ];
    case 'night':
      return [{ title: 'Neon', blurb: 'Dark tinted tiles, neon glyphs.', icons: names.map((name) => ({ name })) }];
  }
}

export const glyphUse = (name: GlyphName) => GLYPH_USES.find((g) => g.name === name)?.use ?? name;
