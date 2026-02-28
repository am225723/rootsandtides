import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';

const SESSIONS = [
  { id: 1, title: 'Session 1: Panic education + interoceptive map', status: 'completed' },
  { id: 2, title: 'Session 2: Trigger ladder + exposure plan', status: 'current' },
  { id: 3, title: 'Session 3: Cognitive restructuring + safety behaviors', status: 'upcoming' },
];

export default function SessionsScreen() {
  const [activeSession, setActiveSession] = useState<number | null>(null);

  if (activeSession) {
    return (
      <View style={styles.sessionContainer}>
        <Text style={styles.header}>Active Session {activeSession}</Text>
        <Text style={styles.text}>1. Check-in + symptom snapshot</Text>
        <Text style={styles.text}>2. Agenda setting ("what matters most today?")</Text>
        <Text style={styles.text}>3. Guided intervention (interactive dialogue)</Text>
        <Text style={styles.text}>4. Insight capture ("what did you learn?")</Text>
        <Text style={styles.text}>5. Homework assignment</Text>
        <Text style={styles.text}>6. Relapse prevention note</Text>

        <View style={styles.buttonWrapper}>
          <Button title="Complete Session" onPress={() => setActiveSession(null)} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Your Calendarized Program</Text>
      {SESSIONS.map((session) => (
        <TouchableOpacity
          key={session.id}
          style={[styles.sessionCard, session.status === 'current' && styles.currentSessionCard]}
          onPress={() => {
            if (session.status === 'current') setActiveSession(session.id);
          }}
        >
          <Text style={styles.sessionTitle}>{session.title}</Text>
          <Text style={styles.sessionStatus}>
            Status: {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  sessionContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  sessionCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#ccc',
  },
  currentSessionCard: {
    borderLeftColor: '#1e90ff',
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sessionStatus: {
    marginTop: 5,
    color: '#666',
  },
  buttonWrapper: {
    marginTop: 20,
  },
});
