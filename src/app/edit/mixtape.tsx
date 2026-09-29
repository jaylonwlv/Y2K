import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FormField } from '@/components/form-field';
import { PinkButton } from '@/components/pink-button';
import { WallpaperStage } from '@/components/wallpaper-stage';
import { MixtapePreview } from '@/components/widgets/mixtape-preview';
import { Geist } from '@/components/widgets/tokens';
import { getMixtape, isPlayableLink, saveMixtape, sharedImageUri, type PickedImage } from '@/lib/widget-bridge';

export default function EditMixtape() {
  const initial = getMixtape();
  const [title, setTitle] = useState(initial.title);
  const [subtitle, setSubtitle] = useState(initial.subtitle);
  const [link, setLink] = useState(initial.link);
  const [cover, setCover] = useState<PickedImage>();
  const [saving, setSaving] = useState(false);

  const coverUri = cover?.uri ?? (initial.cover ? sharedImageUri('mixtape-cover.jpg', initial.v) : undefined);

  async function pickCover() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    const asset = result.canceled ? undefined : result.assets[0];
    if (asset) setCover({ uri: asset.uri, width: asset.width, height: asset.height });
  }

  async function save() {
    const trimmed = link.trim();
    if (trimmed && !isPlayableLink(trimmed)) {
      Alert.alert('That link won’t open', 'Paste a share link from Spotify, Apple Music or YouTube (it starts with https://).');
      return;
    }
    setSaving(true);
    try {
      await saveMixtape({ title: title.trim(), subtitle: subtitle.trim(), link: trimmed }, cover);
      router.back();
    } catch (error) {
      Alert.alert('Could not save', error instanceof Error ? error.message : String(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardDismissMode="interactive"
      automaticallyAdjustKeyboardInsets>
      <Text style={styles.title}>Mixtape</Text>
      <WallpaperStage height={230}>
        <MixtapePreview size={184.4} title={title || ' '} subtitle={subtitle} coverUri={coverUri} />
      </WallpaperStage>
      <PinkButton label={coverUri ? 'Change cover' : 'Choose cover'} variant="secondary" onPress={pickCover} />

      <FormField label="Song title" value={title} onChangeText={setTitle} placeholder="Baby Tee Summer" maxLength={40} />
      <FormField label="Artist or caption" value={subtitle} onChangeText={setSubtitle} placeholder="y2k mixtape" maxLength={40} />
      <FormField
        label="Song link"
        value={link}
        onChangeText={setLink}
        placeholder="https://open.spotify.com/track/…"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        hint="In Spotify or Apple Music: Share › Copy Link, then paste it here. Tapping the widget opens it."
      />

      <View style={styles.actions}>
        <PinkButton label="Cancel" variant="secondary" onPress={() => router.back()} />
        <PinkButton label={saving ? 'Saving…' : 'Save'} onPress={save} disabled={saving} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FBEFF8' },
  content: { padding: 20, paddingBottom: 60, gap: 16 },
  title: { fontFamily: Geist.black, fontSize: 28, color: '#3B0E33' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
});
