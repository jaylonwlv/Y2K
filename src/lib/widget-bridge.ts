import { ExtensionStorage } from '@bacons/apple-targets';
import { File, Paths } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { Platform } from 'react-native';

import type { ThemeKey } from '@/components/widgets/tokens';

import appConfig from '../../app.json';

/** Must match the App Group in app.json; the widget derives the same id from its bundle id. */
export const APP_GROUP = appConfig.expo.ios.entitlements['com.apple.security.application-groups'][0];

/** Widget `kind` strings from targets/widget/*.swift. */
export const WidgetKind = {
  calendar: 'Y2KCalendar',
  mixtape: 'Y2KMixtape',
  vibe: 'Y2KVibe',
  clock: 'Y2KClock',
  worldClocks: 'Y2KWorldClocks',
} as const;

const storage = Platform.OS === 'ios' ? new ExtensionStorage(APP_GROUP) : null;

export function reloadWidgets(kind?: string) {
  if (Platform.OS === 'ios') ExtensionStorage.reloadWidget(kind);
}

function readObject<T>(key: string): Partial<T> {
  const raw = storage?.get(key);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Partial<T>;
  } catch {
    return {};
  }
}

// MARK: Theme

/** The theme every widget draws in (glass, colours, numbers). */
export function getWidgetTheme(): ThemeKey {
  const value = storage?.get('theme');
  return value === 'aero' || value === 'night' ? value : 'y2k';
}

export function setWidgetTheme(theme: ThemeKey) {
  storage?.set('theme', theme);
  reloadWidgets();
}

// MARK: Calendar

export function setCalendarShowsEvents(show: boolean) {
  storage?.set('calendar.showEvents', show ? 1 : 0);
  reloadWidgets(WidgetKind.calendar);
}

export function getCalendarShowsEvents() {
  return storage?.get('calendar.showEvents') !== '0';
}

// MARK: Shared images

export type PickedImage = { uri: string; width: number; height: number };

function sharedFile(name: string) {
  const dir = Paths.appleSharedContainers[APP_GROUP];
  return dir ? new File(dir, name) : null;
}

/** URI of an image the widget reads, with a version suffix so the app's image cache refreshes. */
export function sharedImageUri(name: string, version?: number) {
  const file = sharedFile(name);
  return file?.exists ? `${file.uri}?v=${version ?? 0}` : undefined;
}

/** Downscales a picked photo and writes it into the App Group for the widget. */
async function writeSharedImage(image: PickedImage, name: string, maxSide: number) {
  const target = sharedFile(name);
  if (!target) throw new Error('The widget storage is not available.');
  const context = ImageManipulator.manipulate(image.uri);
  if (Math.max(image.width, image.height) > maxSide) {
    context.resize(image.width >= image.height ? { width: maxSide } : { height: maxSide });
  }
  const rendered = await context.renderAsync();
  const saved = await rendered.saveAsync({ format: SaveFormat.JPEG, compress: 0.85 });
  if (target.exists) target.delete();
  new File(saved.uri).move(target);
}

// MARK: Mixtape

export type MixtapeSettings = { title: string; subtitle: string; link: string; cover: number; v: number };

export const defaultMixtape: MixtapeSettings = {
  title: 'Baby Tee Summer',
  subtitle: 'y2k mixtape',
  link: '',
  cover: 0,
  v: 0,
};

export function getMixtape(): MixtapeSettings {
  return { ...defaultMixtape, ...readObject<MixtapeSettings>('mixtape') };
}

export async function saveMixtape(settings: Omit<MixtapeSettings, 'cover' | 'v'>, newCover?: PickedImage) {
  const current = getMixtape();
  if (newCover) await writeSharedImage(newCover, 'mixtape-cover.jpg', 600);
  const next: MixtapeSettings = {
    ...settings,
    cover: newCover ? 1 : current.cover,
    v: newCover ? Date.now() : current.v,
  };
  storage?.set('mixtape', next);
  reloadWidgets(WidgetKind.mixtape);
  return next;
}

// MARK: Vibe card

export type VibeSettings = { caption: string; subcaption: string; photo: number; v: number };

export const defaultVibe: VibeSettings = { caption: 'main character era', subcaption: '', photo: 0, v: 0 };

export function getVibe(): VibeSettings {
  return { ...defaultVibe, ...readObject<VibeSettings>('vibe') };
}

export async function saveVibe(settings: Pick<VibeSettings, 'caption' | 'subcaption'>, newPhoto?: PickedImage) {
  const current = getVibe();
  if (newPhoto) await writeSharedImage(newPhoto, 'vibe-photo.jpg', 1200);
  const next: VibeSettings = {
    ...settings,
    photo: newPhoto ? 1 : current.photo,
    v: newPhoto ? Date.now() : current.v,
  };
  storage?.set('vibe', next);
  reloadWidgets(WidgetKind.vibe);
  return next;
}

/** Links the Mixtape card may open: web links and music apps' own schemes. */
export function isPlayableLink(link: string) {
  return /^(https?:\/\/|spotify:|music:|youtube:)/i.test(link.trim());
}
