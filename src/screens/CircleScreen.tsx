import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TextInput } from 'react-native';

const SCRIPTS = [
  { id: 1, title: 'Check in without pressure', text: 'Hey, just thinking of you. No need to reply unless you want to.' },
  { id: 2, title: 'Need distraction', text: 'Having a rough moment. Could you tell me a random story or distraction?' },
  { id: 3, title: 'Repair template', text: 'I want to redo how I handled our last conversation. I was overwhelmed and reacted poorly.' }
];

export default function CircleScreen() {
  const [selectedScript, setSelectedScript] = useState('');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Your Support Circle</Text>

      <Text style={styles.sectionTitle}>Pre-written Outreach Scripts</Text>
      {SCRIPTS.map(script => (
        <View key={script.id} style={styles.scriptContainer}>
          <Text style={styles.scriptTitle}>{script.title}</Text>
          <Button
            title="Use Script"
            onPress={() => setSelectedScript(script.text)}
            color="#20b2aa"
          />
        </View>
      ))}

      {selectedScript ? (
        <View style={styles.draftContainer}>
          <Text style={styles.sectionTitle}>Draft Message:</Text>
          <TextInput
            style={styles.textArea}
            multiline
            value={selectedScript}
            onChangeText={setSelectedScript}
          />
          <Button title="Send Message" onPress={() => console.log('Sending message:', selectedScript)} />
        </View>
      ) : null}

      <View style={styles.escalationSettings}>
        <Text style={styles.sectionTitle}>Consent-based Escalation Settings</Text>
        <Text>Status: Enabled</Text>
        <Text style={styles.note}>"If I hit Anchor twice in 2 hours, ask if I want to notify my emergency contact."</Text>
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  scriptContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
    borderRadius: 5,
  },
  scriptTitle: {
    fontSize: 16,
    flex: 1,
  },
  draftContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e0ffff',
    borderRadius: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 10,
    height: 100,
    marginBottom: 10,
    textAlignVertical: 'top',
  },
  escalationSettings: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#ffe4e1',
    borderRadius: 8,
  },
  note: {
    fontStyle: 'italic',
    color: '#555',
    marginTop: 5,
  }
});
