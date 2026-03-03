import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors, radius, typography } from '../theme';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Breathing'> };
type Phase = 'inhale' | 'hold1' | 'exhale' | 'hold2';
type Duration = 1 | 3 | 5;

const PHASE_LABELS: Record<Phase, string> = { inhale: 'Inhale', hold1: 'Hold', exhale: 'Exhale', hold2: 'Hold' };
const PHASE_COLORS: Record<Phase, string> = { inhale: colors.blue, hold1: colors.gold, exhale: colors.green, hold2: colors.purple };
const PHASE_SEQUENCE: Phase[] = ['inhale', 'hold1', 'exhale', 'hold2'];

export default function BreathingScreen({ navigation }: Props) {
  const [selectedDuration, setSelectedDuration] = useState<Duration>(3);
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>('inhale');
  const [phaseCount, setPhaseCount] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [finished, setFinished] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0.5)).current;
  const phaseIndexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animRef = useRef<Animated.CompositeAnimation | null>(null);
  const totalDurationSec = selectedDuration * 60;

  const runPhaseAnimation = (phase: Phase) => {
    if (animRef.current) animRef.current.stop();
    const toScale = phase === 'inhale' ? 1.0 : phase === 'exhale' ? 0.6 : undefined;
    if (toScale !== undefined) {
      animRef.current = Animated.timing(scaleAnim, { toValue: toScale, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true });
      animRef.current.start();
    }
  };

  useEffect(() => {
    if (!isRunning) return;
    phaseIndexRef.current = 0;
    setCurrentPhase('inhale');
    setPhaseCount(0);
    setTotalSeconds(0);
    runPhaseAnimation('inhale');
    let elapsed = 0;
    let phaseElapsed = 0;
    intervalRef.current = setInterval(() => {
      elapsed += 1; phaseElapsed += 1;
      setTotalSeconds(elapsed); setPhaseCount(phaseElapsed);
      if (elapsed >= totalDurationSec) { clearInterval(intervalRef.current!); setIsRunning(false); setFinished(true); return; }
      if (phaseElapsed >= 4) {
        phaseElapsed = 0;
        phaseIndexRef.current = (phaseIndexRef.current + 1) % 4;
        const nextPhase = PHASE_SEQUENCE[phaseIndexRef.current];
        setCurrentPhase(nextPhase); setPhaseCount(0);
        runPhaseAnimation(nextPhase);
      }
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); if (animRef.current) animRef.current.stop(); };
  }, [isRunning]);

  const handleStop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (animRef.current) animRef.current.stop();
    setIsRunning(false); scaleAnim.setValue(0.6); opacityAnim.setValue(0.5);
    setCurrentPhase('inhale'); setPhaseCount(0); setTotalSeconds(0);
  };

  const remaining = totalDurationSec - totalSeconds;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const phaseColor = PHASE_COLORS[currentPhase];
  const countdownInPhase = 4 - phaseCount;

  if (finished) {
    return (
      <View style={styles.fullScreen}>
        <View style={styles.finishedContent}>
          <Text style={styles.finishedEmoji}>⋋</Text>
          <Text style={styles.finishedTitle}>Session Complete</Text>
          <Text style={styles.finishedSub}>You've completed {selectedDuration} minute{selectedDuration > 1 ? 's' : ''} of box breathing.{'\n'}Notice how your body feels right now.</Text>
          <TouchableOpacity style={[styles.doneBtn, { backgroundColor: colors.green }]} onPress={() => navigation.goBack()}>
            <Text style={styles.doneBtnText}>Return to Safety</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.fullScreen}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => { handleStop(); navigation.goBack(); }}><Text style={styles.backIcon}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Box Breathing</Text>
        <View style={{ width: 40 }} />
      </View>
      {!isRunning && (
        <View style={styles.durationRow}>
          {([1, 3, 5] as Duration[]).map((d) => (
            <TouchableOpacity key={d} style={[styles.durationBtn, selectedDuration === d && styles.durationBtnActive]} onPress={() => setSelectedDuration(d)}>
              <Text style={[styles.durationText, selectedDuration === d && styles.durationTextActive]}>{d} min</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {isRunning && <Text style={styles.timer}>{mins}:{secs.toString().padStart(2, '0')}</Text>}
      <View style={styles.circleContainer}>
        <Animated.View style={[styles.outerRing, { transform: [{ scale: scaleAnim }], opacity: opacityAnim, borderColor: phaseColor + '30' }]} />
        <Animated.View style={[styles.middleRing, { transform: [{ scale: scaleAnim }], borderColor: phaseColor + '50' }]} />
        <Animated.View style={[styles.innerCircle, { transform: [{ scale: scaleAnim }], backgroundColor: phaseColor + '25', borderColor: phaseColor }]}>
          <Text style={[styles.phaseLabel, { color: phaseColor }]}>{isRunning ? PHASE_LABELS[currentPhase] : 'Ready'}</Text>
          {isRunning && <Text style={[styles.phaseCount, { color: phaseColor }]}>{countdownInPhase}</Text>}
        </Animated.View>
      </View>
      {isRunning && (
        <View style={styles.phaseRow}>
          {PHASE_SEQUENCE.map((p) => (
            <View key={p} style={styles.phaseItem}>
              <View style={[styles.phaseDot, { backgroundColor: p === currentPhase ? PHASE_COLORS[p] : 'rgba(255,255,255,0.15)' }]} />
              <Text style={[styles.phaseItemLabel, { color: p === currentPhase ? PHASE_COLORS[p] : colors.textMuted }]}>{PHASE_LABELS[p]}</Text>
            </View>
          ))}
        </View>
      )}
      {!isRunning && (
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>Inhale 4s → Hold 4s → Exhale 4s → Hold 4s</Text>
          <Text style={styles.instructionSub}>Box breathing activates the parasympathetic nervous system, reducing stress and anxiety.</Text>
        </View>
      )}
      <View style={styles.controlContainer}>
        {!isRunning ? (
          <TouchableOpacity style={[styles.startBtn, { backgroundColor: colors.blue }]} onPress={() => { setFinished(false); setIsRunning(true); }} activeOpacity={0.8}>
            <Text style={styles.startBtnText}>Begin Session</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stopBtn} onPress={handleStop} activeOpacity={0.8}>
            <Text style={styles.stopBtnText}>Stop</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.backgroundCard, justifyContent: 'center', alignItems: 'center' },
  backIcon: { color: colors.textPrimary, fontSize: 20 },
  headerTitle: { ...typography.subtitle, fontSize: 17 },
  durationRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 16 },
  durationBtn: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border },
  durationBtnActive: { backgroundColor: colors.blue, borderColor: colors.blue },
  durationText: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  durationTextActive: { color: '#FFFFFF' },
  timer: { textAlign: 'center', fontSize: 20, fontWeight: '700', color: colors.textMuted, marginBottom: 8 },
  circleContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  outerRing: { position: 'absolute', width: 260, height: 260, borderRadius: 130, borderWidth: 1 },
  middleRing: { position: 'absolute', width: 220, height: 220, borderRadius: 110, borderWidth: 1.5 },
  innerCircle: { width: 180, height: 180, borderRadius: 90, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  phaseLabel: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  phaseCount: { fontSize: 40, fontWeight: '300' },
  phaseRow: { flexDirection: 'row', justifyContent: 'center', gap: 24, paddingHorizontal: 20, marginBottom: 24 },
  phaseItem: { alignItems: 'center', gap: 4 },
  phaseDot: { width: 8, height: 8, borderRadius: 4 },
  phaseItemLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  instructions: { paddingHorizontal: 32, marginBottom: 24, alignItems: 'center' },
  instructionText: { fontSize: 15, fontWeight: '600', color: colors.textSecondary, textAlign: 'center', marginBottom: 8 },
  instructionSub: { ...typography.bodySmall, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },
  controlContainer: { paddingHorizontal: 24, paddingBottom: 48 },
  startBtn: { paddingVertical: 16, borderRadius: radius.xl, alignItems: 'center' },
  startBtnText: { ...typography.buttonText },
  stopBtn: { paddingVertical: 16, borderRadius: radius.xl, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: colors.border },
  stopBtnText: { ...typography.buttonText, color: colors.textSecondary },
  finishedContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  finishedEmoji: { fontSize: 64, marginBottom: 20, color: colors.green },
  finishedTitle: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  finishedSub: { ...typography.body, textAlign: 'center', color: colors.textSecondary, lineHeight: 26, marginBottom: 32 },
  doneBtn: { paddingVertical: 16, paddingHorizontal: 40, borderRadius: radius.xl },
  doneBtnText: { ...typography.buttonText },
});