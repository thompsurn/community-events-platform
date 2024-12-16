import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/styles.css';

function StaffDashboard() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    price: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://community-events-platform-production.up.railway.app/api/events');
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
      [name]: value,
    }));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      const response = await axios.post('http://community-events-platform-production.up.railway.app/api/events', newEvent);
      setEvents((prev) => [...prev, response.data]);
      setNewEvent({
        title: '',
        description: '',
        date: '',
        location: '',
        price: '',
      });
      setSuccessMessage('Event added successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to add event. Please try again.');
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`http://community-events-platform-production.up.railway.app/api/events/${id}`);
      setEvents((prev) => prev.filter((event) => event.id !== id));
      setSuccessMessage('Event deleted successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to delete event.');
    }
  };

  const handleEditEvent = (id) => {
    navigate(`/events/${id}/edit`); // Navigate to the specific event page with editing options
  };

  const handleViewEvent = (id) => {
    navigate(`/events/${id}`);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Staff Dashboard</h1>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {/* Add Event Form */}
      <div className="add-event-form">
        <h2 className="form-title">Add New Event</h2>
        <form onSubmit={handleAddEvent} className="form-group">
          <input
            type="text"
            name="title"
            value={newEvent.title}
            onChange={handleInputChange}
            placeholder="Event Title"
            required
            className="form-input"
          />
          <textarea
            name="description"
            value={newEvent.description}
            onChange={handleInputChange}
            placeholder="Event Description"
            required
            className="form-input"
          />
          <input
            type="date"
            name="date"
            value={newEvent.date}
            onChange={handleInputChange}
            required
            className="form-input"
          />
          <input
            type="text"
            name="location"
            value={newEvent.location}
            onChange={handleInputChange}
            placeholder="Event Location"
            required
            className="form-input"
          />
          <input
            type="number"
            name="price"
            value={newEvent.price}
            onChange={handleInputChange}
            placeholder="Event Price (£)"
            required
            className="form-input"
          />
          <button type="submit" className="add-event-button">
            Add Event
          </button>
        </form>
      </div>

      {/* Event List */}
      <ul className="event-list">
        {events.map((event) => (
          <li key={event.id} className="event-card">
            <h3 className="event-title">{event.title}</h3>
            <p className="event-details">{event.description}</p>
            <p className="event-details">Date: {event.date}</p>
            <p className="event-details">Location: {event.location}</p>
            <div className="event-actions">
              <button
                onClick={() => handleViewEvent(event.id)}
                className="button"
              >
                View Details
              </button>
              <button
                onClick={() => handleEditEvent(event.id)}
                className="button-secondary"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteEvent(event.id)}
                className="button-secondary"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StaffDashboard;
