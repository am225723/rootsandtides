# Design Redesign Implementation Plan

Based on the Stitch design references, here's a comprehensive plan to redesign the Roots & Tides app with a more polished, gentle, and cohesive aesthetic.

## Design Analysis Summary

The reference design features:

### Visual Style
- **Dark Theme**: Deep blues, blacks (#11161F, #1C2333, #162030)
- **Accent Colors**: Coral/Red (#EF4444) for anchors, Blue (#3B82F6) for highlights, Purple for modules
- **Typography**: Inter (sans-serif), Playfair Display (serif for headers)
- **Imagery**: Forest/nature backgrounds, ocean waves, calming gradients
- **Effects**: Soft glows, subtle gradients, rounded corners (2-3rem)

### Layout Patterns
- **Cards**: Glass-morphism effect with borders, rounded corners
- **Buttons**: Large, pill-shaped with icons
- **Icons**: Material Icons Rounded / Material Symbols Outlined
- **Navigation**: Bottom tab bar with floating center anchor button

### Key Modules
1. **Home Screen**: Greeting, mood check-in, recommended content, quote
2. **Daily Check-in**: Emotional sliders, inner currents, capacity meter
3. **Therapeutic Journey**: Module cards with progress tracking
4. **Memory Vault**: Collections grid, anniversary mode
5. **Grief Work**: Quadrant view, processing tools

## Implementation Plan

### Phase 1: Theme System Update

#### 1.1 Color Palette Enhancement
- [ ] Update `src/theme/index.ts` with new color system
- [ ] Add gradient utilities
- [ ] Add glow effects
- [ ] Implement dark/light mode toggle

#### 1.2 Typography System
- [ ] Add Playfair Display for serif headings
- [ ] Update Inter to DM Sans
- [ ] Create typography scale (display, heading, body, caption)

#### 1.3 Component Styling
- [ ] Create GlassCard component with blur effect
- [ ] Create GradientButton component
- [ ] Create MoodIcon component with glow effects
- [ ] Create ProgressRing component

### Phase 2: Screen Redesigns

#### 2.1 Home Screen (DashboardScreen)
- [ ] Add personalized greeting with time of day
- [ ] Redesign mood check-in with gradient icons
- [ ] Add "Recommended for You" section
- [ ] Add inspirational quote section
- [ ] Add program introduction cards
- [ ] Implement forest/nature background

#### 2.2 Daily Check-in (CheckInScreen)
- [ ] Add emotional slider with gradient track
- [ ] Create inner currents selector (circular cards)
- [ ] Add emotional capacity meter
- [ ] Implement smooth animations
- [ ] Add "Navigating the Waters Within" header

#### 2.3 Therapeutic Journey (SessionsScreen)
- [ ] Redesign module cards with progress
- [ ] Add stage indicators (Sapling, Raw Edge, Messy Middle)
- [ ] Create lock/unlock states
- [ ] Add resume/locked badges
- [ ] Implement lesson counter (LESSON X OF Y)

#### 2.4 Memory Vault (VaultScreen)
- [ ] Create collections grid with images
- [ ] Add anniversary mode toggle
- [ ] Add crafting plan section
- [ ] Create "What trait lives in you?" prompt
- [ ] Add entry counters

#### 2.5 Grief Work (ModuleDetailScreen)
- [ ] Implement quadrant view
- [ ] Add emotional capacity slider
- [ ] Create processing tool cards
- [ ] Add daily reflection button
- [ ] Add background imagery

#### 2.6 New Screens to Create
- [ ] Inner Currents Selector
- [ ] Emotional Capacity Tuner
- [ ] Processing Guilt Tool
- [ ] Unsent Letter Writer
- [ ] Anniversary Tracker

### Phase 3: Component Library

#### 3.1 Navigation Components
- [ ] Redesign bottom tab bar
- [ ] Create floating anchor button with glow
- [ ] Add navigation animations

#### 3.2 Content Components
- [ ] Audio content card with play button
- [ ] Collection card with image preview
- [ ] Module card with progress indicator
- [ ] Quote card with italic text
- [ ] Section headers with "View All" links

#### 3.3 Interactive Components
- [ ] Slider with gradient track
- [ ] Toggle switch with glow
- [ ] Circular selector cards
- [ ] Progress rings
- [ ] Animated buttons

### Phase 4: Modules & Content

#### 4.1 Grief Stages Module
- [ ] Denial stage activity screen
- [ ] Anger stage activity screen
- [ ] Bargaining stage activity screen
- [ ] Depression stage activity screen
- [ ] Acceptance stage activity screen

#### 4.2 Therapeutic Modules
- [ ] Imperfect Parent Parts Map
- [ ] New Roles Quadrant View
- [ ] Life Tasks Quadrant View
- [ ] Dual Process Model Journey
- [ ] Grief Rites Activities

#### 4.3 Support Modules
- [ ] The Anchor (SOS Support)
- [ ] Storm Letter Incineration
- [ ] Grief Work Quadrant

### Phase 5: Animations & Interactions

#### 5.1 Micro-interactions
- [ ] Button hover/press effects
- [ ] Card hover lifts
- [ ] Icon scale on press
- [ ] Smooth page transitions

#### 5.2 Animations
- [ ] Mood icon glow pulsing
- [ ] Progress bar filling
- [ ] Fade-in animations for content
- [ ] Slide transitions between screens

#### 5.3 Background Effects
- [ ] Misty forest background
- [ ] Ocean wave animations
- [ ] Particle effects
- [ ] Gradient overlays

### Phase 6: Assets & Resources

#### 6.1 Images
- [ ] Source forest/nature backgrounds
- [ ] Ocean wave imagery
- [ ] Collection preview images
- [ ] Module icons

#### 6.2 Icons
- [ ] Material Icons Rounded
- [ ] Material Symbols Outlined
- [ ] Custom anchor icon
- [ ] Weather icons

#### 6.3 Fonts
- [ ] Install Playfair Display
- [ ] Install DM Sans
- [ ] Configure font families

### Phase 7: Responsive Design

#### 7.1 Mobile Optimization
- [ ] Ensure all screens work on mobile
- [ ] Test on different screen sizes
- [ ] Optimize touch targets

#### 7.2 Web Adaptation
- [ ] Ensure responsive layouts
- [ ] Test on desktop browsers
- [ ] Optimize for larger screens

## Priority Order

### High Priority (Core Experience)
1. Theme system update
2. Home screen redesign
3. Daily check-in redesign
4. Bottom navigation redesign
5. Mood components

### Medium Priority (Feature Screens)
6. Therapeutic journey redesign
7. Memory vault redesign
8. Grief work quadrant view
9. Component library

### Low Priority (Enhancements)
10. Animations
11. Background effects
12. Advanced modules
13. Web optimization

## Design Tokens Reference

### Colors
```javascript
background: {
  dark: '#11161F',
  card: '#1C2333',
  surface: '#162030',
  light: '#f6f6f8'
}

accent: {
  coral: '#EF4444',
  blue: '#3B82F6',
  purple: '#8B5CF6',
  green: '#4CAF50'
}

gradient: {
  stormy: ['#374151', '#1F2937'],
  rainy: ['#2563EB', '#1D4ED8'],
  cloudy: ['#64748B', '#475569'],
  partly: ['#D4A373', '#A98467'],
  sunny: ['#FBBF24', '#F59E0B']
}
```

### Typography
```javascript
fontFamily: {
  display: 'Inter',
  serif: 'Playfair Display',
  body: 'DM Sans'
}

fontSize: {
  display: ['3.5rem', '3rem', '2.5rem'],
  heading: ['2rem', '1.75rem', '1.5rem'],
  body: ['1rem', '0.9rem', '0.875rem'],
  caption: ['0.75rem', '0.688rem', '0.625rem']
}
```

### Spacing
```javascript
spacing: {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '3rem'
}
```

### Border Radius
```javascript
borderRadius: {
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  full: '9999px'
}
```

## Success Criteria

- ✅ All screens match the Stitch design reference
- ✅ Dark theme is consistently applied
- ✅ Animations are smooth and purposeful
- ✅ Typography is hierarchical and readable
- ✅ Colors are accessible and harmonious
- ✅ Component library is reusable
- ✅ Responsive design works on all devices
- ✅ Performance is optimized

## Notes

- Focus on the "gentle" and "supportive" aesthetic
- Use nature imagery to create calming atmosphere
- Ensure accessibility (WCAG AA compliance)
- Keep animations subtle, not overwhelming
- Prioritize user emotional wellbeing
- Test with real users when possible