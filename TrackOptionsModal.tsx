import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { X, Plus, Trash2, ListPlus, Disc3 } from 'lucide-react-native';
import { Colors } from '@/theme/colors';
import type { Playlist, Track } from '@/types/music';

interface TrackOptionsModalProps {
  visible: boolean;
  track: Track | null;
  playlists: Playlist[];
  onClose: () => void;
  onAddToPlaylist: (playlistId: string) => void;
  onCreatePlaylist: () => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function TrackOptionsModal({
  visible,
  track,
  playlists,
  onClose,
  onAddToPlaylist,
  onCreatePlaylist,
  onRemove,
  canRemove,
}: TrackOptionsModalProps) {
  if (!track) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTouch} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
              <Text style={styles.trackArtist} numberOfLines={1}>{track.artist}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={Colors.neutral[50]} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionLabel}>Add to playlist</Text>
          <ScrollView style={styles.playlistScroll} horizontal={false}>
            <TouchableOpacity style={styles.optionRow} onPress={onCreatePlaylist}>
              <View style={[styles.optionIcon, { backgroundColor: Colors.primary[500] }]}>
                <Plus size={18} color={Colors.neutral[0]} strokeWidth={2} />
              </View>
              <Text style={styles.optionText}>New playlist</Text>
            </TouchableOpacity>
            {playlists.length > 0 && (
              <View style={styles.playlistList}>
                {playlists.map(pl => (
                  <TouchableOpacity
                    key={pl.id}
                    style={styles.optionRow}
                    onPress={() => onAddToPlaylist(pl.id)}>
                    <View style={[styles.optionIcon, { backgroundColor: Colors.neutral[70] }]}>
                      <Disc3 size={18} color={Colors.neutral[0]} strokeWidth={2} />
                    </View>
                    <Text style={styles.optionText} numberOfLines={1}>{pl.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          {canRemove && (
            <TouchableOpacity style={[styles.optionRow, styles.removeRow]} onPress={onRemove}>
              <View style={[styles.optionIcon, { backgroundColor: Colors.error[500] }]}>
                <Trash2 size={18} color={Colors.neutral[0]} strokeWidth={2} />
              </View>
              <Text style={[styles.optionText, { color: Colors.error[400] }]}>Remove from library</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdropTouch: {
    flex: 1,
  },
  sheet: {
    backgroundColor: Colors.neutral[90],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: '70%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.neutral[70],
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 16,
    color: Colors.neutral[0],
  },
  trackArtist: {
    fontFamily: 'Manrope-Regular',
    fontSize: 13,
    color: Colors.neutral[50],
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionLabel: {
    fontFamily: 'Manrope-Medium',
    fontSize: 12,
    color: Colors.neutral[50],
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  playlistScroll: {
    flexGrow: 0,
  },
  playlistList: {
    gap: 0,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontFamily: 'Manrope-Medium',
    fontSize: 15,
    color: Colors.neutral[0],
    flex: 1,
  },
  removeRow: {
    marginTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: Colors.neutral[80],
    paddingTop: 16,
  },
});
