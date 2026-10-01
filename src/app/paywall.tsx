import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PinkButton } from '@/components/pink-button';
import { Geist } from '@/components/widgets/tokens';
import { gradient } from '@/lib/gradient';
import { LINKS } from '@/lib/links';
import { addDays, buttonLabel, PLANS, renewalTerms, type Plan } from '@/lib/plans';
import { purchase, restorePurchases, usePlus, type PlusFeature } from '@/lib/plus';
import { scheduleTrialReminder } from '@/lib/trial-reminder';
import { getThemeByKey } from '@/themes';

const PERKS: { feature: PlusFeature; title: string; body: string }[] = [
  { feature: 'theme', title: 'Every theme', body: 'Frutiger Aero, Aero Night and every theme we add.' },
  { feature: 'icons', title: 'Every icon pack', body: 'All icons in every style, installed in one go.' },
  { feature: 'widget', title: 'All widgets', body: 'Weather, World Clocks and Vibe Card, in every style.' },
  { feature: 'export', title: 'Clean exports', body: 'TikTok posts without the watermark.' },
];

const shortDate = (date: Date) =>
  date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

/**
 * The Plus paywall: what's included (the perk that sent you here is highlighted), the plans, and
 * for a free trial a plain timeline of when you'll be reminded and charged.
 */
export default function PaywallScreen() {
  const { feature } = useLocalSearchParams<{ feature?: PlusFeature }>();
  const insets = useSafeAreaInsets();
  const plus = usePlus();
  const [plan, setPlan] = useState<Plan>(PLANS[0]);
  const [busy, setBusy] = useState(false);

  async function buy() {
    setBusy(true);
    try {
      if (!(await purchase(plan))) return;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (plan.trialDays) {
        const reminded = await scheduleTrialReminder(plan);
        const remindDay = shortDate(addDays(new Date(), plan.trialDays - 1));
        Alert.alert(
          'Welcome to Plus ✧',
          reminded
            ? `Your free trial has started. We'll remind you on ${remindDay}, the day before it ends.`
            : 'Your free trial has started. Notifications are off, so set yourself a reminder: it ends in ' +
                `${plan.trialDays} days, and you can cancel anytime in Settings.`
        );
      } else {
        Alert.alert('Welcome to Plus ✧', 'Everything is unlocked. Enjoy!');
      }
      router.back();
    } catch (error) {
      Alert.alert('Not available yet', error instanceof Error ? error.message : String(error));
    } finally {
      setBusy(false);
    }
  }

  async function restore() {
    const restored = await restorePurchases();
    Alert.alert(
      restored ? 'Plus restored ✧' : 'Nothing to restore',
      restored ? undefined : 'No Plus purchase was found for this Apple ID.'
    );
  }

  const today = new Date();
  return (
    <View style={styles.screen}>
      <Image
        source={getThemeByKey('aero').wallpaper}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        blurRadius={30}
      />
      <View style={[StyleSheet.absoluteFill, styles.veil]} />

      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 8 }]}>
        <Pressable
          hitSlop={16}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={styles.closeButton}>
          <Text style={styles.closeX}>✕</Text>
        </Pressable>

        <Text style={styles.title}>Plus ✧</Text>
        <Text style={styles.subtitle}>Unlock every theme, widget and icon pack.</Text>

        <View style={styles.glass}>
          {PERKS.map((perk) => (
            <View
              key={perk.feature}
              style={[
                styles.perk,
                (perk.feature === feature || (perk.feature === 'icons' && feature === 'installIcons')) && styles.perkOn,
              ]}>
              <Text style={styles.perkTitle}>{perk.title}</Text>
              <Text style={styles.perkBody}>{perk.body}</Text>
            </View>
          ))}
        </View>

        {plus ? (
          <Text style={styles.note}>Plus is on. Thanks for supporting Y2K Home ♡</Text>
        ) : (
          <>
            <View style={styles.plans}>
              {PLANS.map((p) => {
                const on = p.id === plan.id;
                return (
                  <Pressable
                    key={p.id}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setPlan(p);
                    }}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: on }}
                    style={[styles.plan, on && styles.planOn]}>
                    <View style={[styles.radio, on && styles.radioOn]} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.planTitle}>{p.title}</Text>
                      <Text style={styles.planDetail}>{p.detail}</Text>
                    </View>
                    <Text style={styles.planPrice}>
                      {p.price}
                      {p.period ? <Text style={styles.planPeriod}>/{p.period}</Text> : null}
                    </Text>
                    {p.trialDays ? (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{p.trialDays} DAYS FREE</Text>
                      </View>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>

            {plan.trialDays ? (
              <View style={styles.glass}>
                <Text style={styles.timelineTitle}>How your free trial works</Text>
                <Step dot="✧" when={`Today · ${shortDate(today)}`} what="Everything unlocks. You pay nothing." />
                <Step
                  dot="🔔"
                  when={`${shortDate(addDays(today, plan.trialDays - 1))}`}
                  what="We send you a reminder that your trial ends tomorrow."
                />
                <Step
                  dot="◎"
                  when={`${shortDate(addDays(today, plan.trialDays))}`}
                  what={`${plan.price}/${plan.period} starts. Cancel before this in Settings and you won't be charged.`}
                  last
                />
              </View>
            ) : null}
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        {!plus && (
          <>
            <Text style={styles.terms}>{renewalTerms(plan)}</Text>
            <PinkButton wide label={busy ? 'One moment…' : buttonLabel(plan)} onPress={buy} disabled={busy} />
          </>
        )}
        <View style={styles.links}>
          <Text style={styles.link} onPress={restore}>
            Restore
          </Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.link} onPress={() => Linking.openURL(LINKS.terms)}>
            Terms
          </Text>
          {LINKS.privacy ? (
            <>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.link} onPress={() => Linking.openURL(LINKS.privacy)}>
                Privacy
              </Text>
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function Step({ dot, when, what, last }: { dot: string; when: string; what: string; last?: boolean }) {
  return (
    <View style={styles.step}>
      <View style={styles.rail}>
        <Text style={styles.stepDot}>{dot}</Text>
        {!last && <View style={styles.line} />}
      </View>
      <View style={{ flex: 1, paddingBottom: last ? 0 : 12 }}>
        <Text style={styles.stepWhen}>{when}</Text>
        <Text style={styles.stepWhat}>{what}</Text>
      </View>
    </View>
  );
}

const INK = '#063A66';

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#2E9BE8' },
  veil: { backgroundColor: 'rgba(255,255,255,0.25)' },
  content: { padding: 20, paddingBottom: 220, gap: 12 },
  closeButton: {
    alignSelf: 'flex-end',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  closeX: { fontFamily: Geist.bold, fontSize: 16, color: INK },
  title: {
    fontFamily: Geist.black,
    fontSize: 52,
    color: 'white',
    textShadowColor: 'rgba(0, 50, 110, 0.45)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 18,
  },
  subtitle: { fontFamily: Geist.semibold, fontSize: 18, color: INK, marginTop: -4 },
  glass: {
    borderRadius: 26,
    borderCurve: 'continuous',
    padding: 8,
    gap: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    ...gradient('linear-gradient(170deg, rgba(255,255,255,0.88) 0%, rgba(225,245,255,0.72) 100%)'),
  },
  perk: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 18, borderCurve: 'continuous' },
  perkOn: { backgroundColor: 'rgba(11, 111, 194, 0.12)' },
  perkTitle: { fontFamily: Geist.bold, fontSize: 16, color: INK },
  perkBody: { fontFamily: Geist.medium, fontSize: 14, lineHeight: 19, color: '#2B5A80' },
  plans: { gap: 8 },
  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 20,
    borderCurve: 'continuous',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  planOn: { borderColor: '#E3268F', backgroundColor: 'white' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#9BB7CF' },
  radioOn: { borderWidth: 7, borderColor: '#E3268F' },
  planTitle: { fontFamily: Geist.bold, fontSize: 17, color: INK },
  planDetail: { fontFamily: Geist.medium, fontSize: 13, color: '#2B5A80', marginTop: 1 },
  planPrice: { fontFamily: Geist.bold, fontSize: 17, color: INK },
  planPeriod: { fontFamily: Geist.medium, fontSize: 13 },
  badge: {
    position: 'absolute',
    top: -9,
    right: 14,
    backgroundColor: '#E3268F',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeText: { fontFamily: Geist.bold, fontSize: 10.5, letterSpacing: 0.6, color: 'white' },
  timelineTitle: { fontFamily: Geist.bold, fontSize: 16, color: INK, paddingHorizontal: 12, paddingTop: 6 },
  step: { flexDirection: 'row', gap: 10, paddingHorizontal: 12, paddingTop: 8 },
  rail: { width: 24, alignItems: 'center' },
  stepDot: { fontSize: 15, color: '#E3268F', lineHeight: 20 },
  line: { flex: 1, width: 2, backgroundColor: 'rgba(11, 111, 194, 0.25)', marginTop: 2 },
  stepWhen: { fontFamily: Geist.bold, fontSize: 14, color: INK },
  stepWhat: { fontFamily: Geist.medium, fontSize: 14, lineHeight: 19, color: '#2B5A80' },
  note: { fontFamily: Geist.semibold, fontSize: 15, color: INK, textAlign: 'center', marginTop: 8 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    gap: 10,
    paddingTop: 14,
    paddingHorizontal: 20,
    ...gradient('linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(240,250,255,0.92) 22%, #F0FAFF 100%)'),
  },
  terms: { fontFamily: Geist.semibold, fontSize: 14, lineHeight: 19, color: INK, textAlign: 'center' },
  links: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  link: { fontFamily: Geist.semibold, fontSize: 13, color: '#2B5A80', textDecorationLine: 'underline' },
  dot: { color: '#2B5A80' },
});
