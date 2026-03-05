import { Platform, StyleSheet } from 'react-native';

// ============================================
// ROOTS & TIDES DESIGN SYSTEM
// ============================================

// Color System - Updated to match Stitch design reference
export const colors = {
  // Background Colors
  background: '#0D1117',
  backgroundDark: '#080C12',
  backgroundCard: 'rgba(255, 255, 255, 0.06)',
  backgroundCardHover: 'rgba(255, 255, 255, 0.10)',
  backgroundOverlay: 'rgba(0, 0, 0, 0.5)',
  backgroundWarm: '#1A1210',
  backgroundGreen: '#0A1A0A',
  
  // New Background System (from Stitch)
  surface: {
    dark: '#11161F',
    card: '#1C2333',
    elevated: '#162030',
    light: '#f6f6f8',
    primary: '#FFFFFF',
  },

  // Primary Accent Colors
  coral: '#E87461',
  coralDark: '#C85A4A',
  coralGlow: 'rgba(232, 116, 97, 0.3)',
  
  // Anchor Red (SOS/Emergency)
  anchorRed: '#EF4444',
  anchorGlow: 'rgba(239, 68, 68, 0.4)',
  
  // Blue Accent
  blue: '#4A90D9',
  blueSoft: 'rgba(74, 144, 217, 0.15)',
  accentBlue: '#3B82F6',
  blueGlow: 'rgba(59, 130, 246, 0.3)',
  
  // Semantic Colors
  red: '#DC143C',
  redSoft: 'rgba(220, 20, 60, 0.15)',
  green: '#4CAF50',
  greenSoft: 'rgba(76, 175, 80, 0.15)',
  gold: '#C4A265',
  goldSoft: 'rgba(196, 162, 101, 0.15)',
  purple: '#8B5CF6',
  purpleSoft: 'rgba(139, 92, 246, 0.15)',

  // Text Colors
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0B0',
  textMuted: '#6B7280',
  textWarm: '#D4C5B0',
  textDark: '#1F2937',

  // Border Colors
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.15)',
  borderAccent: 'rgba(232, 116, 97, 0.3)',

  // Tab Bar Colors
  tabActive: '#E87461',
  tabInactive: '#6B7280',

  // Mood/Weather Colors (Gradient Endpoints)
  mood: {
    stormy: {
      gradient: ['#374151', '#1F2937'],
      icon: '#6B7280',
      glow: 'rgba(107, 114, 128, 0.4)',
    },
    rainy: {
      gradient: ['#2563EB', '#1D4ED8'],
      icon: '#60A5FA',
      glow: 'rgba(37, 99, 235, 0.4)',
    },
    cloudy: {
      gradient: ['#64748B', '#475569'],
      icon: '#94A3B8',
      glow: 'rgba(100, 116, 139, 0.4)',
    },
    partly: {
      gradient: ['#D4A373', '#A98467'],
      icon: '#E8C89E',
      glow: 'rgba(212, 163, 115, 0.4)',
    },
    sunny: {
      gradient: ['#FBBF24', '#F59E0B'],
      icon: '#FCD34D',
      glow: 'rgba(251, 191, 36, 0.4)',
    },
  },

  // Module Stage Colors
  stage: {
    sapling: '#8B5CF6',    // Purple
    rawEdge: '#6366F1',    // Indigo
    messyMiddle: '#EC4899', // Pink
    growth: '#10B981',     // Emerald
  },

  // Additional colors for compatibility
  primary: '#E87461',
  success: '#4CAF50',
  warning: '#C4A265',
  text: '#FFFFFF',
  card: 'rgba(255, 255, 255, 0.06)',
};

// ============================================
// SPACING SYSTEM
// ============================================
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// ============================================
// BORDER RADIUS SYSTEM
// ============================================
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

// ============================================
// TYPOGRAPHY SYSTEM
// ============================================
export const fonts = {
  serif: Platform.select({ 
    ios: 'Georgia', 
    android: 'serif', 
    default: 'serif' 
  }),
  sans: Platform.select({ 
    ios: 'System', 
    android: 'sans-serif', 
    default: 'System' 
  }),
  display: Platform.select({ 
    ios: 'System', 
    android: 'sans-serif-medium', 
    default: 'System' 
  }),
};

export const typography = StyleSheet.create({
  // Display/Hero Typography
  heroTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.6,
    fontFamily: fonts.sans,
  },
  heroTitleSerif: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.6,
    fontFamily: fonts.serif,
  },
  
  // Headings
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: fonts.sans,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: fonts.sans,
  },
  
  // Body Text
  body: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    fontFamily: fonts.sans,
  },
  bodySmall: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    fontFamily: fonts.sans,
  },
  
  // Labels & Captions
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: fonts.sans,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
    fontFamily: fonts.sans,
  },
  
  // Special Typography
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.textWarm,
    lineHeight: 24,
    fontFamily: fonts.serif,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: fonts.sans,
  },
  tag: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    fontFamily: fonts.sans,
  },
  
  // Display Label (for section headers like "LESSON 2 OF 7")
  displayLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontFamily: fonts.sans,
  },
});

// ============================================
// SHADOWS & EFFECTS
// ============================================
export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  }),
  softGlow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  }),
  anchorGlow: {
    shadowColor: colors.anchorRed,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 16,
  },
};

// ============================================
// ANIMATION DURATIONS
// ============================================
export const animation = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 800,
};

// ============================================
// EXPORT DEFAULT
// ============================================
export default {
  colors,
  spacing,
  radius,
  fonts,
  typography,
  shadows,
  animation,
};