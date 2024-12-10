import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import GlobalStyles from '../styles/GlobalStyles';
import { useAuth } from '../contexts/AuthContext'; // Access user info from AuthContext
import { useNavigation } from '@react-navigation/native';

const SavedEventsScreen = () => {
  const [savedEvents, setSavedEvents] = useState([]);
  const { user } = useAuth(); // Get logged-in user details
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSavedEvents = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${user.id}/saved-events`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setSavedEvents(data);
        } else {
          console.error('Error fetching saved events:', data.error || data.message);
        }
      } catch (err) {
        console.error('Error fetching saved events:', err);
      }
    };

    fetchSavedEvents();
  }, [user]);

  const handleRemoveEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}/saved-events/${eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setSavedEvents((prev) => prev.filter((event) => event.id !== eventId));
        Alert.alert('Success', 'Event removed successfully');
      } else {
        Alert.alert('Error', data.error || data.message);
      }
    } catch (err) {
      console.error('Error removing event:', err);
      Alert.alert('Error', 'Failed to remove event');
    }
  };

  const handleAddToGoogleCalendar = (event) => {
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${encodeURIComponent(event.date)}/${encodeURIComponent(event.date)}&details=${encodeURIComponent(
      event.description
    )}&location=${encodeURIComponent(event.location)}`;
    Alert.alert('Redirecting', 'Opening Google Calendar...', [
      {
        text: 'OK',
        onPress: () => {
          // You can also use Linking.openURL from react-native to open the URL in a browser
          Linking.openURL(googleCalendarUrl);
        },
      },
    ]);
  };

  if (!savedEvents.length) {
    return (
      <View style={GlobalStyles.container}>
        <Text style={GlobalStyles.text}>No saved events found.</Text>
      </View>
    );
  }

  return (
    <View style={GlobalStyles.pageContainer}>
      <Text style={GlobalStyles.title}>Saved Events</Text>
      <FlatList
        data={savedEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={GlobalStyles.card}>
            <Text style={GlobalStyles.subtitle}>{item.title}</Text>
            <Text style={GlobalStyles.text}>{item.location}</Text>
            <TouchableOpacity
              style={GlobalStyles.button}
              onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
            >
              <Text style={GlobalStyles.buttonText}>View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[GlobalStyles.button, { marginTop: 10 }]}
              onPress={() => handleAddToGoogleCalendar(item)}
            >
              <Text style={GlobalStyles.buttonText}>Add to Google Calendar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[GlobalStyles.button, { marginTop: 10, backgroundColor: 'red' }]}
              onPress={() => handleRemoveEvent(item.id)}
            >
              <Text style={GlobalStyles.buttonText}>Remove Event</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default SavedEventsScreen;
