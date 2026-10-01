import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { HomeScreen } from '@/components/home/home-screen';
import { Geist } from '@/components/widgets/tokens';
import { isThemeFree, usePlus } from '@/lib/plus';
import { getMixtape, getOnboarded, getWidgetTheme, sharedImageUri } from '@/lib/widget-bridge';
import { themes } from '@/themes';

const MINI_WIDTH = 132;
const MINI_HEIGHT = (MINI_WIDTH * 956) / 440;

export default function ThemesScreen() {
  const [active, setActive] = useState(getWidgetTheme);
  const plus = usePlus();
  useFocusEffect(useCallback(() => setActive(getWidgetTheme()), []));

  // First launch: the onboarding flow opens over the app once it's on screen.
  useEffect(() => {
    if (!getOnboarded()) router.push('/onboarding');
  }, []);

  const saved = getMixtape();
  const mixtape = {
    title: saved.title,
    subtitle: saved.subtitle,
    coverUri: saved.cover ? sharedImageUri('mixtape-cover.jpg', saved.v) : undefined,
  };

  return (
    <ScrollView style={styles.screen} contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
      <Text style={styles.title}>Themes</Text>
      <Text style={styles.subtitle}>Wallpapers, widgets and icons that match.</Text>

      {themes.map((theme) => (
        <Pressable
          key={theme.id}
          onPress={() => router.push({ pathname: '/preview/[id]', params: { id: theme.id } })}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
          <Image source={theme.wallpaper} style={StyleSheet.absoluteFill} contentFit="cover" />
          <View style={styles.cardText}>
            <View style={styles.badges}>
              {active === theme.key && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>✓ On your widgets</Text>
                </View>
              )}
              {!plus && !isThemeFree(theme.key) && (
                <View style={[styles.badge, styles.plusBadge]}>
                  <Text style={[styles.badgeText, styles.plusBadgeText]}>Plus ✧</Text>
                </View>
              )}
            </View>
            <View style={{ flex: 1 }} />
            <View style={styles.label}>
              <Text style={styles.name}>{theme.name}</Text>
              <Text style={styles.tagline}>{theme.tagline}</Text>
            </View>
            <View style={styles.actions}>
              <View style={styles.cta}>
                <Text style={styles.ctaText}>Preview</Text>
              </View>
              <Pressable
                onPress={() => router.push({ pathname: '/icons/[id]', params: { id: theme.id } })}
                style={({ pressed }) => [styles.cta, styles.ctaLight, pressed && { opacity: 0.7 }]}>
                <Text style={[styles.ctaText, { color: '#1a1020' }]}>Icons</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.mini} pointerEvents="none">
            <HomeScreen
              width={MINI_WIDTH}
              height={MINI_HEIGHT}
              theme={theme.key}
              wallpaper={theme.wallpaper}
              mixtape={mixtape}
            />
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBEFF8' },
  content: { padding: 20, paddingBottom: 120, gap: 16 },
  title: { fontSize: 34, fontFamily: Geist.black, color: '#3B0E33', marginTop: 8 },
  subtitle: { fontSize: 16, fontFamily: Geist.medium, color: '#8A4C7E', marginBottom: 4 },
  card: {
    height: MINI_HEIGHT + 28,
    borderRadius: 32,
    borderCurve: 'continuous',
    overflow: 'hidden',
    flexDirection: 'row',
    padding: 14,
    gap: 12,
    boxShadow: '0 12px 30px rgba(90, 40, 110, 0.22)',
  },
  pressed: { transform: [{ scale: 0.98 }] },
  cardText: { flex: 1, gap: 10 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: { fontFamily: Geist.bold, fontSize: 12, color: '#1E7A4A' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  plusBadge: { backgroundColor: '#E3268F' },
  plusBadgeText: { color: 'white' },
  label: {
    padding: 12,
    borderRadius: 20,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  name: { fontSize: 20, fontFamily: Geist.bold, color: '#2A1030' },
  tagline: { fontSize: 13, fontFamily: Geist.medium, color: '#5E3656', marginTop: 2 },
  cta: {
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#1a1020',
  },
  actions: { flexDirection: 'row', gap: 8 },
  ctaLight: { backgroundColor: 'rgba(255,255,255,0.9)' },
  ctaText: { color: 'white', fontFamily: Geist.bold, fontSize: 15 },
  mini: {
    width: MINI_WIDTH,
    height: MINI_HEIGHT,
    borderRadius: 22,
    borderCurve: 'continuous',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#0b0b0d',
  },
});
