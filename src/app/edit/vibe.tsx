import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FormField } from '@/components/form-field';
import { PinkButton } from '@/components/pink-button';
import { WallpaperStage } from '@/components/wallpaper-stage';
import { Geist } from '@/components/widgets/tokens';
import { VibePreview } from '@/components/widgets/vibe-preview';
import { getVibe, getWidgetTheme, saveVibe, sharedImageUri, type PickedImage } from '@/lib/widget-bridge';
import { getThemeByKey } from '@/themes';

export default function EditVibe() {
  const initial = getVibe();
  const [caption, setCaption] = useState(initial.caption);
  const [subcaption, setSubcaption] = useState(initial.subcaption);
  const [photo, setPhoto] = useState<PickedImage>();
  const [saving, setSaving] = useState(false);
  const theme = getWidgetTheme();

  const photoUri = photo?.uri ?? (initial.photo ? sharedImageUri('vibe-photo.jpg', initial.v) : undefined);

  async function pickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1 });
    const asset = result.canceled ? undefined : result.assets[0];
    if (asset) setPhoto({ uri: asset.uri, width: asset.width, height: asset.height });
  }

  async function save() {
    setSaving(true);
    try {
      await saveVibe({ caption: caption.trim(), subcaption: subcaption.trim() }, photo);
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
      <Text style={styles.title}>Vibe Card</Text>
      <WallpaperStage height={230} wallpaper={getThemeByKey(theme).wallpaper}>
        <VibePreview
          theme={theme}
          width={184.4}
          height={184.4}
          caption={caption}
          subcaption={subcaption}
          photoUri={photoUri}
        />
      </WallpaperStage>
      <PinkButton label={photoUri ? 'Change photo' : 'Choose photo'} variant="secondary" onPress={pickPhoto} />

      <FormField
        label="Caption"
        value={caption}
        onChangeText={setCaption}
        placeholder="main character era"
        maxLength={32}
      />
      <FormField
        label="Small text"
        value={subcaption}
        onChangeText={setSubcaption}
        placeholder="✧ optional"
        maxLength={40}
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
