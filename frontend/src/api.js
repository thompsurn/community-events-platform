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
  const token = localStorage.getItem('token'); // Get the JWT token
  if (!token) {
    throw new Error('No token found');
  }

  return axios.get(`http://localhost:5000/api/users/${userId}/saved-events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};




// API Function for Saving Events
export const saveEvent = async (userId, eventId) => {
  const token = localStorage.getItem('token'); // Get token from localStorage
  if (!token) {
    throw new Error('No token found'); // Ensure a token exists
  }

  try {
    const response = await API.post(
      `/users/${userId}/saved-events`, // Correctly use the baseURL from Axios instance
      { eventId },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token in the Authorization header
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error saving event:', error.response || error.message);
    throw error;
  }
};

// API Function for Removing a Saved Event
export const removeSavedEvent = async (userId, eventId) => {
  const token = localStorage.getItem('token'); // Get token from localStorage
  if (!token) {
    throw new Error('No token found'); // Ensure a token exists
  }

  return axios.delete(`http://localhost:5000/api/users/${userId}/saved-events/${eventId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Add the token in the Authorization header
    },
  });
};



  

// Export the Axios instance (optional, for advanced use cases)
export default API;
