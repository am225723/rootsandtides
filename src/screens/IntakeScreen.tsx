import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ScreenContainer from '../components/ScreenContainer';
import ActionButton from '../components/ActionButton';
import { colors, radius, typography, spacing } from '../theme';

type IntakeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Intake'>;

type Props = {
  navigation: IntakeScreenNavigationProp;
};

const RELATIONSHIP_OPTIONS = [
  { label: 'Mother', subtitle: undefined },
  { label: 'Father', subtitle: undefined },
  { label: 'Stepparent', subtitle: undefined },
  { label: 'Complicated', subtitle: 'SENSITIVE PATH' },
];

export default function IntakeScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  const handleContinue = () => {
    if (!selected) return;
    if (step === 0) {
      setSelected(null);
      setStep(1);
    } else {
      if (selected === 'Raw & Heavy') {
        navigation.navigate('Escalation');
      } else {
        navigation.navigate('Main');
      }
    }
  };

  if (step === 0) {
    return (
      <View style={styles.fullScreen}>
        <View style={styles.heroOverlay}>
          <View style={styles.forestBackground}>
            <View style={styles.forestGradient} />
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '33%' }]} />
          </View>

          <Text style={styles.heroTitle}>
            {'Who did you '}
            <Text style={styles.heroTitleItalic}>lose?</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            We'll tailor your journey based on this unique bond.
          </Text>

          <View style={styles.optionsContainer}>
            {RELATIONSHIP_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.label}
                style={[
                  styles.optionCard,
                  selected === option.label && styles.optionCardSelected,
                ]}
                onPress={() => setSelected(option.label)}
                activeOpacity={0.8}
              >
                <View>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  {option.subtitle && (
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                  )}
                </View>
                <View style={[
                  styles.radio,
                  selected === option.label && styles.radioSelected,
                ]}>
                  {selected === option.label && <Text style={styles.radioCheck}>✓</Text>}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.bottomActions}>
            <ActionButton
              title="Continue  →"
              onPress={handleContinue}
              variant={selected ? 'primary' : 'secondary'}
              style={selected ? { backgroundColor: colors.blue } : {}}
            />
            <Text style={styles.footerText}>ROOTS & TIDES — GENTLE ONBOARDING</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fullScreen}>
      <View style={styles.heroOverlay}>
        <View style={styles.forestBackground}>
          <View style={styles.forestGradient} />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '66%' }]} />
        </View>

        <Text style={styles.heroTitle}>
          {'How are you '}
          <Text style={styles.heroTitleItalic}>arriving?</Text>
        </Text>
        <Text style={styles.heroSubtitle}>
          There's no wrong answer. This helps us meet you where you are.
        </Text>

        <View style={styles.moodContainer}>
          {['Raw & Heavy', 'Numb & Foggy', 'Anxious & Restless', 'Quietly Sad', 'Seeking Meaning'].map((mood, idx) => (
            <TouchableOpacity
              key={mood}
              style={[
                styles.moodCard,
                selected === mood && styles.moodCardSelected,
              ]}
              onPress={() => setSelected(mood)}
              activeOpacity={0.8}
            >
              <Text style={styles.moodEmoji}>
                {['🌊', '🌫️', '⚡', '🌧️', '🌱'][idx]}
              </Text>
              <Text style={styles.moodLabel}>{mood}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomActions}>
          <ActionButton
            title="Begin Your Journey  →"
            onPress={handleContinue}
            variant="primary"
            style={{ backgroundColor: colors.coral }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  forestBackground: {
    flex: 1,
    backgroundColor: '#0A1A12',
  },
  forestGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(13, 17, 23, 0.85)',
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    marginBottom: 40,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.blue,
    borderRadius: 2,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '300',
    color: colors.textPrimary,
    marginBottom: 12,
    lineHeight: 44,
  },
  heroTitleItalic: {
    fontStyle: 'italic',
    fontWeight: '400',
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: 36,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 12,
  },
  optionCardSelected: {
    borderColor: colors.blue,
    backgroundColor: 'rgba(74, 144, 217, 0.08)',
  },
  optionLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  optionSubtitle: {
    ...typography.label,
    color: colors.blue,
    marginTop: 4,
  },
  radio: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  radioCheck: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomActions: {
    marginTop: 'auto',
    paddingTop: 32,
  },
  footerText: {
    ...typography.label,
    textAlign: 'center',
    marginTop: 20,
    color: colors.textMuted,
  },
  moodContainer: {
    gap: 10,
  },
  moodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: radius.md,
    padding: 16,
    marginBottom: 8,
  },
  moodCardSelected: {
    borderColor: colors.coral,
    backgroundColor: 'rgba(232, 116, 97, 0.08)',
  },
  moodEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  moodLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.textPrimary,
  },
});
