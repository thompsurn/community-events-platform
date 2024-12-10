import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import GlobalStyles from '../styles/GlobalStyles';

const StaffLoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    // Add API call for staff login
    Alert.alert('Success', 'Staff logged in');
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Staff Login</Text>
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
      <TouchableOpacity style={GlobalStyles.button}>
        <Text style={GlobalStyles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StaffLoginScreen;
