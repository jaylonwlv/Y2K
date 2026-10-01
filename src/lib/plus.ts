import { router } from 'expo-router';
import { useSyncExternalStore } from 'react';

import type { ThemeKey } from '@/components/widgets/tokens';

import { getPlusFlag, setPlusFlag } from './widget-bridge';

/**
 * Y2K Home Plus: one switch for everything paid. Until purchases are wired up the switch is only
 * flipped by the developer toggle in Settings; the paywall will flip it after a purchase or restore.
 */

/** What's in Plus. Everything else (the Y2K theme, its icons, Calendar, Clock, Mixtape) is free. */
export type PlusFeature =
  | 'theme' // Aero and Aero Night: use the theme, its widget style, its icons
  | 'widget' // Vibe, Weather and World Clocks widgets
  | 'installIcons' // Install all at once
  | 'export'; // Exports without the watermark

export const FREE_THEME: ThemeKey = 'y2k';
export const isThemeFree = (theme: ThemeKey) => theme === FREE_THEME;

let plus = getPlusFlag();
const listeners = new Set<() => void>();

export function isPlus() {
  return plus;
}

export function setPlus(on: boolean) {
  plus = on;
  setPlusFlag(on);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Re-renders when Plus is unlocked or lapses. */
export function usePlus() {
  return useSyncExternalStore(subscribe, isPlus, isPlus);
}

/** True when the feature can be used now; otherwise opens the paywall and returns false. */
export function requirePlus(feature: PlusFeature, theme?: ThemeKey) {
  if (plus || (feature === 'theme' && theme && isThemeFree(theme))) return true;
  router.push({ pathname: '/paywall', params: { feature } });
  return false;
}

/**
 * Restores a previous purchase for this Apple ID. Purchases aren't wired up yet, so for now this
 * only reports whether Plus is already on.
 */
export async function restorePurchases() {
  return plus;
}
