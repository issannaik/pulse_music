import { createContext, useContext } from 'react';
import type { Playlist, Track, RepeatMode } from '@/types/music';

export interface AudioContextValue {
  tracks: Track[];
  playlists: Playlist[];
  currentTrack: Track | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  queue: Track[];
  queueIndex: number;
  shuffle: boolean;
  repeat: RepeatMode;
  volume: number;
  loadTrack: (track: Track, queue?: Track[], index?: number) => void;
  togglePlayPause: () => void;
  seekTo: (seconds: number) => void;
  skipNext: () => void;
  skipPrevious: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setVolume: (v: number) => void;
  importTracks: (newTracks: Track[]) => void;
  removeTrack: (id: string) => void;
  createPlaylist: (name: string, description: string, trackIds: string[]) => void;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (playlistId: string, trackId: string) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
}

export const AudioContext = createContext<AudioContextValue | null>(null);

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}
