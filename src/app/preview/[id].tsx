import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CalendarPreview } from '@/components/widgets/calendar-preview';
import { MixtapePreview } from '@/components/widgets/mixtape-preview';
import { cellOrigin, homeGrid } from '@/lib/home-grid';
import { saveWallpaperToPhotos } from '@/lib/save-wallpaper';
import { getMixtape, sharedImageUri } from '@/lib/widget-bridge';
import { getTheme } from '@/themes';

export default function PreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = getTheme(id);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [saving, setSaving] = useState(false);

  if (!theme?.wallpaper) return null;
  const wallpaper = theme.wallpaper;
  // Layout 0 from home2.html: Mixtape at the top left, Calendar starting on row 4, right side.
  const grid = homeGrid(width, height);
  const mixtape = getMixtape();

  async function save() {
    setSaving(true);
    try {
      await saveWallpaperToPhotos(wallpaper);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Saved to Photos ✧',
        'Open Photos, tap the wallpaper, then Share › Use as Wallpaper. Then add the Chrome Calendar widget from the Widgets tab.'
      );
    } catch (error) {
      Alert.alert('Could not save', error instanceof Error ? error.message : String(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.screen}>
      <Image source={wallpaper} style={StyleSheet.absoluteFill} contentFit="cover" />
      <View style={[styles.cell, cellOrigin(grid, 0, 0)]}>
        <MixtapePreview
          size={grid.small}
          title={mixtape.title}
          subtitle={mixtape.subtitle}
          coverUri={mixtape.cover ? sharedImageUri('mixtape-cover.jpg', mixtape.v) : undefined}
        />
      </View>
      <View style={[styles.cell, cellOrigin(grid, 2, 3)]}>
        <CalendarPreview size={grid.small} />
      </View>

      <View style={[styles.bar, { bottom: insets.bottom + 16 }]}>
        <GlassButton label="Close" onPress={() => router.back()} />
        <GlassButton label={saving ? 'Saving…' : 'Save wallpaper'} primary onPress={save} disabled={saving} />
      </View>
    </View>
  );
}

function GlassButton({
  label,
  onPress,
  primary,
  disabled,
}: {
  label: string;
  onPress: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  const content = <Text style={[styles.buttonText, primary && styles.primaryText]}>{label}</Text>;
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [pressed && { opacity: 0.8 }]}>
      {isLiquidGlassAvailable() ? (
        <GlassView
          isInteractive
          tintColor={primary ? 'rgba(227,38,143,0.75)' : undefined}
          style={styles.button}>
          {content}
        </GlassView>
      ) : (
        <View style={[styles.button, styles.fallback, primary && styles.primaryFallback]}>{content}</View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4C6EC' },
  cell: { position: 'absolute' },
  bar: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  button: { paddingHorizontal: 22, paddingVertical: 14, borderRadius: 999, overflow: 'hidden' },
  fallback: { backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'white' },
  primaryFallback: { backgroundColor: '#E3268F', borderColor: '#FF9AD2' },
  buttonText: { fontSize: 17, fontWeight: '700', color: '#6E1B5E' },
  primaryText: { color: 'white' },
});
