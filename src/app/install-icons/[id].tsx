import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';

import type { GlyphName } from '@/components/home/glyphs';
import { GLYPH_USES, iconSets, type IconChoice } from '@/components/home/icon-sets';
import { ThemeIcon } from '@/components/home/theme-icon';
import { PinkButton } from '@/components/pink-button';
import { Geist, type ThemeKey } from '@/components/widgets/tokens';
import { APPLE_APPS, POPULAR_APPS, type LinkedApp } from '@/lib/app-links';
import { buildIconProfile, type ProfileIcon } from '@/lib/icon-profile';
import { getTheme } from '@/themes';

import { ProfileServer } from '../../../modules/profile-server';

/** Rendered size of the hidden stage icons are captured from; saved at 192 × 192 px. */
const STAGE = 128;
const GLYPHS = GLYPH_USES.map((g) => g.name);

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

type Phase = 'pick' | 'explain' | 'working' | 'settings';

/** "Install all": every picked app's icon in one configuration profile, installed via Safari and Settings. */
export default function InstallIconsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = getTheme(id);
  const insets = useSafeAreaInsets();
  const stageRef = useRef<View>(null);
  const [phase, setPhase] = useState<Phase>('pick');
  const [picked, setPicked] = useState(() => new Set(APPLE_APPS.filter((a) => a.preselect).map((a) => a.id)));
  const [glyphs, setGlyphs] = useState<Record<string, GlyphName>>({});
  const [styleIndex, setStyleIndex] = useState(0);
  const [staged, setStaged] = useState<IconChoice>();
  const [progress, setProgress] = useState('');

  if (!theme) return null;
  const sets = iconSets(theme.key);
  const styleOptions = theme.key === 'y2k' ? [...sets.map((s) => s.title), 'Mix'] : sets.map((s) => s.title);
  const apps = [...APPLE_APPS, ...POPULAR_APPS];
  const chosen = apps.filter((a) => picked.has(a.id));

  const glyphOf = (app: LinkedApp) => glyphs[app.id] ?? app.glyph;

  /** The icon for an app in the chosen style; "Mix" alternates jelly pink and chrome. */
  function iconFor(app: LinkedApp, index: number): IconChoice {
    const name = glyphOf(app);
    if (styleIndex >= sets.length) return { name, hot: index % 2 === 0 };
    return sets[styleIndex].icons.find((i) => i.name === name) ?? { name };
  }

  function toggle(app: LinkedApp) {
    Haptics.selectionAsync();
    setPicked((current) => {
      const next = new Set(current);
      if (next.has(app.id)) next.delete(app.id);
      else next.add(app.id);
      return next;
    });
  }

  function cycleGlyph(app: LinkedApp) {
    Haptics.selectionAsync();
    const current = GLYPHS.indexOf(glyphOf(app));
    setGlyphs((g) => ({ ...g, [app.id]: GLYPHS[(current + 1) % GLYPHS.length] }));
  }

  async function renderIcon(icon: IconChoice) {
    setStaged(icon);
    await nextFrame();
    await nextFrame();
    await new Promise((r) => setTimeout(r, 30));
    return captureRef(stageRef, { format: 'png', width: 192, height: 192, result: 'base64' });
  }

  async function install() {
    if (!theme) return;
    if (!ProfileServer) {
      Alert.alert(
        'Update needed',
        'This build of the app can’t install icons yet. Install the latest build and try again.'
      );
      return;
    }
    setPhase('working');
    try {
      const icons: ProfileIcon[] = [];
      for (const [i, app] of chosen.entries()) {
        setProgress(`Making icon ${i + 1} of ${chosen.length}…`);
        icons.push({ label: app.name, url: app.url, pngBase64: await renderIcon(iconFor(app, i)) });
      }
      setStaged(undefined);
      setProgress('Opening Safari…');
      const port = await ProfileServer.serve(buildIconProfile(theme.name, icons));
      await Linking.openURL(`http://127.0.0.1:${port}/y2k-home-icons.mobileconfig`);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setPhase('settings');
    } catch (error) {
      setStaged(undefined);
      setPhase('pick');
      Alert.alert('Could not install', error instanceof Error ? error.message : String(error));
    }
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      {/* Hidden stage the icons are captured from, underneath the opaque content. */}
      <View style={styles.stage} pointerEvents="none">
        <View ref={stageRef} collapsable={false} style={{ width: STAGE, height: STAGE }}>
          {staged && (
            <ThemeIcon name={staged.name} hot={staged.hot} tint={staged.tint} theme={theme.key} size={STAGE} square />
          )}
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Install all at once</Text>
        <Pressable hitSlop={12} onPress={() => router.back()}>
          <Text style={styles.close}>{phase === 'settings' ? 'Done' : 'Close'}</Text>
        </Pressable>
      </View>

      {phase === 'pick' && (
        <>
          <ScrollView style={styles.body} contentContainerStyle={[styles.content, { paddingBottom: 120 }]}>
            <Text style={styles.text}>
              Tick the apps you want in {theme.name}. They’re added to your home screen in one go, already named. Tap an
              icon to change its picture.
            </Text>

            {styleOptions.length > 1 && (
              <View style={styles.segments}>
                {styleOptions.map((label, i) => (
                  <Pressable
                    key={label}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setStyleIndex(i);
                    }}
                    style={[styles.segment, styleIndex === i && styles.segmentOn]}>
                    <Text style={[styles.segmentText, styleIndex === i && styles.segmentTextOn]}>{label}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            <AppList
              title="Built-in apps"
              apps={APPLE_APPS}
              offset={0}
              {...{ picked, toggle, cycleGlyph, iconFor, themeKey: theme.key, base: theme.base }}
            />
            <AppList
              title="Popular apps"
              note="Only tick apps you have installed."
              apps={POPULAR_APPS}
              offset={APPLE_APPS.length}
              {...{ picked, toggle, cycleGlyph, iconFor, themeKey: theme.key, base: theme.base }}
            />
            <Text style={styles.small}>
              Camera, Settings, Calculator and Calendar can’t be added this way. Use the Shortcuts guide for those.
            </Text>
          </ScrollView>
          <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
            <PinkButton
              label={chosen.length ? `Install ${chosen.length} icons` : 'Pick some apps'}
              disabled={!chosen.length}
              onPress={() => setPhase('explain')}
            />
          </View>
        </>
      )}

      {phase === 'explain' && (
        <>
          <ScrollView style={styles.body} contentContainerStyle={styles.content}>
            <Text style={styles.heading}>Here’s what happens next</Text>
            <Text style={styles.text}>
              iOS installs icon sets as a “configuration profile”. It takes about 30 seconds.
            </Text>
            <Steps
              steps={[
                'Safari opens and asks to download a configuration profile. Tap Allow, then Close.',
                'Open the Settings app and tap “Profile Downloaded” near the top.',
                'Tap Install. You’ll see “Not Verified” in red: that only means the profile isn’t signed by a company certificate.',
                'Enter your passcode and tap Install again. Your icons appear on your home screen.',
              ]}
            />
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Is it safe?</Text>
              <Text style={styles.text}>
                This profile only adds home screen icons. It can’t see your messages, photos, browsing or anything else
                on your phone, and it doesn’t change any settings. Remove it any time in Settings › General › VPN &
                Device Management, and all its icons go with it. Installing a new set later replaces this one.
              </Text>
            </View>
          </ScrollView>
          <View style={[styles.footer, styles.footerRow, { paddingBottom: insets.bottom + 12 }]}>
            <PinkButton label="Back" variant="secondary" onPress={() => setPhase('pick')} />
            <PinkButton label="Continue to Safari" onPress={install} />
          </View>
        </>
      )}

      {phase === 'working' && (
        <View style={styles.center}>
          <ActivityIndicator color="#E3268F" size="large" />
          <Text style={styles.text}>{progress}</Text>
        </View>
      )}

      {phase === 'settings' && (
        <>
          <ScrollView style={styles.body} contentContainerStyle={styles.content}>
            <Text style={styles.heading}>Last step: Settings ✧</Text>
            <Steps
              steps={[
                'Open the Settings app.',
                'Tap “Profile Downloaded” near the top.',
                'Tap Install (top right), enter your passcode, then tap Install again.',
                'Go to your home screen: your new icons are there. Hide the old ones: press and hold one › Remove App › Remove from Home Screen.',
              ]}
            />
            <Text style={styles.small}>
              Safari didn’t ask to download anything? Tap Try again and keep this app open until Safari appears.
            </Text>
          </ScrollView>
          <View style={[styles.footer, styles.footerRow, { paddingBottom: insets.bottom + 12 }]}>
            <PinkButton label="Try again" variant="secondary" onPress={install} />
            <PinkButton label="Done" onPress={() => router.back()} />
          </View>
        </>
      )}
    </View>
  );
}

function AppList({
  title,
  note,
  apps,
  offset,
  picked,
  toggle,
  cycleGlyph,
  iconFor,
  themeKey,
  base,
}: {
  title: string;
  note?: string;
  apps: LinkedApp[];
  offset: number;
  picked: Set<string>;
  toggle: (app: LinkedApp) => void;
  cycleGlyph: (app: LinkedApp) => void;
  iconFor: (app: LinkedApp, index: number) => IconChoice;
  themeKey: ThemeKey;
  base: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {note && <Text style={styles.small}>{note}</Text>}
      {apps.map((app, i) => {
        const on = picked.has(app.id);
        const icon = iconFor(app, offset + i);
        return (
          <View key={app.id} style={styles.row}>
            <Pressable
              onPress={() => cycleGlyph(app)}
              accessibilityLabel={`Change the ${app.name} icon`}
              style={[styles.iconWell, { backgroundColor: base }]}>
              <ThemeIcon name={icon.name} hot={icon.hot} tint={icon.tint} theme={themeKey} size={44} />
            </Pressable>
            <Pressable onPress={() => toggle(app)} style={styles.rowLabel}>
              <Text style={styles.appName}>{app.name}</Text>
              <View style={[styles.check, on && styles.checkOn]}>{on && <Text style={styles.tick}>✓</Text>}</View>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

function Steps({ steps }: { steps: string[] }) {
  return (
    <View style={styles.card}>
      {steps.map((step, i) => (
        <View key={i} style={styles.step}>
          <Text style={styles.stepNumber}>{i + 1}</Text>
          <Text style={[styles.text, { flex: 1 }]}>{step}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBEFF8' },
  stage: { position: 'absolute', top: 0, left: 0 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
    backgroundColor: '#FBEFF8',
  },
  title: { fontFamily: Geist.black, fontSize: 24, color: '#3B0E33' },
  close: { fontFamily: Geist.bold, fontSize: 17, color: '#E3268F' },
  body: { flex: 1, backgroundColor: '#FBEFF8' },
  content: { padding: 20, gap: 14 },
  heading: { fontFamily: Geist.black, fontSize: 26, color: '#3B0E33' },
  text: { fontFamily: Geist.medium, fontSize: 16, lineHeight: 22, color: '#5E3656' },
  small: { fontFamily: Geist.medium, fontSize: 13, lineHeight: 18, color: '#8A4C7E' },
  segments: { flexDirection: 'row', gap: 8 },
  segment: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 14, backgroundColor: '#FCE1F3' },
  segmentOn: { backgroundColor: '#E3268F' },
  segmentText: { fontFamily: Geist.bold, fontSize: 15, color: '#C21F7E' },
  segmentTextOn: { color: 'white' },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderCurve: 'continuous',
    padding: 16,
    gap: 10,
    boxShadow: '0 6px 20px rgba(150, 60, 140, 0.10)',
  },
  cardTitle: { fontSize: 19, fontFamily: Geist.bold, color: '#3B0E33' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconWell: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderCurve: 'continuous',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  appName: { fontFamily: Geist.semibold, fontSize: 17, color: '#3B0E33' },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#F0B6DD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: '#E3268F', borderColor: '#E3268F' },
  tick: { color: 'white', fontFamily: Geist.black, fontSize: 14 },
  footer: { paddingHorizontal: 20, paddingTop: 10, backgroundColor: '#FBEFF8', alignItems: 'center' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  step: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    overflow: 'hidden',
    backgroundColor: '#FCE1F3',
    color: '#E3268F',
    fontFamily: Geist.bold,
  },
});
