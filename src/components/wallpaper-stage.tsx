import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';

/** A theme's wallpaper behind a widget preview, so the glass reads the way it does on the home screen. */
export function WallpaperStage({
  height,
  wallpaper = require('@/assets/wallpapers/y2k-pink-chrome.png'),
  children,
}: {
  height: number;
  wallpaper?: ImageSourcePropType;
  children: ReactNode;
}) {
  return (
    <View style={[styles.stage, { height }]}>
      <Image source={wallpaper} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="center" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    borderRadius: 28,
    borderCurve: 'continuous',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
