import type { GlyphName } from '@/components/home/glyphs';

/**
 * Apps a home-screen icon can open through a URL scheme, with the glyph each starts with.
 * Names are plain text only; no app's own artwork is used. Apps without a public scheme
 * (Camera, Settings, Calculator) and Calendar (its icon shows today's date) aren't here and
 * stay on the Shortcuts route.
 */
export type LinkedApp = {
  id: string;
  name: string;
  url: string;
  glyph: GlyphName;
  /** Ticked by default: built-in apps everyone has. */
  preselect?: boolean;
};

export const APPLE_APPS: LinkedApp[] = [
  { id: 'phone', name: 'Phone', url: 'mobilephone://', glyph: 'phone', preselect: true },
  { id: 'messages', name: 'Messages', url: 'sms://', glyph: 'messages', preselect: true },
  { id: 'mail', name: 'Mail', url: 'message://', glyph: 'mail', preselect: true },
  { id: 'safari', name: 'Safari', url: 'x-web-search://', glyph: 'browser', preselect: true },
  { id: 'music', name: 'Music', url: 'music://', glyph: 'music', preselect: true },
  { id: 'photos', name: 'Photos', url: 'photos-redirect://', glyph: 'photos', preselect: true },
  { id: 'maps', name: 'Maps', url: 'maps://', glyph: 'maps', preselect: true },
  { id: 'notes', name: 'Notes', url: 'mobilenotes://', glyph: 'notes', preselect: true },
  { id: 'clock', name: 'Clock', url: 'clock-alarm://', glyph: 'clock', preselect: true },
  { id: 'weather', name: 'Weather', url: 'weather://', glyph: 'weather', preselect: true },
  { id: 'wallet', name: 'Wallet', url: 'shoebox://', glyph: 'wallet' },
  { id: 'facetime', name: 'FaceTime', url: 'facetime://', glyph: 'camera' },
  { id: 'appstore', name: 'App Store', url: 'itms-apps://', glyph: 'shop' },
  { id: 'health', name: 'Health', url: 'x-apple-health://', glyph: 'heart' },
  { id: 'reminders', name: 'Reminders', url: 'x-apple-reminderkit://', glyph: 'notes' },
  { id: 'files', name: 'Files', url: 'shareddocuments://', glyph: 'saved' },
  { id: 'podcasts', name: 'Podcasts', url: 'podcasts://', glyph: 'star' },
];

export const POPULAR_APPS: LinkedApp[] = [
  { id: 'instagram', name: 'Instagram', url: 'instagram://', glyph: 'camera' },
  { id: 'tiktok', name: 'TikTok', url: 'snssdk1233://', glyph: 'music' },
  { id: 'snapchat', name: 'Snapchat', url: 'snapchat://', glyph: 'camera' },
  { id: 'pinterest', name: 'Pinterest', url: 'pinterest://', glyph: 'saved' },
  { id: 'youtube', name: 'YouTube', url: 'youtube://', glyph: 'star' },
  { id: 'spotify', name: 'Spotify', url: 'spotify://', glyph: 'music' },
  { id: 'soundcloud', name: 'SoundCloud', url: 'soundcloud://', glyph: 'music' },
  { id: 'whatsapp', name: 'WhatsApp', url: 'whatsapp://', glyph: 'messages' },
  { id: 'messenger', name: 'Messenger', url: 'fb-messenger://', glyph: 'messages' },
  { id: 'telegram', name: 'Telegram', url: 'tg://', glyph: 'messages' },
  { id: 'discord', name: 'Discord', url: 'discord://', glyph: 'games' },
  { id: 'x', name: 'X', url: 'twitter://', glyph: 'messages' },
  { id: 'threads', name: 'Threads', url: 'barcelona://', glyph: 'messages' },
  { id: 'facebook', name: 'Facebook', url: 'fb://', glyph: 'heart' },
  { id: 'tumblr', name: 'Tumblr', url: 'tumblr://', glyph: 'heart' },
  { id: 'reddit', name: 'Reddit', url: 'reddit://', glyph: 'browser' },
  { id: 'twitch', name: 'Twitch', url: 'twitch://', glyph: 'games' },
  { id: 'netflix', name: 'Netflix', url: 'nflx://', glyph: 'star' },
  { id: 'gmail', name: 'Gmail', url: 'googlegmail://', glyph: 'mail' },
  { id: 'googlemaps', name: 'Google Maps', url: 'comgooglemaps://', glyph: 'maps' },
  { id: 'uber', name: 'Uber', url: 'uber://', glyph: 'maps' },
  { id: 'amazon', name: 'Amazon', url: 'com.amazon.mobile.shopping://', glyph: 'shop' },
  { id: 'venmo', name: 'Venmo', url: 'venmo://', glyph: 'wallet' },
];
