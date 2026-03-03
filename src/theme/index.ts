import { Platform, StyleSheet } from 'react-native';

export const colors = {
  background: '#0D1117',
  backgroundDark: '#080C12',
  backgroundCard: 'rgba(255, 255, 255, 0.06)',
  backgroundCardHover: 'rgba(255, 255, 255, 0.10)',
  backgroundOverlay: 'rgba(0, 0, 0, 0.5)',
  backgroundWarm: '#1A1210',
  backgroundGreen: '#0A1A0A',

  coral: '#E87461',
  coralDark: '#C85A4A',
  red: '#DC143C',
  redSoft: 'rgba(220, 20, 60, 0.15)',
  blue: '#4A90D9',
  blueSoft: 'rgba(74, 144, 217, 0.15)',
  green: '#4CAF50',
  greenSoft: 'rgba(76, 175, 80, 0.15)',
  gold: '#C4A265',
  goldSoft: 'rgba(196, 162, 101, 0.15)',
  purple: '#8B5CF6',

  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0B0',
  textMuted: '#6B7280',
  textWarm: '#D4C5B0',

  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.15)',
  borderAccent: 'rgba(232, 116, 97, 0.3)',

  anchorRed: '#DC143C',
  anchorGlow: 'rgba(220, 20, 60, 0.3)',

  tabActive: '#E87461',
  tabInactive: '#6B7280',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

export const fonts = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  sans: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
};

export const typography = StyleSheet.create({
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
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: fonts.sans,
  },
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
});

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
};
