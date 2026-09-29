import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="preview/[id]" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
        <Stack.Screen name="export/[id]" options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="edit/mixtape" options={{ presentation: 'modal' }} />
        <Stack.Screen name="edit/vibe" options={{ presentation: 'modal' }} />
        <Stack.Screen name="play" options={{ animation: 'none' }} />
      </Stack>
    </>
  );
}
