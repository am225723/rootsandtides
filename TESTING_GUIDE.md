# Testing Guide for New Features

## Quick Start

1. **Install dependencies** (if not already done):
   ```bash
   cd /workspace/rootsandtides
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Choose your platform**:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app on physical device

---

## Testing T001: Audio Player & Wave Rider

### Scenario 1: Wave Rider from Dashboard
1. Complete onboarding if prompted
2. On Dashboard, find the "Wave Rider" card (has AUDIO badge)
3. Tap the card
4. **Expected**: Navigate to AudioSessionScreen
5. **Verify**: Session title "Wave Rider" appears
6. **Verify**: Pre-session instructions display
7. **Verify**: Audio player controls appear (play button, progress bar, time display)
8. **Test**: Tap play button
9. **Expected**: Button changes to pause, progress bar should update
10. **Test**: Tap pause button
11. **Expected**: Button changes to play
12. **Test**: Tap "Practice Without Audio"
13. **Expected**: Manual breathing instructions appear

### Scenario 2: Wave Riders from Escalation (SOS)
1. Tap the SOS/Anchor button on Dashboard
2. **Expected**: Navigate to EscalationScreen
3. Find the "Wave Riders" card
4. **Expected**: Card has play button and "GUIDED AUDIO SUPPORT" label
5. Tap the card
6. **Expected**: Navigate to AudioSessionScreen
7. **Verify**: Same experience as Scenario 1

### Audio Notes
- Current audio is a silent placeholder
- Progress bar and time display will still work
- For production audio, replace `assets/audio/breathing-guide.mp3`

---

## Testing T002: Mood History

### Scenario 1: First Check-in
1. On Dashboard, tap any mood icon (Stormy, Rainy, Cloudy, etc.)
2. **Expected**: Mood icon highlights
3. Tap "Full Check-in →"
4. **Expected**: Navigate to CheckInScreen
5. Adjust sliders and select options
6. Tap "Save Check-in"
7. **Expected**: Shows "Check-in saved" message, returns to Dashboard

### Scenario 2: View Mood History (No Entries)
1. On Dashboard, tap "View History" button
2. **Expected**: Navigate to MoodHistoryScreen
3. **Expected**: See empty state with "No Check-ins Yet"
4. **Expected**: Message explains that history will appear after first check-in
5. Tap back button (←)
6. **Expected**: Return to Dashboard

### Scenario 3: View Mood History (With Entries)
1. Complete at least one check-in (Scenario 1)
2. On Dashboard, tap "View History" button
3. **Expected**: Navigate to MoodHistoryScreen
4. **Expected**: See stats showing number of check-ins
5. **Expected**: See entries grouped by date (Today, Yesterday, etc.)
6. **Verify**: Each entry shows:
   - Date and time
   - Mood icon and label
   - Grief intensity (color-coded progress bar)
   - Emotional capacity (percentage)
7. Tap back button (←)
8. **Expected**: Return to Dashboard

### Scenario 4: Multiple Check-ins
1. Complete several check-ins throughout the day
2. Navigate to MoodHistory
3. **Expected**: All entries displayed chronologically
4. **Expected**: Newest entries at top
5. **Expected**: Entries grouped by date
6. **Expected**: Different colors for intensity/capacity values

---

## Testing T003: End-to-End Flow

### Scenario 1: Fresh App Start
1. Clear app data (uninstall and reinstall app, or clear storage)
2. Launch app
3. **Expected**: Show Intake/Onboarding screen
4. Complete onboarding
5. **Expected**: Navigate to Dashboard
6. **Expected**: Show greeting with user name
7. **Expected**: Mood check-in section visible
8. **Expected**: Wave Rider card visible
9. **Expected**: View History button visible

### Scenario 2: Navigation Integrity
1. Test all navigation paths:
   - Dashboard → CheckIn → Dashboard ✓
   - Dashboard → AudioSession → Dashboard ✓
   - Dashboard → SOS → Escalation → AudioSession → Dashboard ✓
   - Dashboard → MoodHistory → Dashboard ✓
2. **Expected**: All navigations work without crashes
3. **Expected**: Back buttons return correctly
4. **Expected**: No dead ends or stuck screens

### Scenario 3: Data Persistence
1. Complete a mood check-in
2. Force close the app
3. Relaunch the app
4. **Expected**: Check-in data persists
5. Navigate to MoodHistory
6. **Expected**: Previous check-ins still visible
7. Verify mood displays correctly on Dashboard

---

## Known Issues & Workarounds

### Audio File
- **Issue**: Audio file is a silent placeholder
- **Workaround**: Use "Practice Without Audio" mode
- **Fix**: Replace with real guided meditation audio

### Audio Playback on Web
- **Note**: Some browsers block autoplay
- **Workaround**: User must interact with page first

### Web Platform Differences
- Some animations may behave differently on web vs mobile
- Audio playback might require explicit user interaction on web

---

## Troubleshooting

### Audio Not Playing
1. Check console for errors
2. Verify audio file exists: `assets/audio/breathing-guide.mp3`
3. Try using "Practice Without Audio" mode
4. Check expo-av permissions in app.json

### Navigation Not Working
1. Check AppNavigator.tsx for route registration
2. Verify route name in navigation.navigate() matches
3. Check RootStackParamList for route definition

### Mood History Not Showing
1. Complete a mood check-in first
2. Verify saveMoodEntry is called successfully
3. Check AsyncStorage for mood_history key
4. Refresh the app or navigate away and back

### TypeScript Errors
1. Run `./node_modules/.bin/tsc --noEmit`
2. Fix any reported errors
3. Restart development server

---

## Success Criteria

### T001 Success: ✅
- [ ] Wave Rider card navigates to AudioSessionScreen
- [ ] Audio player controls visible and functional
- [ ] Progress bar displays playback position
- [ ] Time display shows elapsed/remaining time
- [ ] Fallback mode works without audio

### T002 Success: ✅
- [ ] Mood entries save successfully
- [ ] MoodHistoryScreen displays entries chronologically
- [ ] Date/time formatting correct
- [ ] Metrics (intensity, capacity) display properly
- [ ] Empty state shows when no entries

### T003 Success: ✅
- [ ] App compiles without TypeScript errors
- [ ] Navigation paths work end-to-end
- [ ] Data persists across app restarts
- [ ] No runtime crashes or errors
- [ ] All back navigation works

---

## Next Steps for Production

1. **Replace Audio File**
   - Source or record 3-minute guided breathing meditation
   - Save as `assets/audio/breathing-guide.mp3`
   - Test audio quality on target platforms

2. **Test on Real Devices**
   - Test on iOS device
   - Test on Android device
   - Test on web browser
   - Verify audio playback works correctly

3. **Polish UI**
   - Consider adding more visual feedback
   - Add loading states for audio
   - Improve error handling
   - Add accessibility labels

4. **Additional Features (Optional)**
   - Add volume control to audio player
   - Add playback speed options
   - Add seek functionality
   - Add session completion tracking
   - Add charts/trends to mood history
   - Add export functionality

---

## Support

If you encounter any issues:
1. Check console for error messages
2. Review IMPLEMENTATION_SUMMARY.md for details
3. Verify all files are present and correctly configured
4. Ensure dependencies are installed: `npm install`