# Deployment Guide - Roots & Tides

This guide covers deploying the Roots & Tides grief support application for both mobile (Expo) and web platforms.

## Table of Contents
- [Mobile Deployment (Expo)](#mobile-deployment-expo)
- [Web Deployment (Vercel)](#web-deployment-vercel)
- [Environment Variables](#environment-variables)
- [Continuous Deployment](#continuous-deployment)

---

## Mobile Deployment (Expo)

### Prerequisites
- Node.js 18+ installed
- Expo CLI installed: `npm install -g expo-cli`
- Expo account (create at [expo.dev](https://expo.dev))
- For iOS: Mac computer with Xcode
- For Android: Android Studio with SDK

### Development Build

1. **Start the development server:**
   ```bash
   npm start
   ```

2. **Run on device/simulator:**
   ```bash
   # iOS Simulator
   npm run ios

   # Android Emulator
   npm run android

   # Scan QR code with Expo Go app
   npm start
   ```

### Building for Production

#### Using EAS Build (Recommended)

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   eas login
   ```

2. **Configure EAS:**
   ```bash
   eas build:configure
   ```

3. **Build for iOS:**
   ```bash
   eas build --platform ios
   ```

4. **Build for Android:**
   ```bash
   eas build --platform android
   ```

5. **Build for both platforms:**
   ```bash
   eas build --platform all
   ```

#### Using Classic Expo Build

```bash
# iOS
expo build:ios

# Android
expo build:android
```

### Submitting to App Stores

#### iOS App Store

1. **Create Apple Developer account** at [developer.apple.com](https://developer.apple.com)

2. **Configure Bundle ID** in app.json:
   ```json
   "ios": {
     "bundleIdentifier": "com.yourcompany.rootsandtides"
   }
   ```

3. **Build and submit:**
   ```bash
   eas build --platform ios --profile production
   eas submit --platform ios
   ```

#### Android Play Store

1. **Create Google Play Developer account** at [play.google.com](https://play.google.com)

2. **Configure Package Name** in app.json:
   ```json
   "android": {
     "package": "com.yourcompany.rootsandtides"
   }
   ```

3. **Build and submit:**
   ```bash
   eas build --platform android --profile production
   eas submit --platform android
   ```

---

## Web Deployment (Vercel)

### Prerequisites
- Vercel account (create at [vercel.com](https://vercel.com))
- GitHub repository connected to Vercel

### Manual Deployment

1. **Build the web app:**
   ```bash
   npm run web
   ```

2. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Follow the prompts** to configure your deployment

### Automatic Deployment (Recommended)

1. **Push your code** to GitHub

2. **Import project** in Vercel:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Configure build settings:
     - **Framework Preset:** Other
     - **Build Command:** `npx expo export:web`
     - **Output Directory:** `dist`

3. **Deploy!** Vercel will automatically deploy on every push

### Environment Variables

Add these in Vercel dashboard under Settings > Environment Variables:

```env
EXPO_PUBLIC_API_URL=your_api_url
EXPO_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### Custom Domain

1. Go to project Settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

---

## Environment Variables

### Required Variables

Create a `.env` file in the project root:

```env
# API Configuration
EXPO_PUBLIC_API_URL=https://api.rootsandtides.com

# Analytics
EXPO_PUBLIC_ANALYTICS_ID=G-XXXXXXXXXX

# Feature Flags
EXPO_PUBLIC_ENABLE_THERAPIST_FEATURES=true
EXPO_PUBLIC_ENABLE_DAILY_PROMPTS=true
```

### Local Development

```bash
# Install dotenv
npm install dotenv

# Create .env.local for local overrides
cp .env .env.local
```

---

## Continuous Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test

  deploy-web:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### EAS Build Automation

Configure automatic builds on git push in `eas.json`:

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## Performance Optimization

### Web Optimization

1. **Enable compression** in Vercel settings
2. **Use CDN** for static assets
3. **Optimize images** before deployment
4. **Enable caching** for API responses

### Mobile Optimization

1. **Use EAS Build cache** for faster builds
2. **Optimize bundle size** with code splitting
3. **Enable Hermes** for Android:
   ```json
   "android": {
     "jsEngine": "hermes"
   }
   ```

---

## Monitoring & Analytics

### Firebase Analytics

1. Install Firebase:
   ```bash
   npm install @react-native-firebase/app
   ```

2. Configure in `firebaseConfig.js`

3. Track events:
   ```javascript
   analytics().logEvent('daily_prompt_completed');
   ```

### Sentry Error Tracking

1. Install Sentry:
   ```bash
   npm install @sentry/react-native
   ```

2. Configure in `app.js`:
   ```javascript
   import * as Sentry from '@sentry/react-native';
   Sentry.init({
     dsn: 'YOUR_DSN',
   });
   ```

---

## Troubleshooting

### Common Issues

**Build fails with "Module not found"**
- Clear cache: `rm -rf node_modules && npm install`
- Reset Metro bundler: `npx expo start -c`

**Web deployment shows blank screen**
- Check console for errors
- Verify all assets are properly imported
- Ensure web-specific polyfills are configured

**App Store rejection**
- Review App Store Review Guidelines
- Ensure all required metadata is complete
- Test on physical devices before submission

### Getting Help

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Issues](https://github.com/your-repo/issues)

---

## Security Considerations

1. **Never commit** `.env` files to version control
2. **Use secure storage** for sensitive data (Expo SecureStore)
3. **Enable HTTPS** for all API calls
4. **Implement proper authentication** for therapist connections
5. **Encrypt sensitive data** in transit and at rest
6. **Regular security audits** of dependencies

---

## Maintenance

### Regular Updates

1. **Update dependencies** monthly:
   ```bash
   npm update
   npm audit fix
   ```

2. **Monitor app performance** regularly
3. **Review crash reports** and fix issues
4. **Keep documentation** up to date

### Backup Strategy

1. **Back up user data** regularly (cloud sync)
2. **Export progress reports** before updates
3. **Test backup restore** procedures

---

## Support

For deployment issues, contact:
- Technical Support: tech@rootsandtides.com
- Documentation: docs.rootsandtides.com
- Community: community.rootsandtides.com