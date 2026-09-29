import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Glass } from './glass';
import { Geist, MOCKUP_WIDGET, WIDGET_STYLES, type ThemeKey } from './tokens';

type Props = { size?: number; theme?: ThemeKey; title: string; subtitle: string; coverUri?: string };

const HEART = 'M12 20.8s-8.1-5.2-8.1-11.1A4.8 4.8 0 0112 6.4a4.8 4.8 0 018.1 3.3c0 5.9-8.1 11.1-8.1 11.1z';
const PLAY = 'M7 4.5l13 7.5-13 7.5z';

/** App-side look-alike of the Mixtape widget (`yMusic` in home2.html), in any theme. */
export function MixtapePreview({ size = MOCKUP_WIDGET, theme = 'y2k', title, subtitle, coverUri }: Props) {
  const k = size / MOCKUP_WIDGET;
  const { accent, ink } = WIDGET_STYLES[theme];
  return (
    <Glass width={size} height={size} theme={theme}>
      <View style={{ flex: 1, paddingHorizontal: 16 * k, paddingTop: 16 * k, paddingBottom: 30 * k }}>
        <View style={styles.row}>
          <View style={[styles.cover, { borderRadius: 12 * k }]}>
            <Image
              source={coverUri ? { uri: coverUri } : require('@/assets/images/mixtape-default-cover.png')}
              style={{ width: 78 * k, height: 78 * k, borderRadius: 12 * k }}
              contentFit="cover"
            />
          </View>
          <Svg width={22 * k} height={22 * k} viewBox="0 0 24 24">
            <Path d={HEART} fill={accent} />
          </Svg>
        </View>
        <View style={{ flex: 1 }} />
        <View style={[styles.row, { alignItems: 'flex-end', gap: 6 * k }]}>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={2} style={[styles.title, { color: ink, fontSize: 15 * k, lineHeight: 17.25 * k }]}>
              {title.toUpperCase()}
            </Text>
            {subtitle ? (
              <Text numberOfLines={1} style={[styles.subtitle, { color: ink, fontSize: 13.5 * k, marginTop: 2 * k }]}>
                {subtitle}
              </Text>
            ) : null}
          </View>
          <View
            style={[
              styles.play,
              { width: 44 * k, height: 44 * k, borderRadius: 22 * k },
              theme === 'night' && { backgroundColor: accent },
            ]}>
            <Svg width={18 * k} height={18 * k} viewBox="0 0 24 24">
              <Path d={PLAY} fill={theme === 'night' ? '#15171b' : accent} />
            </Svg>
          </View>
        </View>
      </View>
      <View style={[styles.track, { backgroundColor: `${accent}26` }]}>
        <View style={[styles.progress, { backgroundColor: accent }]} />
      </View>
    </Glass>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cover: { boxShadow: '0 4px 10px rgba(150, 40, 130, 0.25)' },
  title: { fontFamily: Geist.bold, letterSpacing: 0.15 },
  subtitle: { fontFamily: Geist.medium, opacity: 0.7 },
  play: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 3px 8px rgba(150, 40, 130, 0.25)',
  },
  track: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 3 },
  progress: { width: '36%', height: '100%' },
});
