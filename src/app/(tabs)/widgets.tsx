import * as Calendar from 'expo-calendar';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  AppState,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';

import { PinkButton } from '@/components/pink-button';
import { WallpaperStage } from '@/components/wallpaper-stage';
import { CalendarPreview } from '@/components/widgets/calendar-preview';
import { ClockPreview } from '@/components/widgets/clock-preview';
import { MixtapePreview } from '@/components/widgets/mixtape-preview';
import { Geist, type ThemeKey } from '@/components/widgets/tokens';
import { VibePreview } from '@/components/widgets/vibe-preview';
import { WorldClocksPreview } from '@/components/widgets/world-clocks-preview';
import {
  getCalendarShowsEvents,
  getMixtape,
  getVibe,
  getWidgetTheme,
  reloadWidgets,
  setCalendarShowsEvents,
  setWidgetTheme,
  sharedImageUri,
  WidgetKind,
} from '@/lib/widget-bridge';
import { getThemeByKey, themes } from '@/themes';

const STEPS = [
  'On your home screen, press and hold an empty spot until the icons jiggle.',
  'Tap Edit (top left), then Add Widget, and search for “Y2K Home”.',
  'Pick a widget and drop it where you want it.',
  'Press and hold the widget, then Edit Widget. Set Side and “Starts on icon row” to where it sits, so its glass lines up with the wallpaper.',
];

const PREVIEW = 150;

const SHORT_NAMES: Record<ThemeKey, string> = { y2k: 'Y2K', aero: 'Aero', night: 'Night' };

export default function WidgetsScreen() {
  const [permission, requestPermission] = Calendar.useCalendarPermissions();
  const [showEvents, setShowEvents] = useState(getCalendarShowsEvents);
  const [mixtape, setMixtape] = useState(getMixtape);
  const [vibe, setVibe] = useState(getVibe);
  const [theme, setTheme] = useState(getWidgetTheme);
  const wallpaper = getThemeByKey(theme).wallpaper;

  // Editors save straight to the App Group; re-read when coming back to this tab.
  useFocusEffect(
    useCallback(() => {
      setMixtape(getMixtape());
      setVibe(getVibe());
      setTheme(getWidgetTheme());
    }, [])
  );

  // Re-check after coming back from Settings, and refresh the calendar so it picks up access.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') reloadWidgets(WidgetKind.calendar);
    });
    return () => sub.remove();
  }, []);

  async function connect() {
    if (permission?.canAskAgain === false) {
      Linking.openSettings();
      return;
    }
    await requestPermission();
    reloadWidgets(WidgetKind.calendar);
  }

  const granted = permission?.granted ?? false;

  return (
    <ScrollView style={styles.screen} contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
      <Text style={styles.title}>Widgets</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Style</Text>
        <Text style={styles.body}>Every widget switches to this look: glass, colours and numbers.</Text>
        <View style={styles.segments}>
          {themes.map((t) => (
            <Pressable
              key={t.key}
              onPress={() => {
                setTheme(t.key);
                setWidgetTheme(t.key);
              }}
              style={[styles.segment, theme === t.key && styles.segmentOn]}>
              <Text style={[styles.segmentText, theme === t.key && styles.segmentTextOn]}>{SHORT_NAMES[t.key]}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <WidgetCard
        wallpaper={wallpaper}
        name="Calendar"
        blurb="Today in big chrome numbers, plus your next two plans from the Calendar app."
        preview={<CalendarPreview size={PREVIEW} theme={theme} />}>
        {granted ? (
          <Text style={styles.ok}>✓ Calendar connected</Text>
        ) : (
          <PinkButton
            label={permission?.canAskAgain === false ? 'Allow in Settings' : 'Connect calendar'}
            onPress={connect}
          />
        )}
        <View style={styles.toggleRow}>
          <Text style={styles.body}>Show events</Text>
          <Switch
            value={showEvents}
            trackColor={{ true: '#E3268F' }}
            onValueChange={(value) => {
              setShowEvents(value);
              setCalendarShowsEvents(value);
            }}
          />
        </View>
      </WidgetCard>

      <WidgetCard
        wallpaper={wallpaper}
        name="Mixtape"
        blurb="A song you love with your own cover. Tap the widget to play it in Spotify, Apple Music or YouTube."
        preview={
          <MixtapePreview
            theme={theme}
            size={PREVIEW}
            title={mixtape.title}
            subtitle={mixtape.subtitle}
            coverUri={mixtape.cover ? sharedImageUri('mixtape-cover.jpg', mixtape.v) : undefined}
          />
        }>
        <PinkButton label="Customize" onPress={() => router.push('/edit/mixtape')} />
      </WidgetCard>

      <WidgetCard
        wallpaper={wallpaper}
        name="Vibe Card"
        blurb="Your own photo with a caption. Comes in small and medium."
        preview={
          <VibePreview
            theme={theme}
            width={PREVIEW}
            height={PREVIEW}
            caption={vibe.caption}
            subcaption={vibe.subcaption}
            photoUri={vibe.photo ? sharedImageUri('vibe-photo.jpg', vibe.v) : undefined}
          />
        }>
        <PinkButton label="Customize" onPress={() => router.push('/edit/vibe')} />
      </WidgetCard>

      <WidgetCard
        wallpaper={wallpaper}
        name="Clock"
        blurb="Chrome digital time in Y2K, an analog dial in Aero and Aero Night. Nothing to set up."
        preview={<ClockPreview size={PREVIEW} theme={theme} />}
      />

      <WidgetCard
        wallpaper={wallpaper}
        name="World Clocks"
        blurb="Home, New York, London and Tokyo. Dials light up where it's daytime. Medium size; change the cities with Edit Widget."
        preview={<WorldClocksPreview width={310} height={146} theme={theme} />}
      />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Add them to your home screen</Text>
        {STEPS.map((step, i) => (
          <View key={i} style={styles.step}>
            <Text style={styles.stepNumber}>{i + 1}</Text>
            <Text style={[styles.body, { flex: 1 }]}>{step}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function WidgetCard({
  wallpaper,
  name,
  blurb,
  preview,
  children,
}: {
  wallpaper: ImageSourcePropType;
  name: string;
  blurb: string;
  preview: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <WallpaperStage height={210} wallpaper={wallpaper}>
        {preview}
      </WallpaperStage>
      <Text style={styles.cardTitle}>{name}</Text>
      <Text style={styles.body}>{blurb}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBEFF8' },
  content: { padding: 20, paddingBottom: 120, gap: 16 },
  title: { fontSize: 34, fontFamily: Geist.black, color: '#3B0E33', marginTop: 8 },
  card: {
    backgroundColor: 'white',
    borderRadius: 28,
    borderCurve: 'continuous',
    padding: 14,
    gap: 10,
    boxShadow: '0 6px 20px rgba(150, 60, 140, 0.10)',
  },
  cardTitle: { fontSize: 19, fontFamily: Geist.bold, color: '#3B0E33', marginTop: 4, marginHorizontal: 4 },
  body: { fontSize: 15, lineHeight: 21, fontFamily: Geist.medium, color: '#5E3656', marginHorizontal: 4 },
  ok: { fontSize: 15, fontFamily: Geist.bold, color: '#1E9E5A', marginHorizontal: 4 },
  segments: { flexDirection: 'row', gap: 8 },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FCE1F3',
  },
  segmentOn: { backgroundColor: '#E3268F' },
  segmentText: { fontFamily: Geist.bold, fontSize: 15, color: '#C21F7E' },
  segmentTextOn: { color: 'white' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  step: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    overflow: 'hidden',
    backgroundColor: '#FCE1F3',
    color: '#E3268F',
    fontFamily: Geist.bold,
    marginLeft: 4,
  },
});
