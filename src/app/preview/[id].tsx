import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CalendarWidgetPreview } from '@/components/calendar-widget-preview';
import { saveWallpaperToPhotos } from '@/lib/save-wallpaper';
import { getTheme } from '@/themes';

/** Same grid approximation the widget uses (targets/widget/WallpaperGlass.swift). */
function smallWidgetFrame(width: number, height: number, row: number, right: boolean) {
  const size = width * 0.395;
  const gap = size * 0.141;
  const left = (width - 2 * size - gap) / 2;
  return { size, x: right ? left + size + gap : left, y: height * 0.101 + row * size * 1.247 };
}

export default function PreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = getTheme(id);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [saving, setSaving] = useState(false);

  if (!theme?.wallpaper) return null;
  const wallpaper = theme.wallpaper;
  const calendar = smallWidgetFrame(width, height, 1, true);

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
      <View style={{ position: 'absolute', left: calendar.x, top: calendar.y }}>
        <CalendarWidgetPreview size={calendar.size} />
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
  bar: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  button: { paddingHorizontal: 22, paddingVertical: 14, borderRadius: 999, overflow: 'hidden' },
  fallback: { backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'white' },
  primaryFallback: { backgroundColor: '#E3268F', borderColor: '#FF9AD2' },
  buttonText: { fontSize: 17, fontWeight: '700', color: '#6E1B5E' },
  primaryText: { color: 'white' },
});
