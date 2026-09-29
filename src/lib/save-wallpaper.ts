import { Asset as BundledAsset } from 'expo-asset';
import * as MediaLibrary from 'expo-media-library';
import type { ImageSourcePropType } from 'react-native';

/** Saves an image file to the Photos library. Only asks for add-only access. */
export async function saveImageToPhotos(fileUri: string) {
  const permission = await MediaLibrary.requestPermissionsAsync(true);
  if (!permission.granted) {
    throw new Error('Photos access was declined. You can allow it in Settings › Y2K Home › Photos.');
  }
  await MediaLibrary.Asset.create(fileUri);
}

/** Saves a bundled wallpaper to the Photos library. */
export async function saveWallpaperToPhotos(source: ImageSourcePropType) {
  const [file] = await BundledAsset.loadAsync(source as number);
  if (!file.localUri) throw new Error('Could not load the wallpaper file.');
  await saveImageToPhotos(file.localUri);
}
