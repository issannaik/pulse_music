import { useEffect, useRef, useState, useCallback } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { AudioContext, AudioContextValue } from './audio';
import type { Playlist, RepeatMode, Track } from '@/types/music';
import { loadTracks, saveTracks, loadPlaylists, savePlaylists } from '@/storage/audioStorage';

Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  staysActiveInBackground: true,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  playThroughEarpieceAndroid: false,
});

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState<Track[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>('off');
  const [volume, setVol] = useState(1);
  const soundRef = useRef<Audio.Sound | null>(null);


  useEffect(() => {
    (async () => {
      const t = await loadTracks();
      const p = await loadPlaylists();
      setTracks(t);
      setPlaylists(p);
    })();
  }, []);

  const unloadCurrent = useCallback(async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.unloadAsync();
      } catch {
        // ignore
      }
      soundRef.current = null;
    }
  }, []);

  const playTrack = useCallback(async (track: Track, newQueue?: Track[], index?: number) => {
    await unloadCurrent();
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.uri },
        { volume, shouldPlay: true, isLooping: false, progressUpdateIntervalMillis: 500 },
        (status: AVPlaybackStatus) => {
          if (!status.isLoaded) return;
          setPosition(status.positionMillis / 1000);
          setDuration((status.durationMillis ?? 0) / 1000);
          if (status.didJustFinish) {
            handleTrackEnd();
          }
        }
      );
      soundRef.current = sound;
      setCurrentTrack(track);
      setIsPlaying(true);
      if (newQueue) {
        setQueue(newQueue);
        setQueueIndex(index ?? 0);
      }
    } catch (e) {
      console.warn('Failed to load track', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume, unloadCurrent]);

  const handleTrackEnd = useCallback(async () => {
    // handled via skip logic
    setRepeat(prev => {
      if (prev === 'one') {
        seekTo(0);
        return prev;
      }
      return prev;
    });
    skipNextInternal();
  }, []);

  const skipNextInternal = useCallback(() => {
    setQueue(prevQueue => {
      setQueueIndex(prevIdx => {
        if (prevQueue.length === 0) return prevIdx;
        if (shuffle) {
          if (prevQueue.length === 1) {
            if (repeat === 'off') {
              setIsPlaying(false);
              return prevIdx;
            }
            const t = prevQueue[prevIdx];
            if (t) playTrack(t);
            return prevIdx;
          }
          let nextIdx = Math.floor(Math.random() * prevQueue.length);
          if (nextIdx === prevIdx) nextIdx = (nextIdx + 1) % prevQueue.length;
          const t = prevQueue[nextIdx];
          if (t) playTrack(t);
          return nextIdx;
        }
        if (prevIdx + 1 < prevQueue.length) {
          const t = prevQueue[prevIdx + 1];
          if (t) playTrack(t);
          return prevIdx + 1;
        }
        if (repeat === 'all') {
          const t = prevQueue[0];
          if (t) playTrack(t);
          return 0;
        }
        setIsPlaying(false);
        return prevIdx;
      });
      return prevQueue;
    });
  }, [shuffle, repeat, playTrack]);

  const loadTrack = useCallback((track: Track, q?: Track[], index?: number) => {
    playTrack(track, q ?? [track], index ?? 0);
  }, [playTrack]);

  const togglePlayPause = useCallback(async () => {
    if (!soundRef.current) return;
    try {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch {
      // ignore
    }
  }, [isPlaying]);

  const seekTo = useCallback(async (seconds: number) => {
    if (!soundRef.current) return;
    try {
      await soundRef.current.setPositionAsync(seconds * 1000);
      setPosition(seconds);
    } catch {
      // ignore
    }
  }, []);

  const skipNext = useCallback(() => {
    skipNextInternal();
  }, [skipNextInternal]);

  const skipPrevious = useCallback(async () => {
    if (position > 3) {
      seekTo(0);
      return;
    }
    setQueue(prevQueue => {
      setQueueIndex(prevIdx => {
        if (prevQueue.length === 0) return prevIdx;
        const prev = prevIdx - 1;
        if (prev >= 0) {
          const t = prevQueue[prev];
          if (t) playTrack(t);
          return prev;
        }
        if (repeat === 'all') {
          const t = prevQueue[prevQueue.length - 1];
          if (t) playTrack(t);
          return prevQueue.length - 1;
        }
        seekTo(0);
        return prevIdx;
      });
      return prevQueue;
    });
  }, [position, repeat, playTrack, seekTo]);

  const toggleShuffle = useCallback(() => setShuffle(s => !s), []);

  const cycleRepeat = useCallback(() => {
    setRepeat(r => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'));
  }, []);

  const setVolume = useCallback(async (v: number) => {
    setVol(v);
    if (soundRef.current) {
      try {
        await soundRef.current.setVolumeAsync(v);
      } catch {
        // ignore
      }
    }
  }, []);

  const importTracks = useCallback((newTracks: Track[]) => {
    setTracks(prev => {
      const existing = new Set(prev.map(t => t.id));
      const filtered = newTracks.filter(t => !existing.has(t.id));
      const updated = [...prev, ...filtered];
      saveTracks(updated);
      return updated;
    });
  }, []);

  const removeTrack = useCallback((id: string) => {
    setTracks(prev => {
      const updated = prev.filter(t => t.id !== id);
      saveTracks(updated);
      return updated;
    });
    setPlaylists(prev => {
      const updated = prev.map(p => ({ ...p, trackIds: p.trackIds.filter(tid => tid !== id) }));
      savePlaylists(updated);
      return updated;
    });
  }, []);

  const createPlaylist = useCallback((name: string, description: string, trackIds: string[]) => {
    const playlist: Playlist = {
      id: `pl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      description,
      trackIds,
      createdAt: Date.now(),
    };
    setPlaylists(prev => {
      const updated = [playlist, ...prev];
      savePlaylists(updated);
      return updated;
    });
  }, []);

  const deletePlaylist = useCallback((id: string) => {
    setPlaylists(prev => {
      const updated = prev.filter(p => p.id !== id);
      savePlaylists(updated);
      return updated;
    });
  }, []);

  const addToPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists(prev => {
      const updated = prev.map(p => {
        if (p.id !== playlistId) return p;
        if (p.trackIds.includes(trackId)) return p;
        return { ...p, trackIds: [...p.trackIds, trackId] };
      });
      savePlaylists(updated);
      return updated;
    });
  }, []);

  const removeFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setPlaylists(prev => {
      const updated = prev.map(p => {
        if (p.id !== playlistId) return p;
        return { ...p, trackIds: p.trackIds.filter(tid => tid !== trackId) };
      });
      savePlaylists(updated);
      return updated;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const value: AudioContextValue = {
    tracks,
    playlists,
    currentTrack,
    isPlaying,
    position,
    duration,
    queue,
    queueIndex,
    shuffle,
    repeat,
    volume,
    loadTrack,
    togglePlayPause,
    seekTo,
    skipNext,
    skipPrevious,
    toggleShuffle,
    cycleRepeat,
    setVolume,
    importTracks,
    removeTrack,
    createPlaylist,
    deletePlaylist,
    addToPlaylist,
    removeFromPlaylist,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}
