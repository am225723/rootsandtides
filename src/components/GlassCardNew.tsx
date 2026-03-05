import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radius, shadows } from '../theme';

interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'accent' | 'warm' | 'nature';
  style?: ViewStyle;
  padding?: number;
  noPadding?: boolean;
}

export default function GlassCardNew({ 
  children, 
  variant = 'default', 
  style,
  padding = 24,
  noPadding = false,
}: GlassCardProps) {
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.surface.elevated,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.08)',
        };
      case 'accent':
        return {
          backgroundColor: colors.surface.card,
          borderWidth: 1,
          borderColor: colors.borderAccent,
        };
      case 'warm':
        return {
          backgroundColor: 'rgba(232, 116, 97, 0.08)',
          borderWidth: 1,
          borderColor: 'rgba(232, 116, 97, 0.2)',
        };
      case 'nature':
        return {
          backgroundColor: 'rgba(76, 175, 80, 0.08)',
          borderWidth: 1,
          borderColor: 'rgba(76, 175, 80, 0.2)',
        };
      default:
        return {
          backgroundColor: colors.surface.card,
          borderWidth: 1,
          borderColor: colors.border,
        };
    }
  };

  const cardContent = (
    <View 
      style={[
        styles.card,
        getVariantStyles(),
        !noPadding && { padding },
        style,
      ]}
    >
      {children}
    </View>
  );

  // Use blur effect on iOS, regular card on Android/Web for performance
  if (Platform.OS === 'ios') {
    return (
      <BlurView 
        intensity={40} 
        tint="dark" 
        style={[styles.blurContainer, { borderRadius: radius.xl }]}
      >
        {cardContent}
      </BlurView>
    );
  }

  return cardContent;
}

const styles = StyleSheet.create({
  blurContainer: {
    overflow: 'hidden',
  },
  card: {
    borderRadius: radius.xl,
    ...shadows.card,
  },
});