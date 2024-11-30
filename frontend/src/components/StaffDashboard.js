import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StaffDashboard() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [editingEvent, setEditingEvent] = useState(null); // Track the event being edited
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

  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDateForBackend = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleEditClick = (event) => {
    setEditingEvent({
      ...event,
      date: formatDateForDisplay(event.date), // Format date for display
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingEvent((prev) => ({
      ...prev,
      [name]: name === 'price' ? (value === '' ? '' : parseFloat(value)) : value,
    }));
  };

  const handleUpdateEvent = async () => {
    try {
      const updatedEvent = {
        ...editingEvent,
        date: parseDateForBackend(editingEvent.date), // Parse date back to yyyy-mm-dd
      };
      const response = await axios.patch(
        `http://localhost:5000/api/events/${editingEvent.id}`,
        updatedEvent
      );
      setEvents((prev) =>
        prev.map((event) => (event.id === editingEvent.id ? response.data : event))
      );
      setEditingEvent(null); // Exit editing mode
      setSuccessMessage('Event updated successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to update event.');
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
        await axios.delete(`http://localhost:5000/api/events/${id}`);
        setEvents((prev) => prev.filter((event) => event.id !== id)); // Remove the deleted event from the list
      setSuccessMessage('Event deleted successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to delete event.');
    }
  };

  return (
    <div style={styles.container}>
      <h1>Staff Dashboard</h1>
      <p>Welcome! Here you can manage your events.</p>

      {error && <p style={styles.error}>{error}</p>}
      {successMessage && <p style={styles.success}>{successMessage}</p>}

      <ul style={styles.eventList}>
        {events.map((event) => (
          <li key={event.id} style={styles.eventItem}>
            {editingEvent && editingEvent.id === event.id ? (
              <div style={styles.form}>
                <input
                  type="text"
                  name="title"
                  value={editingEvent.title}
                  onChange={handleInputChange}
                  style={styles.input}
                />
                <input
                  type="text"
                  name="description"
                  value={editingEvent.description}
                  onChange={handleInputChange}
                  style={styles.input}
                />
                <input
                  type="text"
                  name="date"
                  value={editingEvent.date}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEditingEvent((prev) => ({
                      ...prev,
                      date: value, // Update the displayed date
                    }));
                  }}
                  style={styles.input}
                />
                <input
                  type="text"
                  name="location"
                  value={editingEvent.location}
                  onChange={handleInputChange}
                  style={styles.input}
                />
                <input
                  type="number"
                  name="price"
                  value={editingEvent.price}
                  onChange={handleInputChange}
                  style={styles.input}
                />
                <button onClick={handleUpdateEvent} style={styles.button}>
                  Save Changes
                </button>
                <button onClick={() => setEditingEvent(null)} style={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p>Date: {formatDateForDisplay(event.date)}</p>
                <p>Location: {event.location}</p>
                <p>Price: £{event.price}</p>
                <button onClick={() => handleEditClick(event)} style={styles.button}>
                  Edit
                </button>
                <button onClick={() => handleDeleteEvent(event.id)} style={styles.deleteButton}>
                  Delete
                </button>
              </div>
            )}
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
  cancelButton: { margin: '10px 0', padding: '10px 20px', cursor: 'pointer', backgroundColor: 'red', color: 'white' },
  deleteButton: { margin: '10px 0', padding: '10px 20px', cursor: 'pointer', backgroundColor: 'red', color: 'white' },
  eventList: { listStyleType: 'none', padding: 0 },
  eventItem: { marginBottom: '20px', padding: '10px', border: '1px solid #ccc' },
};

export default StaffDashboard;
