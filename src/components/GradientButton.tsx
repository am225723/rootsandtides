import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, typography, shadows, animation } from '../theme';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'anchor' | 'success' | 'blue';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

const gradients = {
  primary: ['#E87461', '#C85A4A'],
  secondary: ['#374151', '#1F2937'],
  anchor: ['#EF4444', '#DC2626'],
  success: ['#4CAF50', '#388E3C'],
  blue: ['#3B82F6', '#2563EB'],
};

export default function GradientButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  iconPosition = 'right',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
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

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.container,
        { height, width: fullWidth ? '100%' : undefined },
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
          {icon && iconPosition === 'left' && (
            <Ionicons 
              name={icon} 
              size={fontSize + 4} 
              color="#FFFFFF" 
              style={styles.iconLeft}
            />
          )}
          <Text 
            style={[
              styles.text,
              { fontSize },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons 
              name={icon} 
              size={fontSize + 4} 
              color="#FFFFFF" 
              style={styles.iconRight}
            />
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.full,
    overflow: 'hidden',
    ...shadows.softGlow('#E87461'),
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    ...typography.buttonText,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  iconLeft: {
    marginRight: 4,
  },
  iconRight: {
    marginLeft: 4,
  },
});