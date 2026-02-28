import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';

export default function HomeworkScreen() {
  const [successCount, setSuccessCount] = useState(0);
  const [failureCount, setFailureCount] = useState(0);

  const getDifficultyLevel = () => {
    if (failureCount > 1) return 'Shrinking scope. Try 1 minute of exposure instead of 2.';
    if (successCount > 2) return 'Increasing scope. Try 3 minutes of exposure.';
    return 'Current task: 2-minute exposure x3 this week.';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Adaptive Homework</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Task for the Week</Text>
        <Text style={styles.taskText}>{getDifficultyLevel()}</Text>
      </View>

      <View style={styles.actionRow}>
        <Button
          title="I did it!"
          onPress={() => setSuccessCount(prev => prev + 1)}
          color="#32cd32"
        />
        <Button
          title="Missed it"
          onPress={() => setFailureCount(prev => prev + 1)}
          color="#a9a9a9"
        />
      </View>

      <Text style={styles.stats}>Successes: {successCount} | Misses: {failureCount}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 20,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    marginBottom: 30,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  stats: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  }
});
