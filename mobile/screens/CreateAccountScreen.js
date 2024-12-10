import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GlobalStyles from '../styles/GlobalStyles';
import { useAuth } from '../contexts/AuthContext';
import API from '../utils/api';

const CreateAccountScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();
  const { login } = useAuth(); // Access the login function from AuthContext

  const handleCreateAccount = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
  
    try {
      console.log('Sending payload:', { username, password }); // Log the payload
      const response = await API.post('/create-account', { username, password });
      const { token } = response.data;
      login(token); // Save the token and authenticate the user
      navigation.navigate('HomeScreen'); // Navigate to the HomeScreen
    } catch (err) {
      console.error('Error creating account:', err.response?.data || err.message); // Log the backend response
      Alert.alert('Error', err.response?.data?.error || 'Failed to create account. Please try again.');
    }
  };
  

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Create Account</Text>
      <TextInput
        style={GlobalStyles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={GlobalStyles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={GlobalStyles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={GlobalStyles.button} onPress={handleCreateAccount}>
        <Text style={GlobalStyles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateAccountScreen;
