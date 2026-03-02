import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme';

import IntakeScreen from '../screens/IntakeScreen';
import EscalationScreen from '../screens/EscalationScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SessionsScreen from '../screens/SessionsScreen';
import HomeworkScreen from '../screens/HomeworkScreen';
import CircleScreen from '../screens/CircleScreen';
import VaultScreen from '../screens/VaultScreen';

export type RootStackParamList = {
  Intake: undefined;
  Main: undefined;
  Escalation: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Journey: undefined;
  Stability: undefined;
  Circle: undefined;
  Vault: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '⌂',
    Journey: '⟡',
    Stability: '⚓',
    Circle: '❋',
    Vault: '▣',
  };

  return (
    <Text style={[
      styles.tabIcon,
      { color: focused ? colors.tabActive : colors.tabInactive }
    ]}>
      {icons[name] || '○'}
    </Text>
  );
}

function AnchorButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.anchorButton} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.anchorOuter}>
        <View style={styles.anchorInner}>
          <Text style={styles.anchorIcon}>⚓</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Journey"
        component={SessionsScreen}
        options={{ tabBarLabel: 'Journey' }}
      />
      <Tab.Screen
        name="Stability"
        component={HomeworkScreen}
        options={{
          tabBarLabel: 'Stability',
          tabBarButton: (props) => (
            <AnchorButton onPress={() => props.onPress?.({} as any)} />
          ),
        }}
      />
      <Tab.Screen
        name="Circle"
        component={CircleScreen}
        options={{ tabBarLabel: 'Circle' }}
      />
      <Tab.Screen
        name="Vault"
        component={VaultScreen}
        options={{ tabBarLabel: 'Vault' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Intake" component={IntakeScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen
        name="Escalation"
        component={EscalationScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(13, 17, 23, 0.95)',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 80,
    paddingBottom: 16,
    paddingTop: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  tabIcon: {
    fontSize: 22,
  },
  anchorButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  anchorOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.anchorGlow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  anchorInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.anchorRed,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  anchorIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
});
