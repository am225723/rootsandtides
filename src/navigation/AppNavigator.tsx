import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IntakeScreen from '../screens/IntakeScreen';
import EscalationScreen from '../screens/EscalationScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SessionsScreen from '../screens/SessionsScreen';
import HomeworkScreen from '../screens/HomeworkScreen';
import CircleScreen from '../screens/CircleScreen';
import VaultScreen from '../screens/VaultScreen';

export type RootStackParamList = {
  Intake: undefined;
  Escalation: undefined;
  Dashboard: undefined;
  Sessions: undefined;
  Homework: undefined;
  Circle: undefined;
  Vault: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Intake">
      <Stack.Screen name="Intake" component={IntakeScreen} options={{ title: 'Intake Assessment' }} />
      <Stack.Screen name="Escalation" component={EscalationScreen} options={{ title: 'Help & Resources', headerBackVisible: false }} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Therapy Dashboard', headerBackVisible: false }} />
      <Stack.Screen name="Sessions" component={SessionsScreen} options={{ title: 'Therapy Sessions' }} />
      <Stack.Screen name="Homework" component={HomeworkScreen} options={{ title: 'Adaptive Tasks' }} />
      <Stack.Screen name="Circle" component={CircleScreen} options={{ title: 'Support Circle' }} />
      <Stack.Screen name="Vault" component={VaultScreen} options={{ title: 'Narrative Vault' }} />
    </Stack.Navigator>
  );
}
