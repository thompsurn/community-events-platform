import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import GlobalStyles from '../styles/GlobalStyles';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext'; // Import the useAuth hook

const EventDetailsScreen = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const route = useRoute(); // To access the event ID passed as a parameter
  const { eventId } = route.params;
  const { user } = useAuth(); // Access user context for authentication

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${eventId}`);
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error('Failed to fetch event details:', error);
        setError('Unable to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleSignUp = async () => {
    setMessage('');
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}/saved-events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`, // Include token for authentication
        },
        body: JSON.stringify({ eventId: event.id }),
      });

      if (response.ok) {
        setMessage('Event successfully added to your saved events page!');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save the event.');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      setError('An error occurred while saving the event.');
    }
  };

  if (loading) {
    return (
      <View style={[GlobalStyles.pageContainer, styles.center]}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading event details...</Text>
      </View>
    );
  }

  if (!event || error) {
    return (
      <View style={[GlobalStyles.pageContainer, styles.center]}>
        <Text style={styles.errorText}>{error || 'Failed to load event details.'}</Text>
      </View>
    );
  }

  return (
    <View style={GlobalStyles.pageContainer}>
      <Text style={GlobalStyles.title}>{event.title}</Text>
      <Text style={styles.location}>{event.location}</Text>
      <Text style={styles.description}>{event.description}</Text>
      <Text style={styles.dateLabel}>Date:</Text>
      <Text style={GlobalStyles.text}>{new Date(event.date).toLocaleDateString()}</Text>
      <Text style={styles.dateLabel}>Time:</Text>
      <Text style={GlobalStyles.text}>{event.time || 'To be announced'}</Text>

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign up!</Text>
      </TouchableOpacity>

      {/* Success or Error Message */}
      {message ? <Text style={styles.successMessage}>{message}</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  location: {
    fontSize: 18,
    fontWeight: '500',
    color: '#007BFF',
    marginTop: 8,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginVertical: 12,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  successMessage: {
    marginTop: 20,
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EventDetailsScreen;
