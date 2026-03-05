import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, shadows } from '../theme';
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
import DailyPromptScreen from '../screens/DailyPromptScreen';
import TherapistConnectionScreen from '../screens/TherapistConnectionScreen';
import ProgressReportScreen from '../screens/ProgressReportScreen';

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
  DailyPrompt: undefined;
  TherapistConnection: undefined;
  ProgressReport: { connectionId?: string; therapistName?: string };
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
    <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
      <Ionicons
        name={iconMap[name] ?? 'ellipse-outline'}
        size={22}
        color={focused ? colors.tabActive : colors.tabInactive}
      />
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

function TabBarBackground() {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.tabBarBackgroundWeb}>
        <LinearGradient
          colors={['rgba(28, 35, 51, 0.95)', 'rgba(17, 22, 31, 0.98)']}
          style={styles.tabBarGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </View>
    );
  }
  return (
    <BlurView intensity={40} tint="dark" style={styles.tabBarBackgroundNative}>
      <LinearGradient
        colors={['rgba(28, 35, 51, 0.85)', 'rgba(17, 22, 31, 0.95)']}
        style={styles.tabBarGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
    </BlurView>
  );
}

function AnchorButton({ onPress }: { onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.anchorButton} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={['rgba(239, 68, 68, 0.3)', 'rgba(239, 68, 68, 0.1)']}
        style={styles.anchorOuter}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <LinearGradient
          colors={['#EF4444', '#DC2626']}
          style={styles.anchorInner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="mic" size={24} color="#FFFFFF" />
        </LinearGradient>
      </LinearGradient>
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
        contentStyle: { backgroundColor: colors.surface.dark },
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
      <Stack.Screen name="DailyPrompt" component={DailyPromptScreen} />
      <Stack.Screen name="TherapistConnection" component={TherapistConnectionScreen} />
      <Stack.Screen name="ProgressReport" component={ProgressReportScreen} />
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
    borderRadius: radius.xxl,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    backgroundColor: 'transparent',
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
    backgroundColor: 'rgba(17, 22, 31, 0.85)',
  },
  tabBarBackgroundWeb: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17, 22, 31, 0.90)',
    // @ts-ignore
    backdropFilter: 'blur(20px)',
  },
  tabBarGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  tabItem: {
    paddingTop: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconContainerFocused: {
    // Add subtle glow effect when focused
  },
  activeDot: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.coral,
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
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.anchorGlow,
  },
  anchorInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});