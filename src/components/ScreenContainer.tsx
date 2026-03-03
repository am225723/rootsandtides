import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

type Props = {
  children: React.ReactNode;
  scrollable?: boolean;
  variant?: 'forest' | 'ocean' | 'plain';
};

const BG = {
  forest: require('../../assets/bg/forest.jpg'),
  ocean: require('../../assets/bg/ocean.jpg'),
};
const NOISE = require('../../assets/bg/noise.png');
const OVERLAY = {
  forest: {
    gradient: ['rgba(0,0,0,0.68)', 'rgba(0,0,0,0.26)', 'rgba(0,0,0,0.74)'] as const,
    tint: 'rgba(10, 26, 18, 0.24)',
  },
  ocean: {
    gradient: ['rgba(0,0,0,0.72)', 'rgba(0,0,0,0.24)', 'rgba(0,0,0,0.76)'] as const,
    tint: 'rgba(12, 20, 32, 0.24)',
  },
};

export default function ScreenContainer({
  children,
  scrollable = true,
  variant = 'forest',
}: Props) {
  const bgSource = variant === 'plain' ? null : BG[variant];
  const overlay = variant === 'plain' ? null : OVERLAY[variant];

  const content = scrollable ? (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.container, styles.nonScrollContent]}>{children}</View>
  );

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" />
      {bgSource ? (
        <ImageBackground source={bgSource} style={styles.bg} resizeMode="cover">
          <LinearGradient
            colors={overlay!.gradient}
            locations={[0, 0.45, 1]}
            style={StyleSheet.absoluteFillObject}
          />

          <View
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: overlay!.tint,
              },
            ]}
          />

          <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
            <Image source={NOISE} style={styles.noise} resizeMode="repeat" />
          </View>

          {content}
        </ImageBackground>
      ) : (
        <View style={[styles.bg, { backgroundColor: colors.background }]}>{content}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bg: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  nonScrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  noise: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.035,
  },
});
