import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

/** The Y2K wallpaper behind a widget preview, so the glass reads the way it does on the home screen. */
export function WallpaperStage({ height, children }: { height: number; children: ReactNode }) {
  return (
    <View style={[styles.stage, { height }]}>
      <Image
        source={require('@/assets/wallpapers/y2k-pink-chrome.png')}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        contentPosition="center"
      />
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
