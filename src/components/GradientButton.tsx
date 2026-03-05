import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, typography, shadows, animation } from '../theme';

interface GradientButtonProps {
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'anchor' | 'success' | 'blue';
  icon?: keyof typeof Ionicons.glyphMap | string;
  iconPosition?: 'left' | 'right';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const gradients: Record<string, readonly [string, string]> = {
  primary: ['#E87461', '#C85A4A'] as const,
  secondary: ['#374151', '#1F2937'] as const,
  anchor: ['#EF4444', '#DC2626'] as const,
  success: ['#4CAF50', '#388E3C'] as const,
  blue: ['#3B82F6', '#2563EB'] as const,
};

export default function GradientButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  iconPosition = 'left',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  fullWidth = true,
  children,
}: GradientButtonProps) {
  const getSizeStyles = (): { height: number; padding: number; fontSize: number } => {
    switch (size) {
      case 'small':
        return { height: 40, padding: 12, fontSize: 14 };
      case 'large':
        return { height: 56, padding: 20, fontSize: 18 };
      default:
        return { height: 48, padding: 16, fontSize: 16 };
    }
  };

  const { height, padding, fontSize } = getSizeStyles();

  // Check if icon is an Ionicon name or an emoji string
  const isIonicon = icon && typeof icon === 'string' && icon.includes('-');

  const renderIcon = (position: 'left' | 'right') => {
    if (!icon) return null;
    if (isIonicon) {
      return (
        <Ionicons 
          name={icon as keyof typeof Ionicons.glyphMap} 
          size={fontSize + 4} 
          color="#FFFFFF" 
          style={position === 'left' ? styles.iconLeft : styles.iconRight}
        />
      );
    }
    return (
      <Text style={styles.emojiIcon}>{icon}</Text>
    );
  };

  const content = children || (title && <Text style={[styles.text, { fontSize }, textStyle]}>{title}</Text>);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.container,
        { minHeight: height, width: fullWidth ? '100%' : undefined },
        style,
      ]}
    >
      <LinearGradient
        colors={gradients[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          disabled && styles.disabled,
        ]}
      >
        <View style={[styles.content, { paddingHorizontal: padding }]}>
          {icon && iconPosition === 'left' && renderIcon('left')}
          {content}
          {icon && iconPosition === 'right' && renderIcon('right')}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.softGlow('#E87461'),
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  text: {
    ...typography.buttonText,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  emojiIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  iconLeft: {
    marginRight: 4,
  },
  iconRight: {
    marginLeft: 4,
  },
});