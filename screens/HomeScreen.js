import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';

// Starter data to showcase how the planner is structured
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

export default function HomeScreen({
  navigation,
  trips: externalTrips,
  setTrips: setExternalTrips,
  selectedTripId: externalSelectedTripId,
  setSelectedTripId: setExternalSelectedTripId,
}) {
  // Allow Home to run standalone (internal state) or controlled by parent (props)
  const [internalTrips, setInternalTrips] = useState(seedTrips);
  const [internalSelectedTripId, setInternalSelectedTripId] = useState(seedTrips[0]?.id ?? null);
  const trips = externalTrips ?? internalTrips;
  const setTrips = setExternalTrips ?? setInternalTrips;
  const selectedTripId = externalSelectedTripId ?? internalSelectedTripId;
  const setSelectedTripId = setExternalSelectedTripId ?? setInternalSelectedTripId;

  // Local UI state for edits and quick adds (trips, itinerary, packing, budget)
  const [tripName, setTripName] = useState('');
  const [tripDates, setTripDates] = useState('');
  const [editingTripId, setEditingTripId] = useState(null);
  const [itineraryEntry, setItineraryEntry] = useState('');
  const [packingEntry, setPackingEntry] = useState('');
  const [expense, setExpense] = useState('');

  // Current trip reference derived from selection
  const selectedTrip = useMemo(
    () => trips.find((trip) => trip.id === selectedTripId) || trips[0],
    [selectedTripId, trips]
  );

  // Create or update a trip from the inline controls
  const handleSaveTrip = () => {
    if (!tripName.trim()) {
      return;
    }

    if (editingTripId) {
      setTrips((prev) =>
        prev.map((trip) =>
          trip.id === editingTripId ? { ...trip, name: tripName.trim(), dates: tripDates.trim() } : trip
        )
      );
      setEditingTripId(null);
    } else {
      const id = Date.now().toString();
      const newTrip = {
        id,
        name: tripName.trim(),
        dates: tripDates.trim() || 'Dates TBD',
        budget: 0,
        spent: 0,
        itinerary: [],
        packing: [],
      };
      setTrips((prev) => [newTrip, ...prev]);
      setSelectedTripId(id);
    }

    setTripName('');
    setTripDates('');
  };

  // Load existing trip data into inline inputs
  const handleEditTrip = (trip) => {
    setTripName(trip.name);
    setTripDates(trip.dates);
    setEditingTripId(trip.id);
    setSelectedTripId(trip.id);
  };

  // Remove a trip and reset selection if needed
  const handleDeleteTrip = (id) => {
    if (editingTripId === id) {
      setEditingTripId(null);
      setTripName('');
      setTripDates('');
    }

    setTrips((prev) => {
      const updated = prev.filter((trip) => trip.id !== id);
      if (selectedTripId === id) {
        setSelectedTripId(updated[0]?.id ?? null);
      }
      return updated;
    });
  };

  // Append an itinerary line item to the selected trip
  const handleAddItinerary = () => {
    if (!itineraryEntry.trim() || !selectedTrip) {
      return;
    }

    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === selectedTrip.id
          ? { ...trip, itinerary: [...trip.itinerary, itineraryEntry.trim()] }
          : trip
      )
    );
    setItineraryEntry('');
  };

  // Append a packing item to the selected trip
  const handleAddPacking = () => {
    if (!packingEntry.trim() || !selectedTrip) {
      return;
    }

    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === selectedTrip.id
          ? { ...trip, packing: [...trip.packing, { label: packingEntry.trim(), done: false }] }
          : trip
      )
    );
    setPackingEntry('');
  };

  // Toggle completion state for a packing item
  const togglePackingItem = (label) => {
    if (!selectedTrip) {
      return;
    }

    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === selectedTrip.id
          ? {
              ...trip,
              packing: trip.packing.map((item) =>
                item.label === label ? { ...item, done: !item.done } : item
              ),
            }
          : trip
      )
    );
  };

  // Add an expense value to the selected trip
  const handleAddExpense = () => {
    if (!selectedTrip) {
      return;
    }
    const numericExpense = Number(expense);
    if (Number.isNaN(numericExpense) || numericExpense <= 0) {
      return;
    }

    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === selectedTrip.id ? { ...trip, spent: trip.spent + numericExpense } : trip
      )
    );
    setExpense('');
  };

  // Update the total budget for the selected trip
  const updateBudget = (amount) => {
    if (!selectedTrip) {
      return;
    }
    const numericBudget = Number(amount);
    if (Number.isNaN(numericBudget) || numericBudget < 0) {
      return;
    }

    setTrips((prev) =>
      prev.map((trip) => (trip.id === selectedTrip.id ? { ...trip, budget: numericBudget } : trip))
    );
  };

  const goToTrips = () => {
    if (navigation?.navigate) {
      navigation.navigate('Trips');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Travel Planner</Text>
        <Text style={styles.title}>Plot your next escape</Text>
        <Text style={styles.subtitle}>
          Add trips, sketch daily plans, track spending, and keep your packing list tight.
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming trips</Text>
          <View style={styles.sectionHeaderRight}>
            <TouchableOpacity style={styles.linkButton} onPress={goToTrips} disabled={!navigation}>
              <Text style={styles.linkText}>View all</Text>
            </TouchableOpacity>
            <View style={styles.pill}>
              <Text style={styles.pillText}>{trips.length} planned</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>{editingTripId ? 'Edit trip' : 'Add a new trip'}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Destination or trip name"
              value={tripName}
              onChangeText={setTripName}
              placeholderTextColor="#9aa0a6"
            />
            <TextInput
              style={styles.input}
              placeholder="Dates (e.g. Jan 5 - Jan 9)"
              value={tripDates}
              onChangeText={setTripDates}
              placeholderTextColor="#9aa0a6"
            />
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={handleSaveTrip}>
            <Text style={styles.primaryButtonText}>{editingTripId ? 'Save changes' : 'Add trip'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tripList}>
          {trips.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              style={[styles.tripCard, selectedTrip?.id === trip.id && styles.tripCardActive]}
              onPress={() => setSelectedTripId(trip.id)}
              activeOpacity={0.8}
            >
              <View style={styles.tripInfo}>
                <Text style={styles.tripName}>{trip.name}</Text>
                <Text style={styles.tripDates}>{trip.dates || 'Dates TBD'}</Text>
                <Text style={styles.tripMeta}>
                  Budget {trip.budget ? `$${trip.budget}` : 'TBD'} | Spent ${trip.spent}
                </Text>
              </View>
              <View style={styles.tripActions}>
                <TouchableOpacity onPress={() => handleEditTrip(trip)} style={styles.linkButton}>
                  <Text style={styles.linkText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteTrip(trip.id)} style={styles.linkButton}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {selectedTrip ? (
        <>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Daily itinerary</Text>
              <View style={styles.pillMuted}>
                <Text style={styles.pillMutedText}>{selectedTrip.itinerary.length} items</Text>
              </View>
            </View>
            <View style={styles.card}>
              {selectedTrip.itinerary.length === 0 ? (
                <Text style={styles.emptyText}>No plans yet. Add your first stop.</Text>
              ) : (
                selectedTrip.itinerary.map((item, index) => (
                  <View key={`${item}-${index}`} style={styles.row}>
                    <Text style={styles.rowDot}>-</Text>
                    <Text style={styles.rowText}>{item}</Text>
                  </View>
                ))
              )}
              <View style={styles.inlineForm}>
                <TextInput
                  style={[styles.input, styles.flexOne]}
                  placeholder="Add a stop, time, or reminder"
                  value={itineraryEntry}
                  onChangeText={setItineraryEntry}
                  placeholderTextColor="#9aa0a6"
                />
                <TouchableOpacity style={styles.secondaryButton} onPress={handleAddItinerary}>
                  <Text style={styles.secondaryButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Budget tracker</Text>
              <View style={styles.pillMuted}>
                <Text style={styles.pillMutedText}>
                  ${Math.max(selectedTrip.budget - selectedTrip.spent, 0)} left
                </Text>
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.budgetRow}>
                <Text style={styles.metricLabel}>Budget</Text>
                <TextInput
                  style={[styles.input, styles.budgetInput]}
                  placeholder="$0"
                  keyboardType="numeric"
                  value={selectedTrip.budget ? String(selectedTrip.budget) : ''}
                  onChangeText={updateBudget}
                  placeholderTextColor="#9aa0a6"
                />
              </View>
              <View style={styles.budgetRow}>
                <Text style={styles.metricLabel}>Spent</Text>
                <Text style={styles.metricValue}>${selectedTrip.spent.toFixed(2)}</Text>
              </View>
              <View style={styles.inlineForm}>
                <TextInput
                  style={[styles.input, styles.flexOne]}
                  placeholder="Log expense (number only)"
                  keyboardType="numeric"
                  value={expense}
                  onChangeText={setExpense}
                  placeholderTextColor="#9aa0a6"
                />
                <TouchableOpacity style={styles.secondaryButton} onPress={handleAddExpense}>
                  <Text style={styles.secondaryButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Packing checklist</Text>
              <View style={styles.pillMuted}>
                <Text style={styles.pillMutedText}>
                  {selectedTrip.packing.filter((item) => item.done).length}/{selectedTrip.packing.length} ready
                </Text>
              </View>
            </View>
            <View style={styles.card}>
              {selectedTrip.packing.length === 0 ? (
                <Text style={styles.emptyText}>Start a checklist so nothing is forgotten.</Text>
              ) : (
                selectedTrip.packing.map((item) => (
                  <TouchableOpacity
                    key={item.label}
                    style={[styles.packingItem, item.done && styles.packingItemDone]}
                    onPress={() => togglePackingItem(item.label)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.checkbox, item.done && styles.checkboxChecked]}>
                      {item.done ? <Text style={styles.checkboxTick}>X</Text> : null}
                    </View>
                    <Text style={[styles.packingLabel, item.done && styles.packingLabelDone]}>{item.label}</Text>
                  </TouchableOpacity>
                ))
              )}

              <View style={styles.inlineForm}>
                <TextInput
                  style={[styles.input, styles.flexOne]}
                  placeholder="Add packing item"
                  value={packingEntry}
                  onChangeText={setPackingEntry}
                  placeholderTextColor="#9aa0a6"
                />
                <TouchableOpacity style={styles.secondaryButton} onPress={handleAddPacking}>
                  <Text style={styles.secondaryButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.section}>
          <Text style={styles.emptyText}>Add your first trip to start planning.</Text>
        </View>
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
  },
  hero: {
    backgroundColor: '#0f1f3d',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e335a',
    marginBottom: 18,
  },
  eyebrow: {
    color: '#6fb1ff',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#f5f7fb',
    marginTop: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#c7d3e8',
    marginTop: 6,
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f2f5fb',
  },
  pill: {
    backgroundColor: '#1f80ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: {
    color: '#eaf3ff',
    fontWeight: '700',
  },
  pillMuted: {
    backgroundColor: '#13243f',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#213556',
  },
  pillMutedText: {
    color: '#c7d3e8',
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#111c33',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e335a',
    gap: 12,
  },
  cardLabel: {
    color: '#c7d3e8',
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    backgroundColor: '#0a1427',
    borderWidth: 1,
    borderColor: '#1f355b',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#f5f7fb',
    flex: 1,
    fontSize: 15,
  },
  primaryButton: {
    backgroundColor: '#1f80ff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#eaf3ff',
    fontWeight: '800',
    fontSize: 16,
  },
  tripList: {
    marginTop: 12,
    gap: 12,
  },
  tripCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#0f1f3d',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e335a',
  },
  tripCardActive: {
    borderColor: '#50c2ff',
    shadowColor: '#50c2ff',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  tripInfo: {
    flex: 1,
    gap: 4,
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
  tripActions: {
    flexDirection: 'row',
    gap: 12,
    marginLeft: 12,
  },
  linkButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#122547',
    borderWidth: 1,
    borderColor: '#1f355b',
  },
  linkText: {
    color: '#70c0ff',
    fontWeight: '700',
  },
  deleteText: {
    color: '#ff8699',
    fontWeight: '700',
  },
  emptyText: {
    color: '#7aa0d6',
  },
  inlineForm: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  secondaryButton: {
    backgroundColor: '#13274a',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f355b',
  },
  secondaryButtonText: {
    color: '#eaf3ff',
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  rowDot: {
    color: '#70c0ff',
    fontSize: 18,
    lineHeight: 20,
  },
  rowText: {
    color: '#f5f7fb',
    flex: 1,
    fontSize: 15,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  metricLabel: {
    color: '#c7d3e8',
    fontWeight: '700',
  },
  metricValue: {
    color: '#f5f7fb',
    fontWeight: '800',
    fontSize: 16,
  },
  budgetInput: {
    width: 120,
    textAlign: 'right',
  },
  packingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  packingItemDone: {
    opacity: 0.7,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1f80ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1f80ff',
  },
  checkboxTick: {
    color: '#0a1427',
    fontWeight: '900',
  },
  packingLabel: {
    color: '#f5f7fb',
    fontSize: 15,
  },
  packingLabelDone: {
    textDecorationLine: 'line-through',
    color: '#7aa0d6',
  },
  flexOne: {
    flex: 1,
  },
});
