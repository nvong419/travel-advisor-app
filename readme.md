# Final React Native App

A simple Expo-based travel planner app with a Home dashboard, trip form, and trip list screens.

## Features
- Home dashboard to view and select trips
- Add new trips via a dedicated form (name, dates, budget, itinerary lines, packing items)
- Edit or delete existing trips from Home
- Daily itinerary list with quick add
- Budget tracker with editable budget and expense logging
- Packing checklist with add/toggle completion
- Trips list screen to browse and jump to a trip

## Prerequisites
- Node.js and npm installed
- Expo CLI (runs via `npx expo` so global install is optional)

## Install dependencies
```bash
npm install
```

## Start the app
```bash
npx expo start
```
Then choose a platform:
- Press `a` for Android emulator/device
- Press `i` for iOS simulator (macOS only)
- Press `w` for web

## Navigation packages (already in package.json)
If you need to reinstall navigation deps:
```bash
npm install @react-navigation/native @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
```

## Project structure (key files)
- `App.js` — app entry; sets up navigation and shared trip state
- `screens/HomeScreen.js` — main dashboard for trips, itinerary, budget, packing
- `screens/TripFormScreen.js` — form to add a new trip
- `screens/TripsScreen.js` — list view of all trips

## Tips
- If the metro bundler is stuck, stop it and clear cache: `npx expo start -c`
- Run `npm audit fix` only if you want to address security advisories; not required to run the app
