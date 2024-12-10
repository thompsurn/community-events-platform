import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import GlobalStyles from '../styles/GlobalStyles';

const StaffDashboardScreen = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch staff events
    setEvents([
      { id: 1, title: 'Staff Event 1' },
      { id: 2, title: 'Staff Event 2' },
    ]);
  }, []);

  return (
    <View style={GlobalStyles.pageContainer}>
      <Text style={GlobalStyles.title}>Staff Dashboard</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={GlobalStyles.container}>
            <Text style={GlobalStyles.subtitle}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default StaffDashboardScreen;
