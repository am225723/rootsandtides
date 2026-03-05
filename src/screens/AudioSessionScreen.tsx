import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ScreenContainer from '../components/ScreenContainer';
import AudioPlayer from '../components/AudioPlayer';
import { colors, radius, typography } from '../theme';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'AudioSession'> };

const SESSIONS = {
  waveRider: {
    title: 'Wave Rider',
    description: 'A 3-minute guided breathing session to help you navigate sudden waves of grief.',
    instructions: [
      'Find a comfortable seated position',
      'Gently close your eyes or soften your gaze',
      'Follow the audio guidance',
      'Allow yourself to feel whatever comes up',
      'Remember: waves pass, you remain',
    ],
  },
};

export default function AudioSessionScreen({ navigation }: Props) {
  const session = SESSIONS.waveRider;
  const [showManualMode, setShowManualMode] = useState(false);

  const handleComplete = () => {
    Alert.alert(
      'Session Complete',
      'Well done. Take a moment to notice how you feel.',
      [{ text: 'Continue', onPress: () => navigation.goBack() }]
    );
  };

  const handleAudioError = () => {
    setShowManualMode(true);
    Alert.alert(
      'Audio Not Available',
      'The audio file is not available. You can practice breathing manually instead.',
      [{ text: 'OK' }]
    );
  };

  const startBreathingGuide = () => {
    Alert.alert(
      'Breathing Exercise',
      'Breathe in for 4 counts, hold for 4 counts, breathe out for 4 counts, hold for 4 counts. Repeat for 3 minutes.',
      [{ text: 'Start Timer', onPress: () => handleComplete() }]
    );
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wave Rider</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.badge}>Guided Session</Text>
        <Text style={styles.title}>{session.title}</Text>
        <Text style={styles.description}>{session.description}</Text>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Before you begin:</Text>
          {session.instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </View>

        {!showManualMode ? (
          <View style={styles.playerContainer}>
            <AudioPlayer
              audioSource={require('../../assets/audio/breathing-guide.mp3')}
              title={session.title}
              onComplete={handleComplete}
            />
            <TouchableOpacity 
              style={styles.manualButton}
              onPress={() => setShowManualMode(true)}
            >
              <Text style={styles.manualButtonText}>Practice Without Audio</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.manualContainer}>
            <Text style={styles.manualTitle}>Manual Breathing Practice</Text>
            <Text style={styles.manualDescription}>
              Since audio isn't available, you can practice on your own using the box breathing technique:
            </Text>
            <View style={styles.breathingSteps}>
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View>
                <Text style={styles.stepText}>Breathe in for 4 counts</Text>
              </View>
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}><Text style={styles.stepNumberText}>2</Text></View>
                <Text style={styles.stepText}>Hold for 4 counts</Text>
              </View>
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}><Text style={styles.stepNumberText}>3</Text></View>
                <Text style={styles.stepText}>Breathe out for 4 counts</Text>
              </View>
              <View style={styles.stepItem}>
                <View style={styles.stepNumber}><Text style={styles.stepNumberText}>4</Text></View>
                <Text style={styles.stepText}>Hold for 4 counts</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.startButton}
              onPress={startBreathingGuide}
            >
              <Text style={styles.startButtonText}>Start 3-Minute Timer</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.supportText}>
          Take your time. There's no rush. This space is yours.
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: colors.textPrimary,
    fontSize: 18,
  },
  headerTitle: {
    ...typography.subtitle,
    fontSize: 17,
  },
  placeholder: {
    width: 36,
  },
  scrollContent: {
    padding: 20,
  },
  badge: {
    ...typography.label,
    color: colors.blue,
    textAlign: 'center',
    marginBottom: 12,
  },
  title: {
    ...typography.heroTitle,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
  },
  instructionsContainer: {
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 32,
  },
  instructionsTitle: {
    ...typography.subtitle,
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bullet: {
    fontSize: 20,
    color: colors.blue,
    marginRight: 12,
    marginTop: -2,
  },
  instructionText: {
    ...typography.bodySmall,
    flex: 1,
    lineHeight: 22,
  },
  playerContainer: {
    marginBottom: 32,
  },
  manualButton: {
    marginTop: 20,
    padding: 16,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  manualButtonText: {
    ...typography.tag,
    color: colors.textMuted,
  },
  manualContainer: {
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.lg,
    padding: 24,
    marginBottom: 32,
  },
  manualTitle: {
    ...typography.subtitle,
    textAlign: 'center',
    marginBottom: 12,
  },
  manualDescription: {
    ...typography.bodySmall,
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: 24,
  },
  breathingSteps: {
    marginBottom: 24,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.blueSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    ...typography.tag,
    color: colors.blue,
  },
  stepText: {
    ...typography.bodySmall,
    flex: 1,
  },
  startButton: {
    backgroundColor: colors.blue,
    borderRadius: radius.md,
    padding: 16,
    alignItems: 'center',
  },
  startButtonText: {
    ...typography.buttonText,
    color: colors.textPrimary,
  },
  supportText: {
    ...typography.bodySmall,
    textAlign: 'center',
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});