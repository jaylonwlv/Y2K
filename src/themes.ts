import type { ImageSourcePropType } from 'react-native';

export type Theme = {
  id: string;
  name: string;
  tagline: string;
  /** Full-resolution wallpaper (1320x2868). Missing = not released yet. */
  wallpaper?: ImageSourcePropType;
  /** CSS gradient used for cards while a theme has no art yet. */
  swatch: string;
  palette: { accent: string; ink: string; inkSoft: string; glass: string };
};

export const themes: Theme[] = [
  {
    id: 'y2k-pink-chrome',
    name: 'Y2K Pink Chrome',
    tagline: 'holo foil · chrome spheres · jelly pink',
    wallpaper: require('@/assets/wallpapers/y2k-pink-chrome.png'),
    swatch: 'linear-gradient(160deg, #b8f1e6 0%, #e3e6f4 30%, #efc6ec 70%, #e3b8f3 100%)',
    palette: { accent: '#E3268F', ink: '#6E1B5E', inkSoft: '#9E4F8C', glass: 'rgba(253,232,248,0.6)' },
  },
  {
    id: 'frutiger-aero',
    name: 'Frutiger Aero',
    tagline: 'sky · grass · bubbles · glossy aqua',
    swatch: 'linear-gradient(180deg, #7fd3ff 0%, #c9efff 55%, #8fe07a 56%, #3fae4f 100%)',
    palette: { accent: '#0A84C6', ink: '#0B3B5C', inkSoft: '#3B6E8F', glass: 'rgba(230,248,255,0.6)' },
  },
  {
    id: 'aero-night',
    name: 'Aero Night',
    tagline: 'dark aurora · neon on tinted glass',
    swatch: 'linear-gradient(160deg, #0b1030 0%, #1b2a6b 40%, #1fbf9a 70%, #6b2fbf 100%)',
    palette: { accent: '#39F3D1', ink: '#E8F7FF', inkSoft: '#9FB6D6', glass: 'rgba(20,24,56,0.55)' },
  },
];

export const getTheme = (id: string) => themes.find((t) => t.id === id);
