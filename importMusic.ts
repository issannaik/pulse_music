import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import type { Track } from '@/types/music';

export async function pickAudioFiles(): Promise<Track[]> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'audio/*',
    multiple: true,
    copyToCacheDirectory: true,
  });

  if (result.canceled || !result.assets) return [];

  const tracks: Track[] = [];
  for (const asset of result.assets) {
    let duration = 0;
    try {
      const status = await Audio.Sound.createAsync(
        { uri: asset.uri },
        { shouldPlay: false, isLooping: false, isMuted: true },
      );
      const meta = await status.sound.getStatusAsync();
      if (meta.isLoaded) {
        duration = (meta.durationMillis ?? 0) / 1000;
      }
      await status.sound.unloadAsync();
    } catch {
      // continue
    }

    const name = asset.name?.replace(/\.[^/.]+$/, '') ?? 'Unknown Track';
    const parts = name.split(/\s*-\s*/);
    const title = parts.length > 1 ? parts[parts.length - 1].trim() : name.trim();
    const artist = parts.length > 1 ? parts.slice(0, -1).join(' - ').trim() : 'Unknown Artist';

    const cachedUri = asset.uri;
    tracks.push({
      id: `tr_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
      title,
      artist,
      album: 'Imported',
      duration,
      uri: cachedUri,
      dateAdded: Date.now(),
    });
  }
  return tracks;
}
