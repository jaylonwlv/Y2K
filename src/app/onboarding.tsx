import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeScreen } from '@/components/home/home-screen';
import { HOME_LAYOUTS } from '@/components/home/layouts';
import { PinkButton } from '@/components/pink-button';
import { Geist, type ThemeKey } from '@/components/widgets/tokens';
import { isThemeFree } from '@/lib/plus';
import { getMixtape, setOnboarded, setWidgetTheme, sharedImageUri } from '@/lib/widget-bridge';
import { getThemeByKey, themes } from '@/themes';

type Step = 'welcome' | 'pick' | 'preview';

/**
 * First-run flow: welcome, pick a vibe, see it full screen, then the paywall (which can be closed).
 * Shown once; Settings › Developer can replay it.
 */
export default function OnboardingScreen() {
  const [step, setStep] = useState<Step>('welcome');
  const [choice, setChoice] = useState<ThemeKey>('y2k');
  const saved = getMixtape();
  const mixtape = {
    title: saved.title,
    subtitle: saved.subtitle,
    coverUri: saved.cover ? sharedImageUri('mixtape-cover.jpg', saved.v) : undefined,
  };

  function go(next: Step) {
    Haptics.selectionAsync();
    setStep(next);
  }

  /** Leaves onboarding for the paywall; closing the paywall lands in the app. */
  function finish(showPaywall: boolean) {
    setOnboarded(true);
    // The free theme goes straight onto the widgets; a Plus theme waits for Plus.
    if (isThemeFree(choice)) setWidgetTheme(choice);
    if (showPaywall) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace({ pathname: '/paywall', params: isThemeFree(choice) ? {} : { feature: 'theme' } });
    } else {
      router.back();
    }
  }

  if (step === 'preview') {
    return <Preview theme={choice} mixtape={mixtape} onWant={() => finish(true)} onBack={() => go('pick')} />;
  }
  return step === 'welcome' ? (
    <Welcome mixtape={mixtape} onNext={() => go('pick')} onSkip={() => finish(false)} />
  ) : (
    <Pick
      choice={choice}
      mixtape={mixtape}
      onChoose={(key) => {
        Haptics.selectionAsync();
        setChoice(key);
      }}
      onNext={() => go('preview')}
      onSkip={() => finish(false)}
    />
  );
}

type Mixtape = { title: string; subtitle: string; coverUri?: string };

function Welcome({ mixtape, onNext, onSkip }: { mixtape: Mixtape; onNext: () => void; onSkip: () => void }) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const theme = getThemeByKey('y2k');
  // Cycle the mini home screen through its layouts so the icons keep popping in.
  const [layout, setLayout] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setLayout((l) => (l + 1) % HOME_LAYOUTS.y2k.length), 2600);
    return () => clearInterval(id);
  }, []);
  const miniHeight = Math.min(height * 0.5, 440);
  const miniWidth = (miniHeight * 440) / 956;

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }]}>
      <StatusBar style="dark" />
      <Image source={theme.wallpaper} style={StyleSheet.absoluteFill} contentFit="cover" blurRadius={40} />
      <View style={[StyleSheet.absoluteFill, styles.veil]} />

      <Pressable hitSlop={12} onPress={onSkip} style={styles.skip}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <View style={styles.center}>
        <Animated.View
          entering={FadeInDown.duration(500)}
          style={[styles.phone, { width: miniWidth + 12, borderRadius: miniWidth * 0.17 + 6 }]}>
          <View style={{ width: miniWidth, height: miniHeight, borderRadius: miniWidth * 0.17, overflow: 'hidden' }}>
            <HomeScreen
              width={miniWidth}
              height={miniHeight}
              theme="y2k"
              wallpaper={theme.wallpaper}
              layout={layout}
              mixtape={mixtape}
              animated
            />
          </View>
        </Animated.View>

        <Animated.Text entering={FadeInUp.delay(250).duration(500)} style={styles.bigTitle}>
          Make your iPhone{'\n'}feel like you ✧
        </Animated.Text>
        <Animated.Text entering={FadeInUp.delay(400).duration(500)} style={styles.lead}>
          Wallpapers, widgets and icons that match, in Y2K Pink Chrome, Frutiger Aero and Aero Night.
        </Animated.Text>
      </View>

      <Animated.View entering={FadeIn.delay(600)} style={styles.footer}>
        <PinkButton wide label="Get started" onPress={onNext} />
      </Animated.View>
    </View>
  );
}

function Pick({
  choice,
  mixtape,
  onChoose,
  onNext,
  onSkip,
}: {
  choice: ThemeKey;
  mixtape: Mixtape;
  onChoose: (key: ThemeKey) => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  const insets = useSafeAreaInsets();
  const miniWidth = 78;
  const miniHeight = (miniWidth * 956) / 440;

  return (
    <View style={[styles.screen, styles.pickScreen, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }]}>
      <StatusBar style="dark" />
      <Pressable hitSlop={12} onPress={onSkip} style={styles.skip}>
        <Text style={[styles.skipText, { color: '#8A4C7E' }]}>Skip</Text>
      </Pressable>

      <ScrollView contentContainerStyle={styles.pickContent}>
        <Animated.Text entering={FadeInDown.duration(400)} style={styles.pickTitle}>
          Pick your vibe
        </Animated.Text>
        <Text style={styles.pickLead}>You can switch any time. Every theme is free to preview.</Text>

        {themes.map((theme, i) => {
          const on = theme.key === choice;
          return (
            <Animated.View key={theme.id} entering={FadeInDown.delay(120 + i * 90).duration(400)}>
              <Pressable
                onPress={() => onChoose(theme.key)}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                style={[styles.option, on && styles.optionOn]}>
                <Image source={theme.wallpaper} style={StyleSheet.absoluteFill} contentFit="cover" blurRadius={24} />
                <View style={[StyleSheet.absoluteFill, styles.optionVeil]} />
                <View style={[styles.mini, { width: miniWidth, height: miniHeight }]} pointerEvents="none">
                  <HomeScreen
                    width={miniWidth}
                    height={miniHeight}
                    theme={theme.key}
                    wallpaper={theme.wallpaper}
                    mixtape={mixtape}
                  />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionName}>{theme.name}</Text>
                  <Text style={styles.optionTagline}>{theme.tagline}</Text>
                  {!isThemeFree(theme.key) && <Text style={styles.optionPlus}>Plus ✧</Text>}
                </View>
                <View style={[styles.radio, on && styles.radioOn]} />
              </Pressable>
            </Animated.View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <PinkButton wide label={`Preview ${getThemeByKey(choice).name}`} onPress={onNext} />
      </View>
    </View>
  );
}

function Preview({
  theme: key,
  mixtape,
  onWant,
  onBack,
}: {
  theme: ThemeKey;
  mixtape: Mixtape;
  onWant: () => void;
  onBack: () => void;
}) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const theme = getThemeByKey(key);

  return (
    <View style={styles.previewScreen}>
      <StatusBar style={key === 'y2k' ? 'dark' : 'light'} />
      <HomeScreen width={width} height={height} theme={key} wallpaper={theme.wallpaper} mixtape={mixtape} animated />

      <Animated.View
        entering={FadeInUp.delay(1600).duration(500)}
        style={[styles.sheet, { bottom: insets.bottom + 12 }]}>
        <Glass>
          <Text style={styles.sheetTitle}>This is your phone in {theme.name} ✧</Text>
          <Text style={styles.sheetBody}>Matching wallpaper, widgets and icons, set up in a couple of minutes.</Text>
          <View style={styles.sheetButtons}>
            <PinkButton label="Try another" variant="secondary" onPress={onBack} />
            <View style={{ flex: 1 }}>
              <PinkButton wide label="I want this ✧" onPress={onWant} />
            </View>
          </View>
        </Glass>
      </Animated.View>
    </View>
  );
}

function Glass({ children }: { children: React.ReactNode }) {
  return isLiquidGlassAvailable() ? (
    <GlassView style={styles.glass}>{children}</GlassView>
  ) : (
    <View style={[styles.glass, styles.glassFallback]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4C6EC' },
  veil: { backgroundColor: 'rgba(255,255,255,0.35)' },
  skip: { alignSelf: 'flex-end', paddingHorizontal: 20, paddingVertical: 6, zIndex: 1 },
  skipText: { fontFamily: Geist.semibold, fontSize: 16, color: '#6E1B5E' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18, paddingHorizontal: 28 },
  phone: {
    padding: 6,
    borderCurve: 'continuous',
    backgroundColor: '#0b0b0d',
    boxShadow: '0 20px 50px rgba(110, 27, 94, 0.35)',
  },
  bigTitle: { fontFamily: Geist.black, fontSize: 34, lineHeight: 38, color: '#3B0E33', textAlign: 'center' },
  lead: { fontFamily: Geist.medium, fontSize: 16, lineHeight: 22, color: '#6E1B5E', textAlign: 'center' },
  footer: { paddingHorizontal: 20 },
  pickScreen: { backgroundColor: '#FBEFF8' },
  pickContent: { padding: 20, gap: 12, paddingBottom: 24 },
  pickTitle: { fontFamily: Geist.black, fontSize: 34, color: '#3B0E33' },
  pickLead: { fontFamily: Geist.medium, fontSize: 16, color: '#8A4C7E', marginBottom: 4 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 12,
    borderRadius: 28,
    borderCurve: 'continuous',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  optionOn: { borderColor: '#E3268F' },
  optionVeil: { backgroundColor: 'rgba(255,255,255,0.45)' },
  mini: { borderRadius: 14, overflow: 'hidden', borderWidth: 2, borderColor: '#0b0b0d' },
  optionText: { flex: 1, gap: 3 },
  optionName: { fontFamily: Geist.bold, fontSize: 19, color: '#2A1030' },
  optionTagline: { fontFamily: Geist.medium, fontSize: 13, color: '#4A2A45' },
  optionPlus: { fontFamily: Geist.bold, fontSize: 12, color: '#C21F7E', marginTop: 2 },
  radio: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: 'rgba(42,16,48,0.35)',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  radioOn: { borderWidth: 8, borderColor: '#E3268F' },
  previewScreen: { flex: 1, backgroundColor: 'black' },
  sheet: { position: 'absolute', left: 12, right: 12 },
  glass: { borderRadius: 30, borderCurve: 'continuous', padding: 18, gap: 8, overflow: 'hidden' },
  glassFallback: { backgroundColor: 'rgba(255,255,255,0.88)', borderWidth: 1, borderColor: 'white' },
  sheetTitle: { fontFamily: Geist.black, fontSize: 21, color: '#2A1030' },
  sheetBody: { fontFamily: Geist.medium, fontSize: 15, lineHeight: 20, color: '#4A2A45' },
  sheetButtons: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
});
