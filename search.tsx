import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search as SearchIcon, X, Music } from 'lucide-react-native';
import { Colors } from '@/theme/colors';
import { useAudio } from '@/context/audio';
import { TrackRow } from '@/components/TrackRow';
import { MiniPlayer } from '@/components/MiniPlayer';
import { TrackOptionsModal } from '@/components/TrackOptionsModal';
import { CreatePlaylistModal } from '@/components/CreatePlaylistModal';
import type { Track } from '@/types/music';

export default function SearchScreen() {
  const { tracks, playlists, addToPlaylist, removeTrack, createPlaylist } = useAudio();
  const [query, setQuery] = useState('');
  const [optionsTrack, setOptionsTrack] = useState<Track | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return tracks.filter(
      t =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q)
    );
  }, [query, tracks]);

  const handleMorePress = (track: Track) => {
    setOptionsTrack(track);
    setShowOptions(true);
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <LinearGradient colors={[Colors.neutral[100], Colors.neutral[95]]} style={StyleSheet.absoluteFill} />
      <View style={styles.container}>
        <Text style={styles.title}>Search</Text>
        <View style={styles.searchBar}>
          <SearchIcon size={20} color={Colors.neutral[50]} strokeWidth={2} />
          <TextInput
            style={styles.input}
            placeholder="Songs, artists, albums"
            placeholderTextColor={Colors.neutral[50]}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X size={18} color={Colors.neutral[50]} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>

        {query.trim() === '' ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <SearchIcon size={40} color={Colors.neutral[60]} strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>Find your music</Text>
            <Text style={styles.emptySubtitle}>Search by song title, artist, or album name</Text>
          </View>
        ) : results.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Music size={40} color={Colors.neutral[60]} strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptySubtitle}>Try a different search term</Text>
          </View>
        ) : (
          <>
            <Text style={styles.resultCount}>{results.length} result{results.length !== 1 ? 's' : ''}</Text>
            <FlatList
              data={results}
              keyExtractor={item => item.id}
              renderItem={({ item, index }) => (
                <TrackRow
                  track={item}
                  queue={results}
                  index={index}
                  onMorePress={handleMorePress}
                />
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              contentContainerStyle={{ paddingBottom: 120 }}
            />
          </>
        )}
      </View>

      <MiniPlayer />

      <TrackOptionsModal
        visible={showOptions}
        track={optionsTrack}
        playlists={playlists}
        onClose={() => setShowOptions(false)}
        onAddToPlaylist={(plId) => {
          if (optionsTrack) addToPlaylist(plId, optionsTrack.id);
          setShowOptions(false);
        }}
        onCreatePlaylist={() => {
          setShowOptions(false);
          setShowCreate(true);
        }}
        onRemove={() => {
          if (optionsTrack) removeTrack(optionsTrack.id);
          setShowOptions(false);
        }}
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
  screen: { flex: 1, backgroundColor: Colors.neutral[100] },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  title: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 34,
    color: Colors.neutral[0],
    letterSpacing: -0.5,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.neutral[90],
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
    color: Colors.neutral[0],
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  emptyIcon: {
    width: 80,
    height: 80,
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
    marginBottom: 6,
  },
  emptySubtitle: {
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    color: Colors.neutral[50],
    textAlign: 'center',
  },
  resultCount: {
    fontFamily: 'Manrope-Medium',
    fontSize: 13,
    color: Colors.neutral[50],
    marginBottom: 8,
  },
  separator: {
    height: 0.5,
    backgroundColor: Colors.neutral[80],
    marginHorizontal: 16,
  },
});
