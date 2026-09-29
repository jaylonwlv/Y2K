import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { Glass } from './glass';
import { Geist, MOCKUP_WIDGET, WIDGET_STYLES, type ThemeKey } from './tokens';

type Props = {
  width?: number;
  height?: number;
  theme?: ThemeKey;
  caption: string;
  subcaption: string;
  photoUri?: string;
};

/** App-side look-alike of the Vibe Card widget: the user's photo with a frosted caption. */
export function VibePreview({
  width = MOCKUP_WIDGET,
  height = MOCKUP_WIDGET,
  theme = 'y2k',
  caption,
  subcaption,
  photoUri,
}: Props) {
  const k = Math.min(width, height) / MOCKUP_WIDGET;
  const { ink, pill } = WIDGET_STYLES[theme];
  const placeholderCaption = photoUri ? subcaption : subcaption || '✧ add your photo in the app';
  return (
    <Glass
      width={width}
      height={height}
      theme={theme}
      background={
        photoUri ? (
          <Image source={{ uri: photoUri }} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : (
          <View style={[StyleSheet.absoluteFill, styles.holo]} />
        )
      }>
      <View style={{ flex: 1, padding: 14 * k, justifyContent: 'space-between' }}>
        <Text style={[styles.sparkle, { fontSize: 16 * k }]}>✦</Text>
        {caption || placeholderCaption ? (
          <View
            style={[
              styles.pill,
              {
                experimental_backgroundImage: pill.gradient,
                borderColor: pill.edge,
                borderRadius: 16 * k,
                paddingHorizontal: 12 * k,
                paddingVertical: 9 * k,
              },
            ]}>
            {caption ? (
              <Text numberOfLines={1} style={[styles.caption, { color: ink, fontSize: 14 * k }]}>
                {caption}
              </Text>
            ) : null}
            {placeholderCaption ? (
              <Text numberOfLines={1} style={[styles.subcaption, { color: ink, fontSize: 12 * k }]}>
                {placeholderCaption}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>
    </Glass>
  );
}

const styles = StyleSheet.create({
  holo: {
    experimental_backgroundImage:
      'linear-gradient(135deg, #ffffff 0%, #ffc2ec 25%, #c9b8ff 45%, #a8e6ff 65%, #fff3b0 85%, #ffc2ec 100%)',
  },
  sparkle: { alignSelf: 'flex-end', color: 'white', textShadowColor: 'white', textShadowRadius: 6 },
  pill: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    borderWidth: 1,
    boxShadow: '0 4px 16px rgba(160, 50, 120, 0.18)',
  },
  caption: { fontFamily: Geist.bold },
  subcaption: { fontFamily: Geist.medium, opacity: 0.7 },
});
