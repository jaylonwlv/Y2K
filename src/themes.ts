import type { ImageSourcePropType, TextStyle } from 'react-native';

import type { ThemeKey } from '@/components/widgets/tokens';

export type Theme = {
  id: string;
  /** Short key shared with the widgets (App Group setting "theme"). */
  key: ThemeKey;
  name: string;
  tagline: string;
  /** Full-resolution wallpaper (1320 × 2868). */
  wallpaper: ImageSourcePropType;
  /** Background colour behind the wallpaper while it loads. */
  base: string;
  /** Hook lines for the TikTok export; the first is from the mockup. */
  hooks: string[];
  /** How the hook line is drawn on the export. */
  hookStyle: TextStyle;
  /** Text colour for the in-app card label. */
  ink: string;
};

export const themes: Theme[] = [
  {
    id: 'y2k-pink-chrome',
    key: 'y2k',
    name: 'Y2K Pink Chrome',
    tagline: 'holo foil · chrome spheres · jelly pink',
    wallpaper: require('@/assets/wallpapers/y2k-pink-chrome.png'),
    base: '#F4C6EC',
    hooks: [
      'made my phone\nY2K again 🦋',
      'POV: your iPhone\nbut it’s 2003 ✧',
      'pink chrome\nhome screen 💿',
      'it’s giving\nflip phone era ♡',
    ],
    hookStyle: { color: '#ffffff', textShadowColor: '#e0339a' },
    ink: '#6E1B5E',
  },
  {
    id: 'frutiger-aero',
    key: 'aero',
    name: 'Frutiger Aero',
    tagline: 'sky · grass · bubbles · glossy aqua',
    wallpaper: require('@/assets/wallpapers/frutiger-aero.png'),
    base: '#2E9BE8',
    hooks: [
      'my iPhone,\nbut Frutiger Aero 🫧',
      'POV: it’s 2008 and\nthe future is glossy',
      'bubbles, grass &\nglossy aqua 💧',
      'this home screen\nsmells like fresh air',
    ],
    hookStyle: { color: '#ffffff', textShadowColor: 'rgba(0, 50, 110, 0.55)' },
    ink: '#063A66',
  },
  {
    id: 'aero-night',
    key: 'night',
    name: 'Aero Night',
    tagline: 'dark aurora · neon on tinted glass',
    wallpaper: require('@/assets/wallpapers/aero-night.png'),
    base: '#03101F',
    hooks: [
      'Aero, but\nafter midnight',
      'my iPhone at 2am\nhits different 🌌',
      'aurora home screen\nfor night owls',
      'dark mode,\nbut make it neon',
    ],
    hookStyle: { color: '#eafffb', textShadowColor: 'rgba(90, 255, 220, 0.7)' },
    ink: '#E8F7FF',
  },
];

export const getTheme = (id: string) => themes.find((t) => t.id === id);
export const getThemeByKey = (key: ThemeKey) => themes.find((t) => t.key === key) ?? themes[0];
