import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

type Props = {
  navigation: DashboardScreenNavigationProp;
};

export default function DashboardScreen({ navigation }: Props) {
  return (
    <ScrollView style={styles.container}>
      {/* Anchor / Crisis Protocol Button (Point 6) */}
      <View style={styles.anchorContainer}>
        <TouchableOpacity
          style={styles.anchorButton}
          onPress={() => navigation.navigate('Escalation')} // Routing to escalation logic
        >
          <Text style={styles.anchorText}>⚓ ANCHOR (Help Now)</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Your Treatment Plan</Text>

      {/* Target Problems & SMART Goals (Point 2) */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Focus Areas</Text>
        <Text style={styles.bullet}>• Target 1: Reduce frequency of panic attacks</Text>
        <Text style={styles.bullet}>• Target 2: Improve sleep quality (Insomnia track)</Text>
        <Text style={styles.bullet}>• Goal: Practice 2-min exposure 3x this week (SMART)</Text>
      </View>

      {/* Measurement-based Care Outcomes (Point 9) */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Outcomes (PHQ-9, GAD-7)</Text>
        <Text>Symptoms are stable. Functioning rating: 6/10.</Text>
        <Text style={styles.insight}>Insight: You've been engaging well this week. Keep it up!</Text>
      </View>

      {/* Quick Navigation / Weekly Schedule */}
      <View style={styles.navGrid}>
        <View style={styles.navButtonWrapper}>
          <Button title="Start Session" onPress={() => navigation.navigate('Sessions')} />
        </View>
        <View style={styles.navButtonWrapper}>
          <Button title="Homework Tasks" onPress={() => navigation.navigate('Homework')} />
        </View>
        <View style={styles.navButtonWrapper}>
          <Button title="Support Circle" onPress={() => navigation.navigate('Circle')} />
        </View>
        <View style={styles.navButtonWrapper}>
          <Button title="Narrative Vault" onPress={() => navigation.navigate('Vault')} />
        </View>
      </View>

      {/* Coaching Mode Trigger (Point 5) */}
      <View style={styles.coachingCard}>
        <Text style={styles.cardTitle}>How are you feeling right now?</Text>
        <Text style={{ marginBottom: 10 }}>Check in to get real-time adaptive coaching.</Text>
        <Button
          title="Distressed (Acute Mode)"
          color="#ff8c00"
          onPress={() => console.log('Switched to Acute Mode (Distress Tolerance)')}
        />
        <View style={{ marginVertical: 5 }} />
        <Button
          title="Reflective Mode"
          color="#1e90ff"
          onPress={() => console.log('Switched to Reflective Mode (Processing)')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  anchorContainer: {
    marginBottom: 20,
  },
  anchorButton: {
    backgroundColor: '#dc143c',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  anchorText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  bullet: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 5,
  },
  insight: {
    marginTop: 10,
    fontStyle: 'italic',
    color: '#555',
  },
  navGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButtonWrapper: {
    width: '48%',
    marginBottom: 15,
  },
  coachingCard: {
    backgroundColor: '#e6e6fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 30, // extra padding at the bottom
  },
});
