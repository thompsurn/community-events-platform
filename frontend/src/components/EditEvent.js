import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/styles.css';

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    price: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`https://community-events-platform-production.up.railway.app/api/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch event details.');
      }
    };

    fetchEvent();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      await axios.put(`https://community-events-platform-production.up.railway.app/api/events/${id}`, event);
      setSuccessMessage('Event updated successfully!');
      navigate('/staff-dashboard');
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
