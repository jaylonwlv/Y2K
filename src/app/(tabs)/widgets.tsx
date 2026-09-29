import * as Calendar from 'expo-calendar';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { PinkButton } from '@/components/pink-button';
import { WallpaperStage } from '@/components/wallpaper-stage';
import { CalendarPreview } from '@/components/widgets/calendar-preview';
import { ClockPreview } from '@/components/widgets/clock-preview';
import { MixtapePreview } from '@/components/widgets/mixtape-preview';
import { Geist } from '@/components/widgets/tokens';
import { VibePreview } from '@/components/widgets/vibe-preview';
import {
  getCalendarShowsEvents,
  getMixtape,
  getVibe,
  reloadWidgets,
  setCalendarShowsEvents,
  sharedImageUri,
  WidgetKind,
} from '@/lib/widget-bridge';

const STEPS = [
  'On your home screen, press and hold an empty spot until the icons jiggle.',
  'Tap Edit (top left), then Add Widget, and search for “Y2K Home”.',
  'Pick a widget and drop it where you want it.',
  'Press and hold the widget, then Edit Widget. Set Side and “Starts on icon row” to where it sits, so its glass lines up with the wallpaper.',
];

const PREVIEW = 150;

export default function WidgetsScreen() {
  const [permission, requestPermission] = Calendar.useCalendarPermissions();
  const [showEvents, setShowEvents] = useState(getCalendarShowsEvents);
  const [mixtape, setMixtape] = useState(getMixtape);
  const [vibe, setVibe] = useState(getVibe);

  // Editors save straight to the App Group; re-read when coming back to this tab.
  useFocusEffect(
    useCallback(() => {
      setMixtape(getMixtape());
      setVibe(getVibe());
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

      <WidgetCard
        name="Chrome Calendar"
        blurb="Today in big chrome numbers, plus your next two plans from the Calendar app."
        preview={<CalendarPreview size={PREVIEW} />}>
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
        name="Mixtape"
        blurb="A song you love with your own cover. Tap the widget to play it in Spotify, Apple Music or YouTube."
        preview={
          <MixtapePreview
            size={PREVIEW}
            title={mixtape.title}
            subtitle={mixtape.subtitle}
            coverUri={mixtape.cover ? sharedImageUri('mixtape-cover.jpg', mixtape.v) : undefined}
          />
        }>
        <PinkButton label="Customize" onPress={() => router.push('/edit/mixtape')} />
      </WidgetCard>

      <WidgetCard
        name="Vibe Card"
        blurb="Your own photo with a caption. Comes in small and medium."
        preview={
          <VibePreview
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
        name="Chrome Clock"
        blurb="The time in chrome on frosted glass. Nothing to set up."
        preview={<ClockPreview size={PREVIEW} />}
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
  name,
  blurb,
  preview,
  children,
}: {
  name: string;
  blurb: string;
  preview: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <WallpaperStage height={210}>{preview}</WallpaperStage>
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
