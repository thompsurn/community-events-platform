import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Fetch all events
export const fetchEvents = async () => {
  try {
    const response = await API.get('/events');
    console.log('Fetched Events:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error.message);
    throw error;
  }
};

// Fetch saved events for a user
export const fetchSavedEvents = async (userId) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  try {
    const response = await API.get(`/users/${userId}/saved-events`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching saved events:', error.message);
    throw error;
  }
};

// API Function for Saving Events
export const saveEvent = async (userId, eventId) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  try {
    const response = await API.post(
      `/users/${userId}/saved-events`,
      { eventId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error saving event:', error.message);
    throw error;
  }
};

// API Function for Removing a Saved Event
export const removeSavedEvent = async (userId, eventId) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  try {
    const response = await API.delete(`/users/${userId}/saved-events/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing saved event:', error.message);
    throw error;
  }
};

// API Function for Staff Login
export const staffLogin = async (username, password) => {
  console.log('Attempting login with:', { username, password });
  try {
    const response = await API.post('/staff/login', { username, password });
    console.log('Login response from server:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during staff login:', error.message);
    throw error;
  }
};

export default API;
