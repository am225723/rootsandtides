import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { colors } from '../theme';
import { useApp } from '../context/AppContext';

import IntakeScreen from '../screens/IntakeScreen';
import EscalationScreen from '../screens/EscalationScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SessionsScreen from '../screens/SessionsScreen';
import HomeworkScreen from '../screens/HomeworkScreen';
import CircleScreen from '../screens/CircleScreen';
import VaultScreen from '../screens/VaultScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CheckInScreen from '../screens/CheckInScreen';
import ModuleDetailScreen from '../screens/ModuleDetailScreen';
import ModuleLibraryScreen from '../screens/ModuleLibraryScreen';
import GroundingScreen from '../screens/GroundingScreen';
import BreathingScreen from '../screens/BreathingScreen';
import UnsentLetterScreen from '../screens/UnsentLetterScreen';
import LegacyBuilderScreen from '../screens/LegacyBuilderScreen';
import CollectionDetailScreen from '../screens/CollectionDetailScreen';
import CandleRitualScreen from '../screens/CandleRitualScreen';
import SeedRitualScreen from '../screens/SeedRitualScreen';
import JournalScreen from '../screens/JournalScreen';
import CopingPlanScreen from '../screens/CopingPlanScreen';
import ResponsibilityPieScreen from '../screens/ResponsibilityPieScreen';
import AudioSessionScreen from '../screens/AudioSessionScreen';
import MoodHistoryScreen from '../screens/MoodHistoryScreen';

export type RootStackParamList = {
  Intake: undefined;
  Main: undefined;
  Escalation: undefined;
  Profile: undefined;
  CheckIn: undefined;
  ModuleDetail: { moduleId: string };
  ModuleLibrary: undefined;
  Grounding: undefined;
  Breathing: undefined;
  UnsentLetter: { collectionId?: string };
  LegacyBuilder: { collectionId?: string };
  CollectionDetail: { collectionId: string };
  CandleRitual: undefined;
  SeedRitual: undefined;
  Journal: undefined;
  CopingPlan: undefined;
  ResponsibilityPie: undefined;
  AudioSession: undefined;
  MoodHistory: undefined;
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

type TabIconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const iconMap: Record<string, TabIconName> = {
    Home: focused ? 'home' : 'home-outline',
    Journey: focused ? 'compass' : 'compass-outline',
    Stability: focused ? 'aperture' : 'aperture-outline',
    Circle: focused ? 'chatbubbles' : 'chatbubbles-outline',
    Vault: focused ? 'albums' : 'albums-outline',
  };

  return (
    <Ionicons
      name={iconMap[name] ?? 'ellipse-outline'}
      size={22}
      color={focused ? colors.tabActive : colors.tabInactive}
    />
  );
}

function TabBarBackground() {
  if (Platform.OS === 'web') {
    return <View style={styles.tabBarBackgroundWeb} />;
  }
  return <BlurView intensity={40} tint="dark" style={styles.tabBarBackgroundNative} />;
}

function AnchorButton({ onPress }: { onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.anchorButton} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.anchorOuter}>
        <View style={styles.anchorInner}>
          <Ionicons name="mic" size={24} color="#FFFFFF" />
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
        tabBarBackground: () => <TabBarBackground />,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Journey" component={SessionsScreen} options={{ tabBarLabel: 'Journey' }} />
      <Tab.Screen
        name="Stability"
        component={HomeworkScreen}
        options={{
          tabBarLabel: 'Stability',
          tabBarButton: (props) => (
            <AnchorButton onPress={props.onPress as (() => void) | undefined} />
          ),
        }}
      />
      <Tab.Screen name="Circle" component={CircleScreen} options={{ tabBarLabel: 'Circle' }} />
      <Tab.Screen name="Vault" component={VaultScreen} options={{ tabBarLabel: 'Vault' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { onboardingDone } = useApp();

  return (
    <Stack.Navigator
      initialRouteName={onboardingDone ? 'Main' : 'Intake'}
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
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="CheckIn" component={CheckInScreen} />
      <Stack.Screen name="ModuleDetail" component={ModuleDetailScreen} />
      <Stack.Screen name="ModuleLibrary" component={ModuleLibraryScreen} />
      <Stack.Screen name="Grounding" component={GroundingScreen} />
      <Stack.Screen name="Breathing" component={BreathingScreen} />
      <Stack.Screen name="UnsentLetter" component={UnsentLetterScreen} />
      <Stack.Screen name="LegacyBuilder" component={LegacyBuilderScreen} />
      <Stack.Screen name="CollectionDetail" component={CollectionDetailScreen} />
      <Stack.Screen name="CandleRitual" component={CandleRitualScreen} />
      <Stack.Screen name="SeedRitual" component={SeedRitualScreen} />
      <Stack.Screen name="Journal" component={JournalScreen} />
      <Stack.Screen name="CopingPlan" component={CopingPlanScreen} />
      <Stack.Screen name="ResponsibilityPie" component={ResponsibilityPieScreen} />
      <Stack.Screen name="AudioSession" component={AudioSessionScreen} />
      <Stack.Screen name="MoodHistory" component={MoodHistoryScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    height: 74,
    borderRadius: 22,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    backgroundColor: 'rgba(13, 17, 23, 0.55)',
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 18,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 14 : 10,
  },
  tabBarBackgroundNative: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 17, 23, 0.40)',
  },
  tabBarBackgroundWeb: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 17, 23, 0.55)',
    // @ts-ignore
    backdropFilter: 'blur(18px)',
  },
  tabItem: { paddingTop: 2 },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  anchorButton: {
    top: -24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  anchorOuter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.anchorGlow,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.anchorRed,
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
  },
  anchorInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.anchorRed,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});