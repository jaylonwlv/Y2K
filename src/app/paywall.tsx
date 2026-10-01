import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PinkButton } from '@/components/pink-button';
import { Geist } from '@/components/widgets/tokens';
import { gradient } from '@/lib/gradient';
import { restorePurchases, setPlus, usePlus, type PlusFeature } from '@/lib/plus';
import { getThemeByKey } from '@/themes';

const PERKS: { feature: PlusFeature; title: string; body: string }[] = [
  { feature: 'theme', title: 'Every theme', body: 'Frutiger Aero and Aero Night, plus every theme we add.' },
  { feature: 'widget', title: 'All widgets', body: 'Weather, World Clocks and Vibe Card, in every style.' },
  { feature: 'installIcons', title: 'Icons in one go', body: 'Install a whole icon pack at once, no Shortcuts.' },
  { feature: 'export', title: 'Clean exports', body: 'TikTok posts without the watermark.' },
];

/**
 * Placeholder paywall. It shows what Plus includes and highlights the feature that sent the user
 * here; buying and restoring arrive with in-app purchases.
 */
export default function PaywallScreen() {
  const { feature } = useLocalSearchParams<{ feature?: PlusFeature }>();
  const insets = useSafeAreaInsets();
  const plus = usePlus();

  return (
    <View style={styles.screen}>
      <Image
        source={getThemeByKey('aero').wallpaper}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        blurRadius={30}
      />
      <View style={[StyleSheet.absoluteFill, styles.veil]} />

      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}>
        <Pressable hitSlop={12} onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.close}>Close</Text>
        </Pressable>

        <Text style={styles.kicker}>Y2K HOME</Text>
        <Text style={styles.title}>Plus ✧</Text>
        <Text style={styles.subtitle}>Unlock every theme, widget and icon pack.</Text>

        <View style={styles.card}>
          {PERKS.map((perk) => (
            <View key={perk.feature} style={[styles.perk, perk.feature === feature && styles.perkOn]}>
              <Text style={styles.perkTitle}>{perk.title}</Text>
              <Text style={styles.perkBody}>{perk.body}</Text>
            </View>
          ))}
        </View>

        {plus ? (
          <Text style={styles.note}>Plus is on. Thanks for supporting Y2K Home ♡</Text>
        ) : (
          <Text style={styles.note}>Subscriptions arrive in the next update.</Text>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        {__DEV__ && !plus && (
          <PinkButton
            label="Unlock Plus (test)"
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              setPlus(true);
              router.back();
            }}
          />
        )}
        <Pressable
          hitSlop={8}
          onPress={async () => {
            const restored = await restorePurchases();
            Alert.alert(restored ? 'Plus restored ✧' : 'Nothing to restore', restored ? undefined : restoreHint);
          }}>
          <Text style={styles.restore}>Restore Purchases</Text>
        </Pressable>
      </View>
    </View>
  );
}

const restoreHint = 'No Plus purchase was found for this Apple ID.';

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#2E9BE8' },
  veil: { backgroundColor: 'rgba(255,255,255,0.25)' },
  content: { padding: 24, paddingBottom: 160, gap: 12 },
  closeButton: { alignSelf: 'flex-end' },
  close: { fontFamily: Geist.bold, fontSize: 17, color: '#063A66' },
  kicker: { fontFamily: Geist.bold, fontSize: 14, letterSpacing: 2, color: '#0B6FC2', marginTop: 12 },
  title: {
    fontFamily: Geist.black,
    fontSize: 56,
    color: 'white',
    textShadowColor: 'rgba(0, 50, 110, 0.45)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 18,
  },
  subtitle: { fontFamily: Geist.semibold, fontSize: 19, color: '#063A66' },
  card: {
    marginTop: 8,
    borderRadius: 28,
    borderCurve: 'continuous',
    padding: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    ...gradient('linear-gradient(170deg, rgba(255,255,255,0.85) 0%, rgba(225,245,255,0.7) 100%)'),
  },
  perk: { padding: 12, borderRadius: 20, borderCurve: 'continuous' },
  perkOn: { backgroundColor: 'rgba(11, 111, 194, 0.12)' },
  perkTitle: { fontFamily: Geist.bold, fontSize: 17, color: '#063A66' },
  perkBody: { fontFamily: Geist.medium, fontSize: 15, lineHeight: 20, color: '#2B5A80', marginTop: 2 },
  note: { fontFamily: Geist.semibold, fontSize: 15, color: '#063A66', textAlign: 'center', marginTop: 8 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', gap: 14, paddingTop: 12 },
  restore: { fontFamily: Geist.semibold, fontSize: 15, color: '#063A66', textDecorationLine: 'underline' },
});
