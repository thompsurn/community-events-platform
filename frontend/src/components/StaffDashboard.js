import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StaffDashboard() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    price: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load events.');
      }
    };

    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({
      ...prev,
      [name]: name === 'price' ? (value === '' ? '' : parseFloat(value)) : value,
    }));
  };

  const handleCreateEvent = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/events', newEvent);
      setEvents((prev) => [...prev, response.data]); // Update the list of events
      setSuccessMessage('Event created successfully!');
      setNewEvent({ title: '', description: '', date: '', location: '', price: 0 }); // Clear the form
    } catch (err) {
      console.error(err);
      setError('Failed to create event.');
    }
  };

  return (
    <div style={styles.container}>
      <h1>Staff Dashboard</h1>
      <p>Welcome! Here you can manage your events.</p>

      {error && <p style={styles.error}>{error}</p>}
      {successMessage && <p style={styles.success}>{successMessage}</p>}

      {/* Form to Create New Event */}
      <div style={styles.form}>
        <h3>Create a New Event</h3>
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={newEvent.title}
          onChange={handleInputChange}
          style={styles.input}
        />
        <input
          type="text"
          name="description"
          placeholder="Event Description"
          value={newEvent.description}
          onChange={handleInputChange}
          style={styles.input}
        />
        <input
          type="date"
          name="date"
          value={newEvent.date}
          onChange={handleInputChange}
          style={styles.input}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={newEvent.location}
          onChange={handleInputChange}
          style={styles.input}
        />
        <input
          type="number"
          name="price"
          placeholder="Price (£)"
          value={newEvent.price}
          onChange={handleInputChange}
          style={styles.input}
        />
        <button onClick={handleCreateEvent} style={styles.button}>
          Create Event
        </button>
      </div>

      {/* List of Events */}
      <ul style={styles.eventList}>
        {events.map((event) => (
          <li key={event.id} style={styles.eventItem}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>Date: {event.date}</p>
            <p>Location: {event.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: { textAlign: 'center', marginTop: '30px' },
  error: { color: 'red' },
  success: { color: 'green' },
  form: { textAlign: 'left', display: 'inline-block', marginBottom: '30px' },
  input: { display: 'block', margin: '10px 0', padding: '10px', width: '100%' },
  button: { margin: '10px 0', padding: '10px 20px', cursor: 'pointer' },
  eventList: { listStyleType: 'none', padding: 0 },
  eventItem: { marginBottom: '20px', padding: '10px', border: '1px solid #ccc' },
};

export default StaffDashboard;
