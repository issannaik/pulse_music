import { View, Text, StyleSheet, TouchableOpacity, Image, ViewStyle } from 'react-native';
import { Play, Pause, MoreVertical, Music } from 'lucide-react-native';
import { Colors } from '@/theme/colors';
import { formatTime } from '@/utils/format';
import type { Track } from '@/types/music';
import { useAudio } from '@/context/audio';

interface TrackRowProps {
  track: Track;
  queue?: Track[];
  index?: number;
  onMorePress?: (track: Track) => void;
  style?: ViewStyle;
}

export function TrackRow({ track, queue, index, onMorePress, style }: TrackRowProps) {
  const { currentTrack, isPlaying, loadTrack, togglePlayPause } = useAudio();
  const isCurrent = currentTrack?.id === track.id;
  const isCurrentPlaying = isCurrent && isPlaying;

  const handlePress = () => {
    if (isCurrent) {
      togglePlayPause();
    } else {
      loadTrack(track, queue, index);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.7}>
      <View style={styles.artwork}>
        {track.artwork ? (
          <Image source={{ uri: track.artwork }} style={styles.artworkImg} />
        ) : (
          <View style={styles.artworkPlaceholder}>
            <Music size={20} color={Colors.neutral[50]} strokeWidth={2} />
          </View>
        )}
        {isCurrent && (
          <View style={styles.playOverlay}>
            {isCurrentPlaying ? (
              <Pause size={16} color={Colors.neutral[0]} fill={Colors.neutral[0]} strokeWidth={2} />
            ) : (
              <Play size={16} color={Colors.neutral[0]} fill={Colors.neutral[0]} strokeWidth={2} />
            )}
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text
          style={[styles.title, isCurrent && styles.titleActive]}
          numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {track.artist}
        </Text>
      </View>
      <Text style={styles.duration}>{formatTime(track.duration)}</Text>
      {onMorePress && (
        <TouchableOpacity
          style={styles.moreBtn}
          onPress={() => onMorePress(track)}>
          <MoreVertical size={20} color={Colors.neutral[50]} strokeWidth={2} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 12,
  },
  artwork: {
    width: 48,
    height: 48,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  artworkImg: {
    width: '100%',
    height: '100%',
  },
  artworkPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: Colors.neutral[80],
    justifyContent: 'center',
    alignItems: 'center',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 15,
    color: Colors.neutral[0],
  },
  titleActive: {
    color: Colors.primary[400],
  },
  artist: {
    fontFamily: 'Manrope-Regular',
    fontSize: 13,
    color: Colors.neutral[50],
  },
  duration: {
    fontFamily: 'Manrope-Regular',
    fontSize: 13,
    color: Colors.neutral[50],
  },
  moreBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
