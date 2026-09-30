import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Disc3, Trash2, Play, Shuffle } from 'lucide-react-native';
import { Colors } from '@/theme/colors';
import { useAudio } from '@/context/audio';
import { MiniPlayer } from '@/components/MiniPlayer';
import { CreatePlaylistModal } from '@/components/CreatePlaylistModal';
import { TrackRow } from '@/components/TrackRow';
import { pluralize, formatTotalDuration } from '@/utils/format';
import type { Playlist } from '@/types/music';

export default function PlaylistsScreen() {
  const { playlists, tracks, createPlaylist, deletePlaylist, loadTrack, toggleShuffle } = useAudio();
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  const getPlaylistTracks = (pl: Playlist) => {
    return pl.trackIds
      .map(id => tracks.find(t => t.id === id))
      .filter((t): t is NonNullable<typeof t> => t !== undefined);
  };

  const handleCreate = (name: string, description: string) => {
    createPlaylist(name, description, []);
  };

  const handlePlayPlaylist = (pl: Playlist) => {
    const plTracks = getPlaylistTracks(pl);
    if (plTracks.length === 0) return;
    loadTrack(plTracks[0], plTracks, 0);
  };

  const handleShufflePlaylist = (pl: Playlist) => {
    const plTracks = getPlaylistTracks(pl);
    if (plTracks.length === 0) return;
    toggleShuffle();
    loadTrack(plTracks[0], plTracks, 0);
  };

  if (selectedPlaylist) {
    const plTracks = getPlaylistTracks(selectedPlaylist);
    const totalDuration = plTracks.reduce((sum, t) => sum + t.duration, 0);

    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <LinearGradient colors={[Colors.neutral[100], Colors.neutral[95]]} style={StyleSheet.absoluteFill} />
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.detailHeader}>
            <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedPlaylist(null)}>
              <Text style={styles.backText}>Playlists</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => {
                deletePlaylist(selectedPlaylist.id);
                setSelectedPlaylist(null);
              }}>
              <Trash2 size={18} color={Colors.error[400]} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={styles.detailArtwork}>
            <LinearGradient
              colors={[Colors.primary[600], Colors.accent[500]]}
              style={styles.detailArtworkGradient}>
              <Disc3 size={56} color={Colors.neutral[0]} strokeWidth={1.5} />
            </LinearGradient>
          </View>
          <Text style={styles.detailName}>{selectedPlaylist.name}</Text>
          {selectedPlaylist.description ? (
            <Text style={styles.detailDesc}>{selectedPlaylist.description}</Text>
          ) : null}
          <Text style={styles.detailMeta}>
            {pluralize(plTracks.length, 'song')} • {formatTotalDuration(totalDuration)}
          </Text>

          {plTracks.length > 0 && (
            <View style={styles.detailActions}>
              <TouchableOpacity style={styles.playBtn} onPress={() => handlePlayPlaylist(selectedPlaylist)}>
                <Play size={18} color={Colors.neutral[100]} fill={Colors.neutral[100]} strokeWidth={2} />
                <Text style={styles.playBtnText}>Play</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shuffleBtn} onPress={() => handleShufflePlaylist(selectedPlaylist)}>
                <Shuffle size={18} color={Colors.neutral[0]} strokeWidth={2} />
                <Text style={styles.shuffleBtnText}>Shuffle</Text>
              </TouchableOpacity>
            </View>
          )}

          {plTracks.length > 0 ? (
            <View style={styles.trackList}>
              {plTracks.map((track, index) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  queue={plTracks}
                  index={index}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyPlaylist}>
              <Text style={styles.emptyPlaylistText}>This playlist is empty</Text>
              <Text style={styles.emptyPlaylistSub}>
                Add songs from your library by tapping the menu icon on any track
              </Text>
            </View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>
        <MiniPlayer />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <LinearGradient colors={[Colors.neutral[100], Colors.neutral[95]]} style={StyleSheet.absoluteFill} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Playlists</Text>
          <TouchableOpacity style={styles.createBtn} onPress={() => setShowCreate(true)}>
            <Plus size={22} color={Colors.neutral[0]} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {playlists.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Disc3 size={44} color={Colors.neutral[60]} strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>No playlists yet</Text>
            <Text style={styles.emptySubtitle}>
              Create a playlist to organize your favorite songs
            </Text>
            <TouchableOpacity style={styles.createCta} onPress={() => setShowCreate(true)}>
              <Plus size={20} color={Colors.neutral[0]} strokeWidth={2} />
              <Text style={styles.createCtaText}>Create Playlist</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={playlists}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              const plTracks = getPlaylistTracks(item);
              return (
                <TouchableOpacity
                  style={styles.playlistCard}
                  onPress={() => setSelectedPlaylist(item)}
                  activeOpacity={0.7}>
                  <LinearGradient
                    colors={[Colors.primary[600], Colors.accent[500]]}
                    style={styles.playlistArtwork}>
                    <Disc3 size={28} color={Colors.neutral[0]} strokeWidth={1.5} />
                  </LinearGradient>
                  <View style={styles.playlistInfo}>
                    <Text style={styles.playlistName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.playlistMeta}>
                      {pluralize(plTracks.length, 'song')}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={{ paddingBottom: 120 }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>

      <MiniPlayer />

      <CreatePlaylistModal
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.neutral[100] },
  scrollView: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 34,
    color: Colors.neutral[0],
    letterSpacing: -0.5,
  },
  createBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: Colors.neutral[90],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 18,
    color: Colors.neutral[0],
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    color: Colors.neutral[50],
    textAlign: 'center',
    marginBottom: 28,
  },
  createCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary[500],
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
  },
  createCtaText: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 15,
    color: Colors.neutral[0],
  },
  playlistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 10,
  },
  playlistArtwork: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistInfo: { flex: 1 },
  playlistName: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 16,
    color: Colors.neutral[0],
  },
  playlistMeta: {
    fontFamily: 'Manrope-Regular',
    fontSize: 13,
    color: Colors.neutral[50],
    marginTop: 3,
  },
  separator: {
    height: 0.5,
    backgroundColor: Colors.neutral[80],
  },
  // Detail view
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  backBtn: {
    paddingVertical: 6,
    paddingRight: 12,
  },
  backText: {
    fontFamily: 'Manrope-Medium',
    fontSize: 15,
    color: Colors.primary[400],
  },
  deleteBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailArtwork: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  detailArtworkGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailName: {
    fontFamily: 'Manrope-Bold',
    fontSize: 24,
    color: Colors.neutral[0],
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  detailDesc: {
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    color: Colors.neutral[50],
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 6,
  },
  detailMeta: {
    fontFamily: 'Manrope-Medium',
    fontSize: 13,
    color: Colors.neutral[50],
    textAlign: 'center',
    marginTop: 8,
  },
  detailActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 28,
  },
  playBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary[500],
    paddingVertical: 14,
    borderRadius: 14,
  },
  playBtnText: {
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
  shuffleBtnText: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 15,
    color: Colors.neutral[0],
  },
  trackList: {
    paddingBottom: 20,
  },
  emptyPlaylist: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  emptyPlaylistText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 16,
    color: Colors.neutral[0],
    marginBottom: 8,
  },
  emptyPlaylistSub: {
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    color: Colors.neutral[50],
    textAlign: 'center',
    lineHeight: 20,
  },
});
