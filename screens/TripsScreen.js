import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// Simple list view for all trips; reads shared state and can notify selection.
export default function TripsScreen({ trips = [], onSelect }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Trips</Text>
      {trips.length === 0 ? (
        <Text style={styles.empty}>No trips yet. Add one from Home.</Text>
      ) : (
        trips.map((trip) => (
          <View key={trip.id} style={styles.tripCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.tripName}>{trip.name}</Text>
              <Text style={styles.tripDates}>{trip.dates || 'Dates TBD'}</Text>
              <Text style={styles.tripMeta}>
                Budget {trip.budget ? `$${trip.budget}` : 'TBD'} | Spent ${trip.spent}
              </Text>
            </View>
            {onSelect ? (
              <Text style={styles.link} onPress={() => onSelect(trip.id)}>
                Open
              </Text>
            ) : null}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1427',
  },
  content: {
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#f5f7fb',
    marginBottom: 8,
  },
  empty: {
    color: '#7aa0d6',
  },
  tripCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#0f1f3d',
    borderWidth: 1,
    borderColor: '#1e335a',
  },
  tripName: {
    color: '#f5f7fb',
    fontWeight: '800',
    fontSize: 16,
  },
  tripDates: {
    color: '#c7d3e8',
  },
  tripMeta: {
    color: '#7aa0d6',
    fontSize: 12,
  },
  link: {
    color: '#70c0ff',
    fontWeight: '700',
  },
});
