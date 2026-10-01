import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';

import { glyphUse, iconSets, type IconChoice } from '@/components/home/icon-sets';
import { ThemeIcon } from '@/components/home/theme-icon';
import { PinkButton } from '@/components/pink-button';
import { Geist } from '@/components/widgets/tokens';
import { requirePlus } from '@/lib/plus';
import { saveImageToPhotos } from '@/lib/save-wallpaper';
import { getTheme } from '@/themes';

/** Rendered size of the hidden stage icons are captured from; saved at 512 × 512. */
const STAGE = 256;

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

export default function IconsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = getTheme(id);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const stageRef = useRef<View>(null);
  const [staged, setStaged] = useState<IconChoice>();
  const [progress, setProgress] = useState<string>();

  if (!theme) return null;
  const sets = iconSets(theme.key);
  // Screen padding 20 × 2, card padding 16 × 2, grid padding 12 × 2 less its -4 margins, three 14 pt gaps.
  const cell = Math.floor((width - 40 - 32 - 16 - 3 * 14) / 4);

  /** Draws one icon on the hidden stage and captures it as a 512 × 512 PNG. */
  async function renderIcon(icon: IconChoice) {
    setStaged(icon);
    await nextFrame();
    await nextFrame();
    await new Promise((r) => setTimeout(r, 30));
    return captureRef(stageRef, { format: 'png', width: 512, height: 512, result: 'tmpfile' });
  }

  async function saveMany(icons: IconChoice[]) {
    if (!theme || !requirePlus('theme', theme.key)) return;
    try {
      for (const [i, icon] of icons.entries()) {
        setProgress(`Saving ${i + 1} of ${icons.length}…`);
        await saveImageToPhotos(await renderIcon(icon));
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        icons.length === 1 ? 'Saved to Photos ✧' : `${icons.length} icons saved ✧`,
        'Next, put them on your home screen with the Shortcuts app. It takes about a minute per app.',
        [
          { text: 'Later', style: 'cancel' },
          { text: 'Show me how', onPress: () => router.push('/icons/guide') },
        ]
      );
    } catch (error) {
      Alert.alert('Could not save', error instanceof Error ? error.message : String(error));
    } finally {
      setProgress(undefined);
      setStaged(undefined);
    }
  }

  async function share(icon: IconChoice) {
    if (!theme || !requirePlus('theme', theme.key)) return;
    try {
      const uri = await renderIcon(icon);
      await Sharing.shareAsync(uri, { mimeType: 'image/png', UTI: 'public.png' });
    } catch (error) {
      Alert.alert('Could not share', error instanceof Error ? error.message : String(error));
    } finally {
      setStaged(undefined);
    }
  }

  function pick(icon: IconChoice) {
    Haptics.selectionAsync();
    Alert.alert(glyphUse(icon.name), undefined, [
      { text: 'Save to Photos', onPress: () => saveMany([icon]) },
      { text: 'Share…', onPress: () => share(icon) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  return (
    <View style={styles.screen}>
      {/* Hidden stage the icons are captured from, underneath the opaque list. */}
      <View style={styles.stage} pointerEvents="none">
        <View ref={stageRef} collapsable={false} style={{ width: STAGE, height: STAGE }}>
          {staged && (
            <ThemeIcon name={staged.name} hot={staged.hot} tint={staged.tint} theme={theme.key} size={STAGE} square />
          )}
        </View>
      </View>

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.title}>{theme.name} icons</Text>
        <Pressable hitSlop={12} onPress={() => router.back()}>
          <Text style={styles.done}>Done</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Put them on your home screen</Text>
          <Text style={styles.body}>
            Install all at once: pick your apps and they’re added in one go, in about 30 seconds. Or set them up one by
            one with the Shortcuts app (about a minute per app). Neither shows notification badges.
          </Text>
          <View style={styles.buttons}>
            <PinkButton
              label="Install all at once"
              onPress={() => {
                if (requirePlus('installIcons')) {
                  router.push({ pathname: '/install-icons/[id]', params: { id: theme.id } });
                }
              }}
            />
            <PinkButton label="One by one" variant="secondary" onPress={() => router.push('/icons/guide')} />
          </View>
        </View>

        {sets.map((set) => (
          <View key={set.title} style={styles.card}>
            <View style={styles.setHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{set.title}</Text>
                <Text style={styles.body}>{set.blurb}</Text>
              </View>
              <PinkButton
                label={`Save all ${set.icons.length}`}
                onPress={() => saveMany(set.icons)}
                disabled={!!progress}
              />
            </View>
            <View style={[styles.grid, { backgroundColor: theme.base }]}>
              {set.icons.map((icon) => (
                <Pressable
                  key={icon.name}
                  onPress={() => pick(icon)}
                  disabled={!!progress}
                  style={({ pressed }) => [{ width: cell, alignItems: 'center', gap: 6 }, pressed && { opacity: 0.6 }]}>
                  <ThemeIcon name={icon.name} hot={icon.hot} tint={icon.tint} theme={theme.key} size={cell - 8} />
                  <Text numberOfLines={1} style={[styles.use, { color: theme.ink }]}>
                    {glyphUse(icon.name)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {progress && (
        <View style={[styles.toast, { bottom: insets.bottom + 20 }]}>
          <Text style={styles.toastText}>{progress}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBEFF8' },
  stage: { position: 'absolute', top: 0, left: 0 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
    backgroundColor: '#FBEFF8',
  },
  title: { fontFamily: Geist.black, fontSize: 24, color: '#3B0E33', flexShrink: 1 },
  done: { fontFamily: Geist.bold, fontSize: 17, color: '#E3268F' },
  list: { backgroundColor: '#FBEFF8' },
  content: { padding: 20, gap: 16 },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderCurve: 'continuous',
    padding: 16,
    gap: 10,
    boxShadow: '0 6px 20px rgba(150, 60, 140, 0.10)',
  },
  cardTitle: { fontSize: 19, fontFamily: Geist.bold, color: '#3B0E33' },
  body: { fontSize: 15, lineHeight: 21, fontFamily: Geist.medium, color: '#5E3656' },
  buttons: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  setHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    padding: 12,
    marginHorizontal: -4,
    borderRadius: 20,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  use: { fontFamily: Geist.semibold, fontSize: 10.5, textAlign: 'center' },
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#1a1020',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },
  toastText: { color: 'white', fontFamily: Geist.bold, fontSize: 14 },
});
