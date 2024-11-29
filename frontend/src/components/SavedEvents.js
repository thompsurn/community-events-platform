import React, { useEffect, useState } from 'react';
import { fetchSavedEvents } from '../api'; // Assuming your API helper file is in src/api.js

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
    return <p>{error}</p>;
  }

  if (savedEvents.length === 0) {
    return <p>No saved events yet. Go sign up for some events!</p>;
  }

  return (
    <div>
      <h1>Saved Events</h1>
      <ul>
        {savedEvents.map((event) => (
          <li key={event.id}>
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <p>Date: {event.date}</p>
            <p>Location: {event.location}</p>
            <p>Price: {event.price === 0 ? 'Free' : `£${event.price}`}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SavedEvents;
