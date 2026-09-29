/** Widget design tokens from home2.html. Mirrors targets/widget/Theme.swift. */

/** Short theme keys, shared with the widget extension through the App Group. */
export type ThemeKey = 'y2k' | 'aero' | 'night';

export const Y2K = {
  hotPink: '#E0339A',
  ink: '#7D1A63',
  chromeEdge: '#D23A95',
  chromeStops: [
    ['0', '#FFFFFF'],
    ['0.30', '#F5E8FF'],
    ['0.48', '#A79CCC'],
    ['0.53', '#FFFFFF'],
    ['0.76', '#D9C9F2'],
    ['1', '#9088B6'],
  ] as const,
};

export type WidgetStyle = {
  /** Small caps labels, hearts, play buttons. */
  accent: string;
  /** Body text. */
  ink: string;
  /** How big numbers are drawn: Y2K chrome, Aero thin deep-blue, Night thin white with a neon glow. */
  numeral: 'chrome' | 'aqua' | 'neon';
  /** `.glassw` in each theme. */
  glass: { gradient: string; edge: string; shadow: string; gloss: boolean };
  /** Caption pill on the Vibe card. */
  pill: { gradient: string; edge: string };
};

export const WIDGET_STYLES: Record<ThemeKey, WidgetStyle> = {
  y2k: {
    accent: Y2K.hotPink,
    ink: Y2K.ink,
    numeral: 'chrome',
    glass: {
      gradient: 'linear-gradient(170deg, rgba(255,255,255,0.62) 0%, rgba(255,225,245,0.38) 100%)',
      edge: 'rgba(255,255,255,0.85)',
      shadow: '0 10px 28px rgba(160, 50, 140, 0.18)',
      gloss: false,
    },
    pill: {
      gradient: 'linear-gradient(180deg, rgba(255,255,255,0.78) 0%, rgba(255,225,245,0.6) 100%)',
      edge: 'rgba(255,255,255,0.9)',
    },
  },
  aero: {
    accent: '#0B6FC2',
    ink: '#063A66',
    numeral: 'aqua',
    glass: {
      gradient:
        'linear-gradient(170deg, rgba(255,255,255,0.72) 0%, rgba(225,245,255,0.5) 45%, rgba(150,215,248,0.45) 100%)',
      edge: 'rgba(255,255,255,0.7)',
      shadow: '0 10px 28px rgba(0, 50, 110, 0.22)',
      gloss: true,
    },
    pill: {
      gradient: 'linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(210,240,255,0.65) 100%)',
      edge: 'rgba(255,255,255,0.85)',
    },
  },
  night: {
    accent: '#5FFFE0',
    ink: '#FFFFFF',
    numeral: 'neon',
    glass: {
      gradient: 'linear-gradient(180deg, #25282E 0%, #15171B 100%)',
      edge: 'rgba(255,255,255,0.1)',
      shadow: '0 10px 28px rgba(0, 0, 0, 0.4)',
      gloss: false,
    },
    pill: {
      gradient: 'linear-gradient(180deg, rgba(37,40,46,0.9) 0%, rgba(21,23,27,0.9) 100%)',
      edge: 'rgba(255,255,255,0.14)',
    },
  },
};

export const Geist = {
  light: 'Geist-Light',
  regular: 'Geist-Regular',
  medium: 'Geist-Medium',
  semibold: 'Geist-SemiBold',
  bold: 'Geist-Bold',
  black: 'Geist-Black',
};

/** Mockup widgets are 184.4 pt; everything inside scales from that. */
export const MOCKUP_WIDGET = 184.4;
