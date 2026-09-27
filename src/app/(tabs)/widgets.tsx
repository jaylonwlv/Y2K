import * as Calendar from 'expo-calendar';
import { useEffect, useState } from 'react';
import { AppState, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { CalendarWidgetPreview } from '@/components/calendar-widget-preview';
import { getCalendarShowsEvents, reloadWidgets, setCalendarShowsEvents, WidgetKind } from '@/lib/widget-bridge';

const STEPS = [
  'Go to your home screen and press and hold an empty spot until the icons jiggle.',
  'Tap Edit (top left), then Add Widget, and search for “Y2K Home”.',
  'Pick Chrome Calendar and drop it where you want it.',
  'Press and hold the widget › Edit Widget › Position, and choose the spot it sits in. That lines its glass up with the wallpaper.',
];

export default function WidgetsScreen() {
  const [permission, requestPermission] = Calendar.useCalendarPermissions();
  const [showEvents, setShowEvents] = useState(getCalendarShowsEvents);

  // Re-check after coming back from Settings, and refresh the widget so it picks up access.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') reloadWidgets(WidgetKind.calendar);
    });
    return () => sub.remove();
  }, []);

  async function connect() {
    const result = permission?.canAskAgain === false ? null : await requestPermission();
    if (!result) {
      Linking.openSettings();
      return;
    }
    reloadWidgets(WidgetKind.calendar);
  }

  const granted = permission?.granted ?? false;

  return (
    <ScrollView style={styles.screen} contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
      <Text style={styles.title}>Widgets</Text>

      <View style={styles.previewStage}>
        <CalendarWidgetPreview size={170} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Chrome Calendar</Text>
        <Text style={styles.body}>Today in big chrome numbers, plus your next two plans from the Calendar app.</Text>

        {granted ? (
          <Text style={styles.ok}>✓ Calendar connected</Text>
        ) : (
          <Pressable style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]} onPress={connect}>
            <Text style={styles.buttonText}>
              {permission?.canAskAgain === false ? 'Allow in Settings' : 'Connect calendar'}
            </Text>
          </Pressable>
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
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Add it to your home screen</Text>
        {STEPS.map((step, i) => (
          <View key={i} style={styles.step}>
            <Text style={styles.stepNumber}>{i + 1}</Text>
            <Text style={[styles.body, { flex: 1 }]}>{step}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.footnote}>
        Clock, Vibe Card and Mixtape widgets are coming next. Widgets can’t read what’s playing in other music apps, so
        the Mixtape card shows a song you pick.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBEFF8' },
  content: { padding: 20, paddingBottom: 120, gap: 16 },
  title: { fontSize: 34, fontWeight: '800', color: '#3B0E33', marginTop: 8 },
  previewStage: {
    height: 240,
    borderRadius: 32,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
    experimental_backgroundImage: 'linear-gradient(160deg, #b8f1e6 0%, #e3e6f4 30%, #efc6ec 70%, #e3b8f3 100%)',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderCurve: 'continuous',
    padding: 18,
    gap: 10,
    boxShadow: '0 6px 20px rgba(150, 60, 140, 0.10)',
  },
  cardTitle: { fontSize: 19, fontWeight: '800', color: '#3B0E33' },
  body: { fontSize: 15, lineHeight: 21, color: '#5E3656' },
  ok: { fontSize: 15, fontWeight: '700', color: '#1E9E5A' },
  button: {
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 999,
    experimental_backgroundImage: 'linear-gradient(180deg, #FF8ACB 0%, #E3268F 100%)',
  },
  buttonText: { color: 'white', fontWeight: '800', fontSize: 15 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  step: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    overflow: 'hidden',
    backgroundColor: '#FCE1F3',
    color: '#E3268F',
    fontWeight: '800',
  },
  footnote: { fontSize: 13, lineHeight: 18, color: '#9E6A93', paddingHorizontal: 4 },
});
