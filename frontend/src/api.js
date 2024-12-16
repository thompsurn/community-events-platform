import axios from 'axios';

// Create an Axios instance with the base URL of your backend
const API = axios.create({
  baseURL: 'http://community-events-platform-production.up.railway.app/api', // Replace with your backend's base URL
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

  return axios.get(`http://community-events-platform-production.up.railway.app/api/users/${userId}/saved-events`, {
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

  return axios.delete(`http:///api/users/${userId}/saved-events/${eventId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Add the token in the Authorization header
    },
  });
};

// API function for staff login
export const staffLogin = async (username, password) => {
  console.log('Attempting login with:', { username, password }); // Debug: Request payload
  try {
    const response = await axios.post('http://community-events-platform-production.up.railway.app/api/staff/login', {
      username,
      password,
    });
    console.log('Login response from server:', response.data); // Debug: Response from server
    return response.data; // Return the server's response (e.g., token)
  } catch (err) {
    console.error('Error during staff login:', err.response || err.message); // Debug: Error details
    throw err; // Rethrow the error for frontend handling
  }
};




  

// Export the Axios instance (optional, for advanced use cases)
export default API;
