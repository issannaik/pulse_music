export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // seconds
  uri: string;
  artwork?: string;
  dateAdded: number;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  trackIds: string[];
  createdAt: number;
  artwork?: string;
}

export type RepeatMode = 'off' | 'all' | 'one';

export type PlayState = {
  isPlaying: boolean;
  currentTrack: Track | null;
  position: number;
  duration: number;
  queue: Track[];
  queueIndex: number;
  shuffle: boolean;
  repeat: RepeatMode;
  volume: number;
};
