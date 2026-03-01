import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type EscalationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Escalation'>;

type Props = {
  navigation: EscalationScreenNavigationProp;
};

export default function EscalationScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Urgent Care Routing</Text>
      <Text style={styles.text}>
        Based on your assessment, our system detected potential red flags (such as suicidality, psychosis/mania, or domestic violence risks).
      </Text>
      <Text style={styles.text}>
        For your safety and well-being, the app is stopping its automated therapist mode. We are routing you to human care.
      </Text>

      <View style={styles.buttonContainer}>
        <Button title="Contact Crisis Line" onPress={() => console.log("Dialing Crisis Line")} color="red" />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Find Immediate Human Care" onPress={() => console.log("Opening resources list")} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Go Back to Assessment" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'red',
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 10,
  },
});
