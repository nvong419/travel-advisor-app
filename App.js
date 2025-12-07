import React, { useMemo, useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import TripsScreen from './screens/TripsScreen';

// Starter data so the UI has examples on first load
const seedTrips = [
  {
    id: '1',
    name: 'Lisbon Weekend',
    dates: 'Jan 12 - Jan 15',
    budget: 1200,
    spent: 450,
    itinerary: ['Tram 28 ride + Alfama walk', 'Time Out Market lunch', 'Sunset at Miradouro da Graca'],
    packing: [
      { label: 'Passport', done: true },
      { label: 'Universal adapter', done: false },
      { label: 'Walking shoes', done: false },
    ],
  },
  {
    id: '2',
    name: 'Kyoto + Osaka',
    dates: 'Mar 3 - Mar 11',
    budget: 2400,
    spent: 0,
    itinerary: ['Arrival + Nishiki Market', 'Arashiyama morning', 'Day trip to Osaka'],
    packing: [
      { label: 'JR Pass', done: false },
      { label: 'Camera batteries', done: false },
      { label: 'Light rain jacket', done: false },
    ],
  },
];

export default function App() {
  const [trips, setTrips] = useState(seedTrips);
  const [selectedTripId, setSelectedTripId] = useState(seedTrips[0]?.id ?? null);
  const [screen, setScreen] = useState('Home'); // lightweight navigation

  // Minimal navigate helper passed into screens
  const navigation = useMemo(
    () => ({
      navigate: (routeName) => setScreen(routeName),
    }),
    []
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      {screen === 'Home' ? (
        <HomeScreen
          navigation={navigation}
          trips={trips}
          setTrips={setTrips}
          selectedTripId={selectedTripId}
          setSelectedTripId={setSelectedTripId}
        />
      ) : (
        <TripsScreen
          navigation={navigation}
          trips={trips}
          onSelect={(id) => {
            setSelectedTripId(id);
            setScreen('Home');
          }}
        />
      )}
    </SafeAreaView>
  );
}
