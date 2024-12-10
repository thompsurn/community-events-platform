import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Replace with your backend's base URL
});

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch events
export const fetchEvents = async () => {
  const response = await API.get('/events');
  return response.data;
};

// Fetch saved events
export const fetchSavedEvents = async (userId) => {
  const response = await API.get(`/users/${userId}/saved-events`);
  return response.data;
};

// Save event
export const saveEvent = async (userId, eventId) => {
  const response = await API.post(`/users/${userId}/saved-events`, { eventId });
  return response.data;
};

// Remove saved event
export const removeSavedEvent = async (userId, eventId) => {
  const response = await API.delete(`/users/${userId}/saved-events/${eventId}`);
  return response.data;
};

// Staff login
export const staffLogin = async (username, password) => {
  const response = await API.post('/staff/login', { username, password });
  return response.data;
};

export default API;
