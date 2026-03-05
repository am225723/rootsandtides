import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { colors, radius, typography } from '../theme';

interface AudioPlayerProps {
  audioSource: any;
  title?: string;
  onComplete?: () => void;
}

export default function AudioPlayer({ audioSource, title, onComplete }: AudioPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const progress = duration > 0 ? position / duration : 0;

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadSound = async () => {
    if (sound) {
      await sound.unloadAsync();
    }
    
    setIsLoading(true);
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        audioSource,
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading sound:', error);
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      if (status.isPlaying) {
        setPosition(status.positionMillis);
      }
      if (status.didJustFinish && onComplete) {
        onComplete();
        setIsPlaying(false);
      }
    }
  };

  const handlePlayPause = async () => {
    if (!sound) {
      await loadSound();
      return;
    }

    if (isLoading) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Error playing/pausing sound:', error);
    }
  };

  useEffect(() => {
    if (sound) {
      sound.getStatusAsync().then(status => {
        if (status.isLoaded) {
          setDuration(status.durationMillis || 0);
        }
      });
    }
  }, [sound]);

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      <View style={styles.controlsContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
        
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>

      <View style={styles.playButtonContainer}>
        <TouchableOpacity 
          style={[styles.playButton, isLoading && styles.playButtonDisabled]}
          onPress={handlePlayPause}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={isPlaying ? 'pause' : 'play'} 
            size={32} 
            color={colors.textPrimary} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    ...typography.subtitle,
    textAlign: 'center',
    marginBottom: 24,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeText: {
    ...typography.tag,
    width: 50,
    textAlign: 'center',
  },
  progressBarContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.blue,
    borderRadius: 2,
  },
  playButtonContainer: {
    alignItems: 'center',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  playButtonDisabled: {
    opacity: 0.5,
  },
});