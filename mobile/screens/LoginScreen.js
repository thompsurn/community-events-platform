import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext'; // Import AuthContext
import GlobalStyles from '../styles/GlobalStyles';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // Not used for MVP
  const { login } = useAuth();
  const navigation = useNavigation();

  const handleLogin = () => {
    // Call the hardcoded login function
    login(username);

    // Redirect to the HomeScreen
    navigation.navigate('HomeScreen');
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Login</Text>
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
      <TouchableOpacity style={GlobalStyles.button} onPress={handleLogin}>
        <Text style={GlobalStyles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
