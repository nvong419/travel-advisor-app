# Final React Native App

Simple Expo-based travel planner with a Home dashboard and a Trips list.

## Features
- Home dashboard to view, add, edit, or delete trips
- Daily itinerary list with quick add
- Budget tracker with editable budget and expense logging
- Packing checklist with add/toggle completion
- Trips list screen to browse and jump to a trip
- (TripFormScreen exists but is not wired to the current lightweight navigation)

## Prerequisites
- Node.js and npm installed
- Expo CLI is not required globally; `npx expo` works fine

## Install dependencies
```bash
npm install
```

## Start the app
```bash
npx expo start
```
Then choose a platform in the Expo CLI prompt:
- Press `a` for Android emulator/device
- Press `i` for iOS simulator (macOS only)
- Press `w` for web

## Notes on navigation
- The app currently uses a simple in-app screen toggle (no React Navigation at runtime).
- Navigation packages remain in `package.json` but are not needed for the current build.

## Project structure (key files)
- `App.js` — app entry; manages shared trip state and simple Home/Trips toggle
- `screens/HomeScreen.js` — main dashboard for trips, itinerary, budget, packing
- `screens/TripFormScreen.js` — standalone trip form (not wired into navigation)
- `screens/TripsScreen.js` — list view of all trips

## Tips
- If Metro is stuck, clear cache: `npx expo start -c`
- `npm audit fix` is optional; not required to run the app
