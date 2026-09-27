import { Asset as BundledAsset } from 'expo-asset';
import * as MediaLibrary from 'expo-media-library';
import type { ImageSourcePropType } from 'react-native';

/** Saves a bundled wallpaper to the Photos library. Only asks for add-only access. */
export async function saveWallpaperToPhotos(source: ImageSourcePropType) {
  const permission = await MediaLibrary.requestPermissionsAsync(true);
  if (!permission.granted) {
    throw new Error('Photos access was declined. You can allow it in Settings › Y2K Home › Photos.');
  }
  const [file] = await BundledAsset.loadAsync(source as number);
  if (!file.localUri) throw new Error('Could not load the wallpaper file.');
  await MediaLibrary.Asset.create(file.localUri);
}
