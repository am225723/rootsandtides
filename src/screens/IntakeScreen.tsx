import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Switch } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type IntakeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Intake'>;

type Props = {
  navigation: IntakeScreenNavigationProp;
};

export default function IntakeScreen({ navigation }: Props) {
  const [hasRedFlags, setHasRedFlags] = useState(false);
  const [phq9Score, setPhq9Score] = useState(0);
  const [gad7Score, setGad7Score] = useState(0);

  const handleSubmit = () => {
    // Basic risk routing logic
    if (hasRedFlags) {
      navigation.navigate('Escalation');
    } else {
      // In a real app, calculate formulation and save baseline outcomes
      navigation.navigate('Dashboard');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Clinical Intake Assessment</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Symptom Check</Text>
        <Text>Please rate your anxiety (GAD-7) and depression (PHQ-9) symptoms.</Text>
        {/* Placeholder for actual PHQ-9 and GAD-7 questions */}
        <Text style={styles.placeholderText}>[PHQ-9 & GAD-7 Form Fields Go Here]</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Risk Screen (Crucial)</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Do you have thoughts of self-harm, or are you experiencing severe symptoms like psychosis or domestic violence?</Text>
          <Switch value={hasRedFlags} onValueChange={setHasRedFlags} />
        </View>
        {hasRedFlags && (
          <Text style={styles.warningText}>
            Warning: Checking this will route you to our Escalation protocol.
          </Text>
        )}
      </View>

      <Button title="Complete Assessment" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  placeholderText: {
    fontStyle: 'italic',
    color: '#666',
    marginVertical: 10,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  switchLabel: {
    flex: 1,
    marginRight: 10,
    fontSize: 16,
  },
  warningText: {
    color: 'red',
    marginTop: 10,
    fontWeight: 'bold',
  },
});
