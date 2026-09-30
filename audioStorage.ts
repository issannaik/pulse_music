import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Playlist, Track } from '@/types/music';

const TRACKS_KEY = 'pulse_tracks';
const PLAYLISTS_KEY = 'pulse_playlists';

export async function loadTracks(): Promise<Track[]> {
  try {
    const raw = await AsyncStorage.getItem(TRACKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveTracks(tracks: Track[]): Promise<void> {
  try {
    await AsyncStorage.setItem(TRACKS_KEY, JSON.stringify(tracks));
  } catch {
    // ignore
  }
}

export async function loadPlaylists(): Promise<Playlist[]> {
  try {
    const raw = await AsyncStorage.getItem(PLAYLISTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function savePlaylists(playlists: Playlist[]): Promise<void> {
  try {
    await AsyncStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
  } catch {
    // ignore
  }
}
