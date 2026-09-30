import { Image } from 'expo-image';
import { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Geist } from '@/components/widgets/tokens';
import type { Theme } from '@/themes';

import { HomeScreen } from './home-screen';

type Props = {
  /** On-screen width; the post is always 9:16 and gets captured at 1080 × 1920. */
  width: number;
  theme: Theme;
  hook: string;
  layout: number;
  mixtape: { title: string; subtitle: string; coverUri?: string };
  /**
   * `frame`: hook line plus the home screen in a phone frame (home2.html's post mode).
   * `screen`: just the home screen, as big as fits. The full screen, top to bottom, fitted into
   * 9:16, with the blurred wallpaper filling the sides. Unlike a raw iPhone screenshot
   * (about 9:19.5), TikTok shows it without cropping the top and bottom.
   */
  mode?: 'frame' | 'screen';
};

/** 9:41 today, to match the status bar on the post: in the evening for Aero Night. */
function nineFortyOne(evening: boolean) {
  const d = new Date();
  d.setHours(evening ? 21 : 9, 41, 0, 0);
  return d;
}

/**
 * TikTok / Reels post from home2.html's "post" mode: a blurred backdrop, a hook line and the
 * home screen in a phone frame. Every size is in 1080-wide post pixels, scaled by `u`.
 */
export const TikTokPost = forwardRef<View, Props>(function TikTokPost(
  { width, theme, hook, layout, mixtape, mode = 'frame' },
  ref
) {
  const u = width / 1080;
  const screenWidth = 676 * u;
  // Y2K: hard pink edge. Aero: soft blue drop shadow. Night: neon glow.
  const shadow =
    theme.key === 'y2k'
      ? { textShadowOffset: { width: 0, height: 3 * u }, textShadowRadius: 0 }
      : theme.key === 'aero'
        ? { textShadowOffset: { width: 0, height: 4 * u }, textShadowRadius: 18 * u }
        : { textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 * u };

  return (
    <View
      ref={ref}
      testID="tiktok-post"
      collapsable={false}
      style={[styles.post, { width, height: 1920 * u, backgroundColor: theme.base }]}>
      <Image
        source={theme.wallpaper}
        style={[StyleSheet.absoluteFill, { transform: [{ scale: 1.2 }] }]}
        contentFit="cover"
        blurRadius={30}
      />
      <View style={[StyleSheet.absoluteFill, theme.key === 'night' ? styles.veilDark : styles.veil]} />

      {mode === 'screen' ? (
        <View style={styles.screenShadow}>
          <HomeScreen
            width={(1920 * u * 440) / 956}
            height={1920 * u}
            theme={theme.key}
            wallpaper={theme.wallpaper}
            layout={layout}
            mixtape={mixtape}
            date={nineFortyOne(theme.key === 'night')}
            statusBar
          />
        </View>
      ) : (
        <>
          <View style={{ height: 342 * u, justifyContent: 'center', paddingHorizontal: 60 * u, paddingTop: 54 * u }}>
            {hook ? (
              <Text
                numberOfLines={2}
                adjustsFontSizeToFit
                style={[
                  styles.hook,
                  theme.hookStyle,
                  shadow,
                  {
                    fontFamily: theme.key === 'y2k' ? Geist.black : Geist.bold,
                    fontSize: 84 * u,
                    lineHeight: 90 * u,
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
                theme={theme.key}
                wallpaper={theme.wallpaper}
                layout={layout}
                mixtape={mixtape}
                date={nineFortyOne(theme.key === 'night')}
                statusBar
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  post: { overflow: 'hidden', alignItems: 'center' },
  veil: { backgroundColor: 'rgba(255,255,255,0.1)' },
  veilDark: { backgroundColor: 'rgba(0,0,0,0.15)' },
  hook: { textAlign: 'center' },
  screenShadow: { boxShadow: '0 0 40px rgba(20, 20, 60, 0.35)' },
  frame: {
    backgroundColor: '#0b0b0d',
    borderColor: '#2c2c30',
    borderCurve: 'continuous',
    boxShadow: '0 24px 60px rgba(20, 20, 60, 0.35)',
  },
});
