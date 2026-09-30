import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

import { Geist } from '@/components/widgets/tokens';

/** On iOS the expo-font config plugin embeds Geist at build time; the web preview loads it here. */
const WEB_FONTS =
  Platform.OS === 'web'
    ? {
        [Geist.light]: require('@/assets/fonts/Geist-Light.ttf'),
        [Geist.regular]: require('@/assets/fonts/Geist-Regular.ttf'),
        [Geist.medium]: require('@/assets/fonts/Geist-Medium.ttf'),
        [Geist.semibold]: require('@/assets/fonts/Geist-SemiBold.ttf'),
        [Geist.bold]: require('@/assets/fonts/Geist-Bold.ttf'),
        [Geist.black]: require('@/assets/fonts/Geist-Black.ttf'),
      }
    : {};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(WEB_FONTS);
  if (!fontsLoaded && !fontError) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="preview/[id]" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
        <Stack.Screen name="export/[id]" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="icons/guide" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="icons/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="edit/mixtape" options={{ presentation: 'modal' }} />
        <Stack.Screen name="edit/vibe" options={{ presentation: 'modal' }} />
        <Stack.Screen name="play" options={{ animation: 'none' }} />
      </Stack>
    </>
  );
}
