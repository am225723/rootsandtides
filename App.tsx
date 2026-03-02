import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

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

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <AppNavigator />
    </NavigationContainer>
  );
}
