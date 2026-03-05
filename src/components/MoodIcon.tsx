import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows } from '../theme';

type MoodType = 'stormy' | 'rainy' | 'cloudy' | 'partly' | 'sunny';

interface MoodIconProps {
  mood: MoodType;
  selected?: boolean;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

const moodConfig = {
  stormy: {
    gradient: ['#374151', '#1F2937'] as const,
    icon: 'thunderstorm' as const,
    iconColor: colors.mood.stormy.icon,
    glow: colors.mood.stormy.glow,
    label: 'Stormy',
  },
  rainy: {
    gradient: ['#2563EB', '#1D4ED8'] as const,
    icon: 'rainy' as const,
    iconColor: colors.mood.rainy.icon,
    glow: colors.mood.rainy.glow,
    label: 'Rainy',
  },
  cloudy: {
    gradient: ['#64748B', '#475569'] as const,
    icon: 'cloud' as const,
    iconColor: colors.mood.cloudy.icon,
    glow: colors.mood.cloudy.glow,
    label: 'Cloudy',
  },
  partly: {
    gradient: ['#D4A373', '#A98467'] as const,
    icon: 'partly-sunny' as const,
    iconColor: colors.mood.partly.icon,
    glow: colors.mood.partly.glow,
    label: 'Partly',
  },
  sunny: {
    gradient: ['#FBBF24', '#F59E0B'] as const,
    icon: 'sunny' as const,
    iconColor: colors.mood.sunny.icon,
    glow: colors.mood.sunny.glow,
    label: 'Sunny',
  },
};

const sizeConfig = {
  small: { icon: 24, container: 48 },
  medium: { icon: 32, container: 64 },
  large: { icon: 40, container: 80 },
};

export default function MoodIcon({ 
  mood, 
  selected = false, 
  onPress,
  size = 'medium' 
}: MoodIconProps) {
  const config = moodConfig[mood];
  const sizes = sizeConfig[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.container,
        {
          width: sizes.container,
          height: sizes.container,
          shadowColor: config.glow,
          shadowOpacity: selected ? 0.8 : 0,
          shadowRadius: selected ? 20 : 0,
          shadowOffset: { width: 0, height: 0 },
          elevation: selected ? 12 : 0,
        },
        selected && styles.selected,
      ]}
    >
      <LinearGradient
        colors={config.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Ionicons
          name={config.icon}
          size={sizes.icon}
          color={config.iconColor}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.full,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    borderColor: colors.accentBlue,
    borderWidth: 3,
  },
});