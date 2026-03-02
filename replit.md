# Roots & Tides — Grief Therapy App

A React Native / Expo application for grief therapy and emotional healing, built with Expo 55 and React Native Web. Features a dark, nature-inspired UI with glassmorphism components.

## Architecture

- **Framework**: React Native with Expo 55 (web mode via Metro bundler)
- **Navigation**: React Navigation (bottom tabs + native stack)
- **Design System**: Custom theme with dark forest aesthetic, glassmorphism cards, warm accent colors

## Project Structure

```
App.tsx                          - Root component with dark NavigationContainer theme
index.ts                         - Entry point (registerRootComponent)
src/
  theme/
    index.ts                     - Colors, typography, spacing, radius, shadows
  components/
    ScreenContainer.tsx          - Dark-themed scrollable screen wrapper
    GlassCard.tsx                - Glassmorphism card (default, warm, accent, elevated variants)
    ActionButton.tsx             - Styled button (primary, secondary, danger, ghost variants)
    SectionHeader.tsx            - Section title with optional action link
    QuoteCard.tsx                - Inspirational quote display
  navigation/
    AppNavigator.tsx             - Stack (Intake, Main, Escalation) + Bottom Tabs with anchor button
  screens/
    IntakeScreen.tsx             - Onboarding: "Who did you lose?" + mood assessment
    DashboardScreen.tsx          - Home: mood check-in, audio, recommendations, Roots & Tides
    EscalationScreen.tsx         - SOS Center: breathing tools, grounding, emergency help
    SessionsScreen.tsx           - Therapeutic Journey: phases, modules, progress tracking
    HomeworkScreen.tsx           - Grief Work / Stability: processing tools, capacity check
    CircleScreen.tsx             - Rites & Rituals + Connections: rituals, outreach scripts
    VaultScreen.tsx              - Vault & Anniversary: collections, letters, legacy exercises
assets/                          - App icons and splash screens
attached_assets/extracted/       - Reference design screenshots (33 screens)
```

## Design System

### Colors
- Background: `#0D1117` (dark navy)
- Cards: `rgba(255,255,255,0.06)` (glassmorphism)
- Coral accent: `#E87461` (primary CTA)
- Red: `#DC143C` (anchor/SOS)
- Blue: `#4A90D9` (links/secondary)
- Green: `#4CAF50` (growth)
- Gold: `#C4A265` (warmth)
- Text: `#FFFFFF` primary, `#A0A0B0` secondary, `#6B7280` muted

### Navigation
- Bottom tab bar with 5 items: Home, Journey, Stability (center anchor), Circle, Vault
- Center anchor button elevated with red glow
- Stack navigation for Intake onboarding and Escalation modal

## Running the App

- **Dev**: `npm run web` — starts Expo Metro bundler on port 5000
- **Workflow**: "Start application" → `npm run web`

## Configuration

- Port: 5000 (Metro bundler for web)
- Host: `--host lan` (binds to 0.0.0.0 for Replit proxy access)
- Dependencies installed with `--legacy-peer-deps` due to minor peer dependency conflicts in test libraries
- Key packages: `@react-navigation/bottom-tabs`, `expo-linear-gradient`

## Deployment

- Target: Static export via `npx expo export --platform web`
- Output directory: `dist/`
