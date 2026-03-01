import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TextInput } from 'react-native';

const MODULES = [
  { id: 1, title: 'Unsent Letter (Anger → Grief → Love → Release)', type: 'letter' },
  { id: 2, title: 'Legacy Exercise (Traits, Traditions, Continuities)', type: 'legacy' },
  { id: 3, title: 'Re-authoring Module (Values-consistent story)', type: 'authoring' }
];

export default function VaultScreen() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [entryText, setEntryText] = useState('');

  if (activeModule) {
    return (
      <View style={styles.moduleContainer}>
        <Text style={styles.header}>Guided Exercise</Text>
        <Text style={styles.prompt}>
          {activeModule === 'letter' && "Write down the anger you're feeling right now..."}
          {activeModule === 'legacy' && "What is a tradition you want to carry forward?"}
          {activeModule === 'authoring' && "How does this experience align with your core values?"}
        </Text>
        <TextInput
          style={styles.textArea}
          multiline
          placeholder="Reflect here..."
          value={entryText}
          onChangeText={setEntryText}
        />
        <Button
          title="Save & Return"
          onPress={() => {
            setActiveModule(null);
            setEntryText('');
          }}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>The Vault (Narrative Work)</Text>
      <Text style={styles.subtext}>
        This is a space for deep guided narrative integration. It is not just storage; it's identity reconstruction.
      </Text>

      {MODULES.map(module => (
        <View key={module.id} style={styles.card}>
          <Text style={styles.cardTitle}>{module.title}</Text>
          <Button title="Start Exercise" onPress={() => setActiveModule(module.type)} color="#6a5acd" />
        </View>
      ))}

      <View style={styles.ritualBuilder}>
        <Text style={styles.cardTitle}>Ritual Builder</Text>
        <Text style={styles.subtext}>Design a ritual for hard days or anniversaries.</Text>
        <Button title="Create Ritual" onPress={() => console.log('Opening Ritual Builder')} color="#8b4513" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  moduleContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  card: {
    padding: 15,
    backgroundColor: '#f8f8ff',
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  prompt: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fafafa',
    padding: 15,
    height: 200,
    textAlignVertical: 'top',
    marginBottom: 20,
    borderRadius: 5,
  },
  ritualBuilder: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff5ee',
    borderRadius: 8,
  }
});
