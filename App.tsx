import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { AppProvider, useApp } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import LoadingScreen from './src/components/LoadingScreen';

const DarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#E87461',
    background: '#0D1117',
    card: '#0D1117',
    text: '#FFFFFF',
    border: 'rgba(255, 255, 255, 0.08)',
    notification: '#DC143C',
  },
};

function RootNavigator() {
  const { isLoading } = useApp();
  if (isLoading) return <LoadingScreen />;
  return <AppNavigator />;
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer theme={DarkTheme}>
        <RootNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}