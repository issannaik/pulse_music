import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Info, Volume2, Heart, Github, Sliders } from 'lucide-react-native';
import { Colors } from '@/theme/colors';
import { useAudio } from '@/context/audio';
import { MiniPlayer } from '@/components/MiniPlayer';
import { pluralize } from '@/utils/format';

export default function SettingsScreen() {
  const { tracks, playlists, volume, setVolume } = useAudio();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <LinearGradient colors={[Colors.neutral[100], Colors.neutral[95]]} style={StyleSheet.absoluteFill} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Library</Text>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.cardIcon}>
                <Sliders size={18} color={Colors.neutral[0]} strokeWidth={2} />
              </View>
              <Text style={styles.cardLabel}>Imported songs</Text>
              <Text style={styles.cardValue}>{tracks.length}</Text>
            </View>
            <View style={styles.cardDivider} />
            <View style={styles.cardRow}>
              <View style={styles.cardIcon}>
                <Heart size={18} color={Colors.neutral[0]} strokeWidth={2} />
              </View>
              <Text style={styles.cardLabel}>Playlists</Text>
              <Text style={styles.cardValue}>{playlists.length}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Playback</Text>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.cardIcon}>
                <Volume2 size={18} color={Colors.neutral[0]} strokeWidth={2} />
              </View>
              <Text style={styles.cardLabel}>Volume</Text>
              <Text style={styles.cardValue}>{Math.round(volume * 100)}%</Text>
            </View>
            <View style={styles.volumeSliderRow}>
              <TouchableOpacity
                style={[styles.volStep, { opacity: 0.6 }]}
                onPress={() => setVolume(Math.max(0, volume - 0.1))}>
                <Text style={styles.volStepText}>-</Text>
              </TouchableOpacity>
              <View style={styles.volBar}>
                <View style={[styles.volFill, { width: `${volume * 100}%` }]} />
              </View>
              <TouchableOpacity
                style={[styles.volStep, { opacity: 0.6 }]}
                onPress={() => setVolume(Math.min(1, volume + 0.1))}>
                <Text style={styles.volStepText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>About</Text>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.cardIcon}>
                <Info size={18} color={Colors.neutral[0]} strokeWidth={2} />
              </View>
              <Text style={styles.cardLabel}>Version</Text>
              <Text style={styles.cardValue}>1.0.0</Text>
            </View>
            <View style={styles.cardDivider} />
            <View style={styles.cardRow}>
              <View style={styles.cardIcon}>
                <Github size={18} color={Colors.neutral[0]} strokeWidth={2} />
              </View>
              <Text style={styles.cardLabel}>Built with</Text>
              <Text style={styles.cardValue}>Expo + React Native</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Pulse Music</Text>
          <Text style={styles.footerSub}>Your offline music player</Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
      <MiniPlayer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.neutral[100] },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  title: {
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 34,
    color: Colors.neutral[0],
    letterSpacing: -0.5,
    marginBottom: 28,
    paddingTop: 16,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontFamily: 'Manrope-Medium',
    fontSize: 12,
    color: Colors.neutral[50],
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  card: {
    backgroundColor: Colors.neutral[90],
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.neutral[80],
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLabel: {
    flex: 1,
    fontFamily: 'Manrope-Medium',
    fontSize: 15,
    color: Colors.neutral[0],
  },
  cardValue: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 15,
    color: Colors.neutral[50],
  },
  cardDivider: {
    height: 0.5,
    backgroundColor: Colors.neutral[80],
    marginHorizontal: 4,
  },
  volumeSliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 4,
    paddingBottom: 16,
  },
  volStep: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.neutral[80],
    justifyContent: 'center',
    alignItems: 'center',
  },
  volStepText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 18,
    color: Colors.neutral[0],
  },
  volBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.neutral[80],
    overflow: 'hidden',
  },
  volFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.primary[400],
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontFamily: 'Manrope-Bold',
    fontSize: 16,
    color: Colors.neutral[0],
  },
  footerSub: {
    fontFamily: 'Manrope-Regular',
    fontSize: 13,
    color: Colors.neutral[50],
    marginTop: 4,
  },
});
