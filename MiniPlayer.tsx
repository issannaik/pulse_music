import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Play, Pause, SkipForward, Music } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAudio } from '@/context/audio';
import { Colors } from '@/theme/colors';
import { formatTime } from '@/utils/format';
import { useRouter } from 'expo-router';

export function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlayPause, skipNext, position, duration } = useAudio();
  const router = useRouter();

  if (!currentTrack) return null;

  const progress = duration > 0 ? position / duration : 0;

  return (
    <TouchableOpacity
      style={styles.wrapper}
      activeOpacity={0.9}
      onPress={() => router.push('/now-playing')}>
      <LinearGradient
        colors={[Colors.neutral[90], Colors.neutral[80]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}>
        <View style={styles.artwork}>
          {currentTrack.artwork ? (
            <Image source={{ uri: currentTrack.artwork }} style={styles.artworkImg} />
          ) : (
            <View style={styles.artworkPlaceholder}>
              <Music size={20} color={Colors.neutral[50]} strokeWidth={2} />
            </View>
          )}
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.artist}
          </Text>
          <View style={styles.progressRow}>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={styles.time}>{formatTime(position)}</Text>
          </View>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity onPress={togglePlayPause} style={styles.playBtn}>
            {isPlaying ? (
              <Pause size={22} color={Colors.neutral[0]} fill={Colors.neutral[0]} strokeWidth={2} />
            ) : (
              <Play size={22} color={Colors.neutral[0]} fill={Colors.neutral[0]} strokeWidth={2} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={skipNext} style={styles.skipBtn}>
            <SkipForward size={20} color={Colors.neutral[50]} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 70,
    left: 12,
    right: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 12,
  },
  artwork: {
    width: 48,
    height: 48,
    borderRadius: 10,
    overflow: 'hidden',
  },
  artworkImg: {
    width: '100%',
    height: '100%',
  },
  artworkPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: Colors.neutral[70],
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 14,
    color: Colors.neutral[0],
  },
  artist: {
    fontFamily: 'Manrope-Regular',
    fontSize: 12,
    color: Colors.neutral[50],
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  progressBg: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.neutral[70],
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[400],
    borderRadius: 2,
  },
  time: {
    fontFamily: 'Manrope-Regular',
    fontSize: 10,
    color: Colors.neutral[50],
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
