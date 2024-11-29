import axios from 'axios';

// Create an Axios instance with the base URL of your backend
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Replace with your backend's base URL
});

// Fetch all events
export const fetchEvents = async () => {
    try {
      const response = await API.get('/events');
      console.log('Fetched Events:', response.data); // Log the response
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  };

// Fetch saved events for a user
export const fetchSavedEvents = async (userId) => {
  const response = await API.get(`/users/${userId}/saved-events`);
  return response.data;
};


// API Function for Saving Events
export const saveEvent = async (userId, eventId) => {
  const response = await API.post(`/users/${userId}/saved-events`, { eventId });
  return response.data;
};

  

// Export the Axios instance (optional, for advanced use cases)
export default API;
