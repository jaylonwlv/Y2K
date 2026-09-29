import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SymbolView, type SFSymbol } from 'expo-symbols';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeScreen } from '@/components/home/home-screen';
import { Y2K_LAYOUTS } from '@/components/home/layouts';
import { Geist } from '@/components/widgets/tokens';
import { saveWallpaperToPhotos } from '@/lib/save-wallpaper';
import { getMixtape, sharedImageUri } from '@/lib/widget-bridge';
import { getTheme } from '@/themes';

export default function PreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = getTheme(id);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [layout, setLayout] = useState(0);
  const [controls, setControls] = useState(true);
  const [saving, setSaving] = useState(false);

  if (!theme?.wallpaper) return null;
  const wallpaper = theme.wallpaper;
  const saved = getMixtape();
  const mixtape = {
    title: saved.title,
    subtitle: saved.subtitle,
    coverUri: saved.cover ? sharedImageUri('mixtape-cover.jpg', saved.v) : undefined,
  };

  function shuffle() {
    Haptics.selectionAsync();
    setLayout((l) => (l + 1) % Y2K_LAYOUTS.length);
  }

  async function saveWallpaper() {
    setSaving(true);
    try {
      await saveWallpaperToPhotos(wallpaper);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Saved to Photos ✧',
        'Open Photos, tap the wallpaper, then Share › Use as Wallpaper. Then add the widgets from the Widgets tab.'
      );
    } catch (error) {
      Alert.alert('Could not save', error instanceof Error ? error.message : String(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <Pressable style={StyleSheet.absoluteFill} onPress={() => setControls((c) => !c)}>
        <HomeScreen width={width} height={height} wallpaper={wallpaper} layout={layout} mixtape={mixtape} animated />
      </Pressable>

      {controls && (
        <Animated.View
          entering={FadeIn.duration(180)}
          exiting={FadeOut.duration(180)}
          style={[styles.bar, { bottom: insets.bottom + 14 }]}>
          <Glass style={styles.barInner}>
            <BarButton symbol="xmark" label="Close" onPress={() => router.back()} />
            <BarButton symbol="shuffle" label="Shuffle" onPress={shuffle} />
            <BarButton
              symbol="photo.on.rectangle"
              label={saving ? 'Saving…' : 'Wallpaper'}
              onPress={saveWallpaper}
              disabled={saving}
            />
            <BarButton
              symbol="square.and.arrow.up"
              label="Export"
              primary
              onPress={() =>
                router.push({ pathname: '/export/[id]', params: { id: theme.id, layout: String(layout) } })
              }
            />
          </Glass>
          <Text style={styles.hint}>Tap anywhere to hide the buttons</Text>
        </Animated.View>
      )}
    </View>
  );
}

function Glass({ children, style }: { children: React.ReactNode; style: object }) {
  return isLiquidGlassAvailable() ? (
    <GlassView isInteractive style={style}>
      {children}
    </GlassView>
  ) : (
    <View style={[style, styles.fallback]}>{children}</View>
  );
}

function BarButton({
  symbol,
  label,
  onPress,
  primary,
  disabled,
}: {
  symbol: SFSymbol;
  label: string;
  onPress: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.button, primary && styles.primary, pressed && { opacity: 0.7 }]}>
      <SymbolView name={symbol} size={20} tintColor={primary ? '#ffffff' : '#6E1B5E'} />
      <Text style={[styles.label, primary && { color: 'white' }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4C6EC' },
  bar: { position: 'absolute', left: 16, right: 16, alignItems: 'center', gap: 8 },
  barInner: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    padding: 6,
    borderRadius: 32,
    overflow: 'hidden',
  },
  fallback: { backgroundColor: 'rgba(255,255,255,0.75)', borderWidth: 1, borderColor: 'white' },
  button: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 8, borderRadius: 26 },
  primary: { experimental_backgroundImage: 'linear-gradient(180deg, #FF8ACB 0%, #E3268F 100%)' },
  label: { fontFamily: Geist.bold, fontSize: 12, color: '#6E1B5E' },
  hint: {
    fontFamily: Geist.medium,
    fontSize: 12,
    color: '#6E1B5E',
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
