import type { ImageSourcePropType } from 'react-native';

// Saving to the Photos library only exists on iOS. The web build is only used for quick previews.

export async function saveImageToPhotos(_fileUri: string): Promise<void> {
  throw new Error('Saving to Photos is only available in the iOS app.');
}

export async function saveWallpaperToPhotos(_source: ImageSourcePropType): Promise<void> {
  throw new Error('Saving to Photos is only available in the iOS app.');
}
