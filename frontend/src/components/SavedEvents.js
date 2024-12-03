import React, { useEffect, useState } from 'react';
import { fetchSavedEvents } from '../api';
import '../styles/styles.css';

function SavedEvents() {
  const [savedEvents, setSavedEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSavedEvents = async () => {
      try {
        const data = await fetchSavedEvents(1); // Replace '1' with the actual user ID
        setSavedEvents(data);
      } catch (err) {
        console.error('Failed to fetch saved events:', err);
        setError('Could not load saved events.');
      }
    };

    loadSavedEvents();
  }, []);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (savedEvents.length === 0) {
    return (
      <div className="page-container">
        <h1 className="page-title">Saved Events</h1>
        <p>No saved events yet. Go sign up for some events!</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Saved Events</h1>
      <ul className="event-list">
        {savedEvents.map((event) => (
          <li key={event.id} className="event-card">
            <h2 className="event-title">{event.title}</h2>
            <p className="event-details">{event.description}</p>
            <p className="event-details">Date: {new Date(event.date).toLocaleDateString()}</p>
            <p className="event-details">Location: {event.location}</p>
            <p className="event-price">
              {event.price === 0 ? 'Free' : `£${event.price}`}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SavedEvents;
