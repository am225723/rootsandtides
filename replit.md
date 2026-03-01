# Therapy App

A React Native / Expo application for mental health therapy support, built with Expo 55 and React Native Web for browser access.

## Architecture

- **Framework**: React Native with Expo 55 (web mode via Metro bundler)
- **Navigation**: React Navigation (native stack)
- **Screens**: IntakeScreen, EscalationScreen, DashboardScreen, SessionsScreen, HomeworkScreen, CircleScreen, VaultScreen

## Project Structure

```
App.tsx                    - Root component with NavigationContainer
index.ts                   - Entry point (registerRootComponent)
src/
  navigation/
    AppNavigator.tsx        - Stack navigator with all screens
  screens/
    IntakeScreen.tsx        - Clinical intake assessment
    EscalationScreen.tsx    - Help & resources (crisis)
    DashboardScreen.tsx     - Therapy dashboard
    SessionsScreen.tsx      - Therapy sessions
    HomeworkScreen.tsx      - Adaptive tasks/homework
    CircleScreen.tsx        - Support circle
    VaultScreen.tsx         - Narrative vault
assets/                    - App icons and splash screens
```

## Running the App

- **Dev**: `npm run web` — starts Expo Metro bundler on port 5000
- **Workflow**: "Start application" → `npm run web`

## Configuration

- Port: 5000 (Metro bundler for web)
- Host: `--host lan` (binds to 0.0.0.0 for Replit proxy access)
- Dependencies installed with `--legacy-peer-deps` due to minor peer dependency conflicts in test libraries

## Deployment

- Target: Static export via `npx expo export --platform web`
- Output directory: `dist/`
