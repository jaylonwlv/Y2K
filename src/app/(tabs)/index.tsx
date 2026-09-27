import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { themes } from '@/themes';

export default function ThemesScreen() {
  const [featured, ...upcoming] = themes;
  return (
    <ScrollView style={styles.screen} contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
      <Text style={styles.title}>Themes</Text>
      <Text style={styles.subtitle}>Wallpapers and widgets that match.</Text>

      <Link href={{ pathname: '/preview/[id]', params: { id: featured.id } }} asChild>
        <Pressable style={({ pressed }) => [styles.hero, pressed && styles.pressed]}>
          <Image source={featured.wallpaper} style={StyleSheet.absoluteFill} contentFit="cover" />
          <View style={styles.heroLabel}>
            <Text style={styles.heroName}>{featured.name}</Text>
            <Text style={styles.heroTagline}>{featured.tagline}</Text>
            <View style={styles.cta}>
              <Text style={styles.ctaText}>Preview</Text>
            </View>
          </View>
        </Pressable>
      </Link>

      <Text style={styles.section}>Coming soon</Text>
      <View style={styles.row}>
        {upcoming.map((theme) => (
          <View key={theme.id} style={[styles.card, { experimental_backgroundImage: theme.swatch }]}>
            <Text style={[styles.cardName, { color: theme.palette.ink }]}>{theme.name}</Text>
            <Text style={[styles.cardTagline, { color: theme.palette.inkSoft }]}>{theme.tagline}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBEFF8' },
  content: { padding: 20, paddingBottom: 120, gap: 12 },
  title: { fontSize: 34, fontWeight: '800', color: '#3B0E33', marginTop: 8 },
  subtitle: { fontSize: 16, color: '#8A4C7E', marginBottom: 8 },
  hero: {
    height: 440,
    borderRadius: 32,
    borderCurve: 'continuous',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    boxShadow: '0 12px 30px rgba(150, 60, 140, 0.25)',
  },
  pressed: { transform: [{ scale: 0.98 }] },
  heroLabel: {
    margin: 12,
    padding: 16,
    borderRadius: 24,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  heroName: { fontSize: 24, fontWeight: '800', color: '#6E1B5E' },
  heroTagline: { fontSize: 14, color: '#9E4F8C', marginTop: 2 },
  cta: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    experimental_backgroundImage: 'linear-gradient(180deg, #FF8ACB 0%, #E3268F 100%)',
  },
  ctaText: { color: 'white', fontWeight: '800', fontSize: 15 },
  section: { fontSize: 20, fontWeight: '800', color: '#3B0E33', marginTop: 16 },
  row: { flexDirection: 'row', gap: 12 },
  card: {
    flex: 1,
    height: 180,
    borderRadius: 24,
    borderCurve: 'continuous',
    padding: 14,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  cardName: { fontSize: 17, fontWeight: '800' },
  cardTagline: { fontSize: 12, marginTop: 2 },
});
