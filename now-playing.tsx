import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useRef } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Repeat1,
  ChevronDown,
  Music,
  Volume2,
  Heart,
  List,
} from 'lucide-react-native';
import { Colors } from '@/theme/colors';
import { useAudio } from '@/context/audio';
import { formatTime } from '@/utils/format';
import { useRouter } from 'expo-router';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function NowPlayingScreen() {
  const {
    currentTrack,
    isPlaying,
    position,
    duration,
    togglePlayPause,
    seekTo,
    skipNext,
    skipPrevious,
    shuffle,
    repeat,
    toggleShuffle,
    cycleRepeat,
    volume,
    setVolume,
  } = useAudio();
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const seekVal = useRef(0);

  if (!currentTrack) {
    return (
      <SafeAreaView style={styles.screen} edges={['top']}>
        <LinearGradient colors={[Colors.neutral[100], Colors.neutral[95]]} style={StyleSheet.absoluteFill} />
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Music size={48} color={Colors.neutral[60]} strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyTitle}>Nothing playing</Text>
          <Text style={styles.emptySubtitle}>Select a song from your library to start listening</Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => router.push('/')}>
            <Text style={styles.browseBtnText}>Browse Library</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const progress = duration > 0 ? position / duration : 0;
  const isRepeatOff = repeat === 'off';
  const isRepeatOne = repeat === 'one';

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <LinearGradient
        colors={[Colors.neutral[90], Colors.neutral[100]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <ChevronDown size={26} color={Colors.neutral[0]} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.topLabel}>Now Playing</Text>
          <TouchableOpacity style={styles.listBtn}>
            <List size={22} color={Colors.neutral[40]} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.artworkContainer}>
          {currentTrack.artwork ? (
            <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />
          ) : (
            <LinearGradient
              colors={[Colors.primary[600], Colors.accent[500]]}
              style={styles.artworkPlaceholder}>
              <Music size={80} color={Colors.neutral[0]} strokeWidth={1} />
            </LinearGradient>
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <View style={styles.titleInfo}>
              <Text style={styles.trackTitle} numberOfLines={2}>{currentTrack.title}</Text>
              <Text style={styles.trackArtist} numberOfLines={1}>{currentTrack.artist}</Text>
            </View>
            <TouchableOpacity onPress={() => setLiked(!liked)} style={styles.likeBtn}>
              <Heart
                size={24}
                color={liked ? Colors.error[400] : Colors.neutral[40]}
                fill={liked ? Colors.error[400] : 'transparent'}
                strokeWidth={2}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.progressSection}>
          <TouchableOpacity
            style={styles.progressTrack}
            activeOpacity={1}
            onPressIn={(e) => {
              setSeeking(true);
              const ratio = e.nativeEvent.locationX / (SCREEN_WIDTH - 40);
              seekVal.current = Math.max(0, Math.min(1, ratio)) * duration;
            }}
            onPressOut={() => {
              seekTo(seekVal.current);
              setSeeking(false);
            }}>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]}>
                <View style={styles.progressThumb} />
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>-{formatTime(duration - position)}</Text>
          </View>
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[styles.controlSide, shuffle && styles.controlActive]}
            onPress={toggleShuffle}>
            <Shuffle
              size={22}
              color={shuffle ? Colors.primary[400] : Colors.neutral[40]}
              strokeWidth={2}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlMid} onPress={skipPrevious}>
            <SkipBack size={32} color={Colors.neutral[0]} fill={Colors.neutral[0]} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.playBtn} onPress={togglePlayPause}>
            {isPlaying ? (
              <Pause size={32} color={Colors.neutral[100]} fill={Colors.neutral[100]} strokeWidth={2} />
            ) : (
              <Play size={32} color={Colors.neutral[100]} fill={Colors.neutral[100]} strokeWidth={2} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlMid} onPress={skipNext}>
            <SkipForward size={32} color={Colors.neutral[0]} fill={Colors.neutral[0]} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlSide, !isRepeatOff && styles.controlActive]}
            onPress={cycleRepeat}>
            {isRepeatOne ? (
              <Repeat1 size={22} color={Colors.primary[400]} strokeWidth={2} />
            ) : (
              <Repeat size={22} color={!isRepeatOff ? Colors.primary[400] : Colors.neutral[40]} strokeWidth={2} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.volumeSection}>
          <Volume2 size={18} color={Colors.neutral[40]} strokeWidth={2} />
          <View style={styles.volumeBar}>
            <View style={[styles.volumeFill, { width: `${volume * 100}%` }]} />
          </View>
          <TouchableOpacity
            style={styles.volStepBtn}
            onPress={() => setVolume(Math.max(0, volume - 0.1))}>
            <Text style={styles.volStepText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.volStepBtn}
            onPress={() => setVolume(Math.min(1, volume + 0.1))}>
            <Text style={styles.volStepText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.neutral[100] },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  closeBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topLabel: {
    fontFamily: 'Manrope-Medium',
    fontSize: 13,
    color: Colors.neutral[40],
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  listBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artworkContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 12,
  },
  artwork: {
    width: SCREEN_WIDTH - 80,
    height: SCREEN_WIDTH - 80,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  artworkPlaceholder: {
    width: SCREEN_WIDTH - 80,
    height: SCREEN_WIDTH - 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  infoSection: {
    marginBottom: 28,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  titleInfo: {
    flex: 1,
  },
  trackTitle: {
    fontFamily: 'Manrope-Bold',
    fontSize: 22,
    color: Colors.neutral[0],
    lineHeight: 28,
  },
  trackArtist: {
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
    color: Colors.neutral[40],
    marginTop: 4,
  },
  likeBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSection: {
    marginBottom: 28,
  },
  progressTrack: {
    width: '100%',
    height: 24,
    justifyContent: 'center',
  },
  progressBg: {
    width: '100%',
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.neutral[80],
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.primary[400],
  },
  progressThumb: {
    position: 'absolute',
    right: -7,
    top: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.neutral[0],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    fontFamily: 'Manrope-Regular',
    fontSize: 12,
    color: Colors.neutral[40],
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  controlSide: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlActive: {},
  controlMid: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary[500],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  volumeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
  },
  volumeBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.neutral[80],
    overflow: 'hidden',
  },
  volumeFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: Colors.neutral[40],
  },
  volStepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral[80],
    justifyContent: 'center',
    alignItems: 'center',
  },
  volStepText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 16,
    color: Colors.neutral[0],
  },
  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
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
  browseBtn: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
  },
  browseBtnText: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 15,
    color: Colors.neutral[0],
  },
});
