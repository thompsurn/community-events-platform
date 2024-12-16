import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const SignUpButton = ({ eventId }) => {
  const { user } = useAuth(); // Get the logged-in user from AuthContext
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!user || !user.id || !user.token) {
      setMessage('You need to be logged in to save an event.');
      return;
    }
  
    try {
      const response = await fetch(`http://community-events-platform-production.up.railway.app/api/users/${user.id}/saved-events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ eventId: event.id }),
      });
  
      if (response.ok) {
        setMessage('Event successfully added to your saved events page!');
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || 'Failed to save the event.');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      setMessage('An error occurred while saving the event.');
    }
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'Sign Up!'}</Text>
      </TouchableOpacity>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
    color: 'green',
  },
});

export default SignUpButton;
