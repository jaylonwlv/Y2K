import Constants from 'expo-constants';
import { router } from 'expo-router';
import { SymbolView, type SFSymbol } from 'expo-symbols';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { PinkButton } from '@/components/pink-button';
import { Geist } from '@/components/widgets/tokens';
import { gradient } from '@/lib/gradient';
import { LINKS } from '@/lib/links';
import { restorePurchases, setPlus, usePlus } from '@/lib/plus';
import { setOnboarded } from '@/lib/widget-bridge';

export default function SettingsScreen() {
  const plus = usePlus();
  const version = Constants.expoConfig?.version ?? '';

  async function restore() {
    const restored = await restorePurchases();
    Alert.alert(
      restored ? 'Plus restored ✧' : 'Nothing to restore',
      restored ? undefined : 'No Plus purchase was found for this Apple ID.'
    );
  }

  return (
    <ScrollView style={styles.screen} contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      <View style={[styles.plusCard, plus && styles.plusCardOn]}>
        <Text style={styles.plusKicker}>Y2K HOME PLUS</Text>
        <Text style={styles.plusTitle}>{plus ? 'Plus is on ✧' : 'Unlock everything'}</Text>
        <Text style={styles.plusBody}>
          {plus
            ? 'Every theme, widget and icon pack is yours. Thanks for supporting Y2K Home ♡'
            : 'Frutiger Aero and Aero Night, Weather, World Clocks and Vibe widgets, icons in one go and clean exports.'}
        </Text>
        {!plus && <PinkButton label="See Plus" onPress={() => router.push('/paywall')} />}
      </View>

      <Section title="Purchases">
        <Row symbol="arrow.clockwise" label="Restore Purchases" onPress={restore} />
        <Row
          symbol="creditcard"
          label="Manage Subscription"
          onPress={() => Linking.openURL(LINKS.manageSubscriptions)}
          external
        />
      </Section>

      <Section title="Help">
        <Row symbol="square.grid.2x2" label="Add widgets to your home screen" onPress={() => router.push('/widgets')} />
        <Row symbol="app.badge" label="Set up icons one by one" onPress={() => router.push('/icons/guide')} />
        {LINKS.supportEmail ? (
          <Row
            symbol="envelope"
            label="Contact support"
            onPress={() => Linking.openURL(`mailto:${LINKS.supportEmail}?subject=Y2K%20Home%20${version}`)}
            external
          />
        ) : null}
      </Section>

      <Section title="Legal">
        <Row symbol="doc.text" label="Terms of Use" onPress={() => Linking.openURL(LINKS.terms)} external />
        {LINKS.privacy ? (
          <Row symbol="hand.raised" label="Privacy Policy" onPress={() => Linking.openURL(LINKS.privacy)} external />
        ) : null}
        <Row
          symbol="cloud.sun"
          label="Weather data sources"
          onPress={() => Linking.openURL(LINKS.weatherLegal)}
          external
        />
      </Section>

      {__DEV__ && (
        <Section title="Developer">
          <View style={styles.row}>
            <SymbolView name="hammer" size={20} tintColor="#C21F7E" />
            <Text style={styles.rowLabel}>Plus (test)</Text>
            <Switch value={plus} trackColor={{ true: '#E3268F' }} onValueChange={setPlus} />
          </View>
          <Row
            symbol="arrow.counterclockwise"
            label="Replay onboarding"
            onPress={() => {
              setOnboarded(false);
              router.push('/onboarding');
            }}
          />
        </Section>
      )}

      <Text style={styles.footer}>
        Y2K Home {version}
        {'\n'}All art is original. Type: Geist (SIL Open Font License).
      </Text>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function Row({
  symbol,
  label,
  onPress,
  external,
}: {
  symbol: SFSymbol;
  label: string;
  onPress: () => void;
  external?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}>
      <SymbolView name={symbol} size={20} tintColor="#C21F7E" />
      <Text style={styles.rowLabel}>{label}</Text>
      <SymbolView name={external ? 'arrow.up.right' : 'chevron.right'} size={14} tintColor="#C9A3BF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBEFF8' },
  content: { padding: 20, paddingBottom: 120, gap: 18 },
  title: { fontSize: 34, fontFamily: Geist.black, color: '#3B0E33', marginTop: 8 },
  plusCard: {
    borderRadius: 28,
    borderCurve: 'continuous',
    padding: 18,
    gap: 8,
    boxShadow: '0 10px 28px rgba(160, 50, 140, 0.22)',
    ...gradient('linear-gradient(160deg, #FFE3F5 0%, #F7B8E3 55%, #C9B8FF 100%)'),
  },
  plusCardOn: gradient('linear-gradient(160deg, #E6FFF6 0%, #B8F0E0 60%, #A8E6FF 100%)'),
  plusKicker: { fontFamily: Geist.bold, fontSize: 12, letterSpacing: 1.6, color: '#C21F7E' },
  plusTitle: { fontFamily: Geist.black, fontSize: 26, color: '#3B0E33' },
  plusBody: { fontFamily: Geist.medium, fontSize: 15, lineHeight: 21, color: '#5E3656', marginBottom: 4 },
  sectionTitle: {
    fontFamily: Geist.bold,
    fontSize: 13,
    letterSpacing: 0.8,
    color: '#8A4C7E',
    textTransform: 'uppercase',
    marginLeft: 6,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 22,
    borderCurve: 'continuous',
    paddingHorizontal: 14,
    boxShadow: '0 6px 20px rgba(150, 60, 140, 0.10)',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  rowLabel: { flex: 1, fontFamily: Geist.semibold, fontSize: 16, color: '#3B0E33' },
  footer: { fontFamily: Geist.medium, fontSize: 13, lineHeight: 19, color: '#A7799C', textAlign: 'center' },
});
