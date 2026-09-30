import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Music, TrendingUp, Clock, Shuffle, Play } from 'lucide-react-native';
import { Colors } from '@/theme/colors';
import { useAudio } from '@/context/audio';
import { TrackRow } from '@/components/TrackRow';
import { MiniPlayer } from '@/components/MiniPlayer';
import { TrackOptionsModal } from '@/components/TrackOptionsModal';
import { CreatePlaylistModal } from '@/components/CreatePlaylistModal';
import { pickAudioFiles } from '@/utils/importMusic';
import { pluralize, formatTotalDuration } from '@/utils/format';
import type { Track } from '@/types/music';

export default function LibraryScreen() {
  const { tracks, importTracks, removeTrack, playlists, createPlaylist, addToPlaylist, loadTrack, toggleShuffle } = useAudio();
  const [optionsTrack, setOptionsTrack] = useState<Track | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [importing, setImporting] = useState(false);

  const totalDuration = tracks.reduce((sum, t) => sum + t.duration, 0);
  const recentlyAdded = [...tracks].sort((a, b) => b.dateAdded - a.dateAdded).slice(0, 5);

  const handleImport = async () => {
    setImporting(true);
    try {
      const newTracks = await pickAudioFiles();
      if (newTracks.length > 0) {
        importTracks(newTracks);
      }
    } catch {
      // ignore
    }
    setImporting(false);
  };

  const handleMorePress = (track: Track) => {
    setOptionsTrack(track);
    setShowOptions(true);
  };

  const handleRemove = () => {
    if (optionsTrack) {
      removeTrack(optionsTrack.id);
    }
    setShowOptions(false);
  };

  const handleAddToPlaylist = (playlistId: string) => {
    if (optionsTrack) {
      addToPlaylist(playlistId, optionsTrack.id);
    }
    setShowOptions(false);
  };

  const handlePlayAll = useCallback(() => {
    if (tracks.length === 0) return;
    loadTrack(tracks[0], tracks, 0);
  }, [tracks, loadTrack]);

  const handleShuffleAll = useCallback(() => {
    if (tracks.length === 0) return;
    toggleShuffle();
    loadTrack(tracks[0], tracks, 0);
  }, [tracks, loadTrack, toggleShuffle]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Music size={48} color={Colors.neutral[60]} strokeWidth={1.5} />
      </View>
      <Text style={styles.emptyTitle}>Your library is empty</Text>
      <Text style={styles.emptySubtitle}>
        Import audio files from your device to start listening
      </Text>
      <TouchableOpacity style={styles.importBtn} onPress={handleImport} disabled={importing}>
        <Plus size={20} color={Colors.neutral[0]} strokeWidth={2} />
        <Text style={styles.importBtnText}>Import Music</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <LinearGradient
        colors={[Colors.neutral[100], Colors.neutral[95]]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Library</Text>
          <TouchableOpacity style={styles.importHeaderBtn} onPress={handleImport} disabled={importing}>
            <Plus size={20} color={Colors.neutral[0]} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {tracks.length > 0 && (
          <>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: Colors.primary[500] }]}>
                  <Music size={18} color={Colors.neutral[0]} strokeWidth={2} />
                </View>
                <View>
                  <Text style={styles.statValue}>{pluralize(tracks.length, 'song')}</Text>
                  <Text style={styles.statLabel}>In library</Text>
                </View>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: Colors.accent[500] }]}>
                  <Clock size={18} color={Colors.neutral[0]} strokeWidth={2} />
                </View>
                <View>
                  <Text style={styles.statValue}>{formatTotalDuration(totalDuration)}</Text>
                  <Text style={styles.statLabel}>Total time</Text>
                </View>
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.playAllBtn} onPress={handlePlayAll}>
                <Play size={18} color={Colors.neutral[100]} fill={Colors.neutral[100]} strokeWidth={2} />
                <Text style={styles.playAllText}>Play All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shuffleBtn} onPress={handleShuffleAll}>
                <Shuffle size={18} color={Colors.neutral[0]} strokeWidth={2} />
                <Text style={styles.shuffleText}>Shuffle</Text>
              </TouchableOpacity>
            </View>

            {recentlyAdded.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <TrendingUp size={18} color={Colors.primary[400]} strokeWidth={2} />
                  <Text style={styles.sectionTitle}>Recently Added</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                  {recentlyAdded.map(track => (
                    <TouchableOpacity
                      key={track.id}
                      style={styles.recentCard}
                      onPress={() => loadTrack(track, tracks, tracks.findIndex(t => t.id === track.id))}>
                      <View style={styles.recentArtwork}>
                        {track.artwork ? (
                          <></>
                        ) : (
                          <View style={styles.recentArtworkPlaceholder}>
                            <Music size={24} color={Colors.neutral[50]} strokeWidth={2} />
                          </View>
                        )}
                      </View>
                      <Text style={styles.recentTitle} numberOfLines={1}>{track.title}</Text>
                      <Text style={styles.recentArtist} numberOfLines={1}>{track.artist}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitleLarge}>All Songs</Text>
              <FlatList
                data={tracks}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => (
                  <TrackRow
                    track={item}
                    queue={tracks}
                    index={index}
                    onMorePress={handleMorePress}
                  />
                )}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </View>
          </>
        )}

        {tracks.length === 0 && renderEmpty()}

        <View style={{ height: 120 }} />
      </ScrollView>

      <MiniPlayer />

      <TrackOptionsModal
        visible={showOptions}
        track={optionsTrack}
        playlists={playlists}
        onClose={() => setShowOptions(false)}
        onAddToPlaylist={handleAddToPlaylist}
        onCreatePlaylist={() => {
          setShowOptions(false);
          setShowCreate(true);
        }}
        onRemove={handleRemove}
        canRemove={true}
      />

      <CreatePlaylistModal
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={(name, desc) => {
          createPlaylist(name, desc, optionsTrack ? [optionsTrack.id] : []);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.neutral[100],
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  greeting: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 34,
    color: Colors.neutral[0],
    letterSpacing: -0.5,
  },
  importHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.neutral[90],
    borderRadius: 14,
    padding: 14,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 14,
    color: Colors.neutral[0],
  },
  statLabel: {
    fontFamily: 'Manrope-Regular',
    fontSize: 12,
    color: Colors.neutral[50],
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  playAllBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary[500],
    paddingVertical: 14,
    borderRadius: 14,
  },
  playAllText: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 15,
    color: Colors.neutral[100],
  },
  shuffleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.neutral[80],
    paddingVertical: 14,
    borderRadius: 14,
  },
  shuffleText: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 15,
    color: Colors.neutral[0],
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 16,
    color: Colors.neutral[0],
  },
  sectionTitleLarge: {
    fontFamily: 'Manrope-Bold',
    fontSize: 20,
    color: Colors.neutral[0],
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  horizontalScroll: {
    paddingLeft: 20,
  },
  recentCard: {
    width: 140,
    marginRight: 12,
  },
  recentArtwork: {
    width: 140,
    height: 140,
    borderRadius: 14,
    marginBottom: 8,
    overflow: 'hidden',
  },
  recentArtworkPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    backgroundColor: Colors.neutral[80],
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentTitle: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 13,
    color: Colors.neutral[0],
  },
  recentArtist: {
    fontFamily: 'Manrope-Regular',
    fontSize: 12,
    color: Colors.neutral[50],
    marginTop: 2,
  },
  separator: {
    height: 0.5,
    backgroundColor: Colors.neutral[80],
    marginHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: Colors.neutral[90],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 20,
    color: Colors.neutral[0],
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
    color: Colors.neutral[50],
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  importBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary[500],
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 16,
  },
  importBtnText: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 16,
    color: Colors.neutral[0],
  },
});
