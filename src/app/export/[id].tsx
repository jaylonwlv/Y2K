import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';

import { TikTokPost } from '@/components/home/tiktok-post';
import { PinkButton } from '@/components/pink-button';
import { Geist } from '@/components/widgets/tokens';
import { saveImageToPhotos } from '@/lib/save-wallpaper';
import { getMixtape, sharedImageUri } from '@/lib/widget-bridge';
import { getTheme } from '@/themes';

/** Hook lines for the Y2K theme. The first one is from the mockup. */
const HOOKS = [
  'made my phone\nY2K again 🦋',
  'POV: your iPhone\nbut it’s 2003 ✧',
  'pink chrome\nhome screen 💿',
  'it’s giving\nflip phone era ♡',
  '',
];

export default function ExportScreen() {
  const { id, layout } = useLocalSearchParams<{ id: string; layout?: string }>();
  const theme = getTheme(id);
  const insets = useSafeAreaInsets();
  const postRef = useRef<View>(null);
  const [hook, setHook] = useState(HOOKS[0]);
  const [busy, setBusy] = useState<'save' | 'share'>();
  const [stage, setStage] = useState({ width: 0, height: 0 });

  if (!theme?.wallpaper) return null;
  const saved = getMixtape();
  const mixtape = {
    title: saved.title,
    subtitle: saved.subtitle,
    coverUri: saved.cover ? sharedImageUri('mixtape-cover.jpg', saved.v) : undefined,
  };

  // Fit the 9:16 post into whatever space the stage gets between the header and the controls.
  const postWidth = Math.min(stage.width - 48, (stage.height * 9) / 16);

  /** Renders the post at full TikTok resolution into a temporary PNG. */
  async function render() {
    return captureRef(postRef, { format: 'png', width: 1080, height: 1920, result: 'tmpfile' });
  }

  async function save() {
    setBusy('save');
    try {
      await saveImageToPhotos(await render());
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Saved to Photos ✧',
        'In TikTok, tap +, then choose the photo from your library. Add a trending sound and post it as a photo.'
      );
    } catch (error) {
      Alert.alert('Could not export', error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(undefined);
    }
  }

  async function share() {
    setBusy('share');
    try {
      const uri = await render();
      if (!(await Sharing.isAvailableAsync())) throw new Error('Sharing is not available on this device.');
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        UTI: 'public.png',
        dialogTitle: 'Share your home screen',
      });
    } catch (error) {
      Alert.alert('Could not share', error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(undefined);
    }
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 12 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Export for TikTok</Text>
        <Pressable hitSlop={12} onPress={() => router.back()}>
          <Text style={styles.close}>Done</Text>
        </Pressable>
      </View>

      <View style={styles.stage} onLayout={(e) => setStage(e.nativeEvent.layout)}>
        {postWidth > 0 && (
          <TikTokPost
            ref={postRef}
            width={postWidth}
            hook={hook}
            layout={Number(layout ?? 0)}
            wallpaper={theme.wallpaper}
            mixtape={mixtape}
          />
        )}
      </View>

      <ScrollView
        horizontal
        style={styles.chipRow}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}>
        {HOOKS.map((h) => (
          <Pressable
            key={h || 'none'}
            onPress={() => {
              Haptics.selectionAsync();
              setHook(h);
            }}
            style={[styles.chip, h === hook && styles.chipOn]}>
            <Text style={[styles.chipText, h === hook && styles.chipTextOn]}>
              {h ? h.replace('\n', ' ') : 'No text'}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.actions}>
        <PinkButton label={busy === 'save' ? 'Saving…' : 'Save to Photos'} onPress={save} disabled={!!busy} />
        <PinkButton
          label={busy === 'share' ? 'Preparing…' : 'Share…'}
          variant="secondary"
          onPress={share}
          disabled={!!busy}
        />
      </View>
      <Text style={styles.hint}>1080 × 1920, ready for TikTok photo mode, Reels and Stories.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBEFF8', gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  title: { fontFamily: Geist.black, fontSize: 24, color: '#3B0E33' },
  close: { fontFamily: Geist.bold, fontSize: 17, color: '#E3268F' },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  chipRow: { flexGrow: 0 },
  chips: { paddingHorizontal: 20, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#F3D3EA',
  },
  chipOn: { backgroundColor: '#E3268F', borderColor: '#E3268F' },
  chipText: { fontFamily: Geist.semibold, fontSize: 14, color: '#6E1B5E' },
  chipTextOn: { color: 'white' },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  hint: { fontFamily: Geist.medium, fontSize: 12, color: '#9E6A93', textAlign: 'center' },
});
