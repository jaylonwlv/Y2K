import * as Haptics from 'expo-haptics';
import { Image, type ImageSource } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemeIcon } from '@/components/home/theme-icon';
import { PinkButton } from '@/components/pink-button';
import { Geist } from '@/components/widgets/tokens';

type Step = {
  title: string;
  body: string;
  /** Screenshot from a real iOS 26 run-through, with the thing to tap ringed in pink. */
  image?: { source: ImageSource; ratio: number };
  openShortcuts?: boolean;
};

const shot = (source: ImageSource, width: number, height: number) => ({ source, ratio: width / height });

const STEPS: Step[] = [
  {
    title: 'Save your icons',
    body: 'On the Icons screen, tap Save all (or tap single icons). They land in your Photos, ready to use.',
  },
  {
    title: 'Open Shortcuts and tap +',
    body: 'The + is in the top-right corner of the Shortcuts app.',
    image: shot(require('@/assets/guide/plus.jpg'), 900, 435),
    openShortcuts: true,
  },
  {
    title: 'Tap “Open App”',
    body: 'It’s in the suggestions at the bottom. Don’t see it? Type “Open App” into Search Actions.',
    image: shot(require('@/assets/guide/open-app.jpg'), 900, 660),
  },
  {
    title: 'Tap the blue “App”',
    body: 'Then pick the app you’re restyling from the list, for example Messages.',
    image: shot(require('@/assets/guide/app.jpg'), 900, 308),
  },
  {
    title: 'Rename it',
    body: 'Tap the name at the very top › Rename, and type the app’s name. That becomes the label under the icon.',
    image: shot(require('@/assets/guide/rename.jpg'), 900, 576),
  },
  {
    title: 'Add to Home Screen',
    body: 'Tap the name at the top again › Add to Home Screen.',
    image: shot(require('@/assets/guide/add-home.jpg'), 900, 590),
  },
  {
    title: 'Tap Image › Choose Photo',
    body: 'Switch from Symbol to Image, then tap Choose Photo.',
    image: shot(require('@/assets/guide/image.jpg'), 900, 1013),
  },
  {
    title: 'Pick your icon',
    body: 'Tap the icon you saved for this app, then tap Choose.',
    image: shot(require('@/assets/guide/pick.jpg'), 900, 1068),
  },
  {
    title: 'Tap Add',
    body: 'Top right. Your new icon goes straight onto your home screen.',
    image: shot(require('@/assets/guide/add.jpg'), 900, 590),
  },
  {
    title: 'That’s it ✧',
    body: 'Last thing: hide the old icon. Press and hold it › Remove App › Remove from Home Screen. It stays in your App Library.',
    image: shot(require('@/assets/guide/done.jpg'), 900, 1950),
  },
];

/** Walkthrough for adding a custom icon with the Shortcuts app, one screen per step. */
export default function IconGuide() {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const step = STEPS[index];
  const last = index === STEPS.length - 1;

  function go(to: number) {
    Haptics.selectionAsync();
    setIndex(Math.max(0, Math.min(STEPS.length - 1, to)));
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 12 }]}>
      <View style={styles.header}>
        <Text style={styles.heading}>Set up an icon</Text>
        <Pressable hitSlop={12} onPress={() => router.back()}>
          <Text style={styles.close}>Close</Text>
        </Pressable>
      </View>

      <View style={styles.progress}>
        {STEPS.map((_, i) => (
          <View key={i} style={[styles.segment, i <= index && styles.segmentOn]} />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Animated.View key={index} entering={FadeIn.duration(220)} style={{ gap: 14 }}>
          <Text style={styles.count}>
            Step {index + 1} of {STEPS.length}
          </Text>
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.text}>{step.body}</Text>

          {step.image ? (
            <View style={styles.shotFrame}>
              <Image
                source={step.image.source}
                style={{ width: '100%', aspectRatio: step.image.ratio, maxHeight: 520 }}
                contentFit="contain"
              />
            </View>
          ) : (
            <View style={styles.iconRow}>
              {(['messages', 'music', 'camera', 'heart'] as const).map((name) => (
                <ThemeIcon key={name} name={name} hot size={64} />
              ))}
            </View>
          )}

          {step.openShortcuts && (
            <PinkButton label="Open Shortcuts" variant="secondary" onPress={() => Linking.openURL('shortcuts://')} />
          )}
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        {last ? (
          <>
            <PinkButton label="Do another app" variant="secondary" onPress={() => go(1)} />
            <PinkButton label="Finish" onPress={() => router.back()} />
          </>
        ) : (
          <>
            <PinkButton label="Back" variant="secondary" onPress={() => go(index - 1)} disabled={index === 0} />
            <PinkButton label="Next" onPress={() => go(index + 1)} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBEFF8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  heading: { fontFamily: Geist.black, fontSize: 22, color: '#3B0E33' },
  close: { fontFamily: Geist.bold, fontSize: 17, color: '#E3268F' },
  progress: { flexDirection: 'row', gap: 4, paddingHorizontal: 20, marginTop: 14 },
  segment: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#F3D3EA' },
  segmentOn: { backgroundColor: '#E3268F' },
  body: { padding: 20, paddingBottom: 32 },
  count: { fontFamily: Geist.bold, fontSize: 13, color: '#C21F7E', letterSpacing: 0.4 },
  title: { fontFamily: Geist.black, fontSize: 28, color: '#3B0E33' },
  text: { fontFamily: Geist.medium, fontSize: 17, lineHeight: 24, color: '#5E3656' },
  shotFrame: {
    borderRadius: 24,
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: '#101010',
    alignItems: 'center',
    boxShadow: '0 10px 28px rgba(90, 30, 80, 0.2)',
  },
  iconRow: { flexDirection: 'row', justifyContent: 'center', gap: 14, paddingVertical: 24 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10 },
});
