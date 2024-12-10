import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GlobalStyles from '../styles/GlobalStyles';
import { fetchEvents } from '../utils/api';

const HomeScreen = () => {
  const [events, setEvents] = useState([]);
  const navigation = useNavigation(); // Use navigation to handle navigation to details

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };
    loadEvents();
  }, []);

  return (
    <View style={GlobalStyles.pageContainer}>
      <Text style={GlobalStyles.title}>Upcoming Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={GlobalStyles.container}>
            <Text style={GlobalStyles.subtitle}>{item.title}</Text>
            <Text style={GlobalStyles.text}>{item.location}</Text>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
            >
              <Text style={styles.detailsButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  detailsButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  detailsButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
