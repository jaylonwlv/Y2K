import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Linking } from 'react-native';

import { isPlayableLink } from '@/lib/widget-bridge';

/**
 * Opened by the Mixtape widget (y2khome://play?url=…). Widgets can only open their own app,
 * so we bounce straight on to the song link in Spotify / Apple Music / YouTube.
 */
export default function Play() {
  const { url } = useLocalSearchParams<{ url?: string }>();

  useEffect(() => {
    if (url && isPlayableLink(url)) Linking.openURL(url).catch(() => {});
    router.replace('/');
  }, [url]);

  return null;
}
