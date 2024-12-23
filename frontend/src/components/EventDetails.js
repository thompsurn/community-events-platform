import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { saveEvent } from '../api';
import '../styles/styles.css';

function EventDetails({ events }) {
  const { id } = useParams();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const event = events.find((e) => e.id === Number(id));

  if (!event) {
    return <p className="error-message">Event not found</p>;
  }

  const handleSignup = async () => {
    if (!user) {
      setError('You must be logged in to save events.');
      return;
    }

    try {
      await saveEvent(user.id, event.id);
      setMessage('Event successfully added to your saved events page!');
      setError('');
    } catch (err) {
      console.error('Error signing up for event:', err);
      if (err.response && err.response.status === 400) {
        setError('You’ve already signed up for this event!');
      } else if (err.response && err.response.status === 401) {
        setError('Unauthorized. Please log in and try again.');
      } else {
        setError('Failed to save event. Please try again.');
      }
    }
  };

  const createGoogleCalendarLink = () => {
    const title = encodeURIComponent(event.title);
    const description = encodeURIComponent(event.description);
    const location = encodeURIComponent(event.location);
    const startDate = new Date(event.date).toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';
    const endDate = new Date(new Date(event.date).getTime() + 3600000)
      .toISOString()
      .replace(/[-:.]/g, '')
      .slice(0, 15) + 'Z';

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${description}&location=${location}`;
  };

  return (
    <div className="event-details-container">
      <h1 className="event-details-title">{event.title}</h1>
      <p className="event-details-description">{event.description}</p>
      <p className="event-details-info">
        <strong>Date:</strong> {new Date(event.date).toLocaleDateString('en-GB')}
      </p>
      <p className="event-details-info">
        <strong>Location:</strong> {event.location}
      </p>
      <p className="event-details-price">
        <strong>Price:</strong> {event.price === 0 ? 'Free' : `£${event.price}`}
      </p>
      <button className="event-details-button" onClick={handleSignup}>
        Sign up!
      </button>
      {message && (
        <div className="signup-message">
          <p>{message}</p>
          <a
            href={createGoogleCalendarLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="google-calendar-link"
          >
            Click here to add to your Google Calendar
          </a>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default EventDetails;
