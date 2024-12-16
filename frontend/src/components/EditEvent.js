import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/styles.css';

function EditEvent() {
  const { id } = useParams(); // Get the event ID from the route parameters
  const navigate = useNavigate(); // For navigation after saving changes

  // Initialize state variables for the event
  const [event, setEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    price: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch event data once when the component mounts
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://community-events-platform-production.up.railway.app/api/events/${id}`);
        setEvent(response.data); // Set the fetched event data
      } catch (err) {
        console.error(err);
        setError('Failed to fetch event details.');
      }
    };

    fetchEvent();
  }, [id]); // Dependency array ensures this runs only when the `id` changes

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      await axios.put(`http://community-events-platform-production.up.railway.app/api/events/${id}`, event);
      setSuccessMessage('Event updated successfully!');
      navigate('/staff-dashboard'); // Redirect to the staff dashboard
    } catch (err) {
      console.error(err);
      setError('Failed to update event. Please try again.');
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Edit Event</h1>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form className="edit-event-form" onSubmit={handleSaveChanges}>
        <h2 className="form-title">Update Event Details</h2>
        <input
          type="text"
          name="title"
          value={event.title}
          onChange={handleInputChange}
          placeholder="Event Title"
          required
          className="form-input"
        />
        <textarea
          name="description"
          value={event.description}
          onChange={handleInputChange}
          placeholder="Event Description"
          required
          className="form-input"
        />
        <input
        type="date"
        name="date"
        value={event.date ? new Date(event.date).toISOString().slice(0, 10) : ''}
        onChange={handleInputChange}
        required
        className="form-input"
        />
        <input
          type="text"
          name="location"
          value={event.location}
          onChange={handleInputChange}
          placeholder="Event Location"
          required
          className="form-input"
        />
        <input
          type="number"
          name="price"
          value={event.price}
          onChange={handleInputChange}
          placeholder="Event Price (£)"
          required
          className="form-input"
        />
        <button type="submit" className="button">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditEvent;
