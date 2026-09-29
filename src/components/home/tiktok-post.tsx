import { Image } from 'expo-image';
import { forwardRef } from 'react';
import { StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';

import { Geist } from '@/components/widgets/tokens';

import { HomeScreen } from './home-screen';

type Props = {
  /** On-screen width; the post is always 9:16 and gets captured at 1080 × 1920. */
  width: number;
  hook: string;
  layout: number;
  wallpaper: ImageSourcePropType;
  mixtape: { title: string; subtitle: string; coverUri?: string };
};

/**
 * TikTok / Reels post from home2.html's "post" mode: a blurred backdrop, a hook line and the
 * home screen in a phone frame. Every size is in 1080-wide post pixels, scaled by `u`.
 */
export const TikTokPost = forwardRef<View, Props>(function TikTokPost(
  { width, hook, layout, wallpaper, mixtape },
  ref
) {
  const u = width / 1080;
  const screenWidth = 676 * u;
  return (
    <View ref={ref} collapsable={false} style={[styles.post, { width, height: 1920 * u }]}>
      <Image
        source={wallpaper}
        style={[StyleSheet.absoluteFill, { transform: [{ scale: 1.2 }] }]}
        contentFit="cover"
        blurRadius={30}
      />
      <View style={[StyleSheet.absoluteFill, styles.veil]} />

      <View style={{ height: 342 * u, justifyContent: 'center', paddingHorizontal: 60 * u, paddingTop: 54 * u }}>
        {hook ? (
          <Text
            numberOfLines={2}
            adjustsFontSizeToFit
            style={[
              styles.hook,
              {
                fontSize: 86 * u,
                lineHeight: 90 * u,
                textShadowOffset: { width: 0, height: 3 * u },
                letterSpacing: -2.5 * u,
              },
            ]}>
            {hook}
          </Text>
        ) : null}
      </View>

      <View
        style={[
          styles.frame,
          { width: 720 * u, height: 1514 * u, borderRadius: 112 * u, padding: 22 * u, borderWidth: 4 * u },
        ]}>
        <View style={{ width: screenWidth, height: 1470 * u, borderRadius: 92 * u, overflow: 'hidden' }}>
          <HomeScreen
            width={screenWidth}
            height={1470 * u}
            wallpaper={wallpaper}
            layout={layout}
            mixtape={mixtape}
            statusBar
          />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  post: { overflow: 'hidden', alignItems: 'center', backgroundColor: '#f4c6ec' },
  veil: { backgroundColor: 'rgba(255,240,250,0.12)' },
  hook: {
    fontFamily: Geist.black,
    color: 'white',
    textAlign: 'center',
    textShadowColor: '#e0339a',
    textShadowRadius: 0,
  },
  frame: {
    backgroundColor: '#0b0b0d',
    borderColor: '#2c2c30',
    borderCurve: 'continuous',
    boxShadow: '0 24px 60px rgba(90, 20, 80, 0.35)',
  },
});
