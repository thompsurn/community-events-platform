import React, { useEffect, useState } from 'react';
import { fetchEvents } from './api'; // Adjust the path if needed

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents(); // Call the backend API
        setEvents(data); // Update the state with fetched events
      } catch (error) {
        console.error('Failed to load events:', error);
      }
    };

    loadEvents();
  }, []);

  return (
    <div>
      <h1>Upcoming Events</h1>
      <ul>
        {events.map((event) => (
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

export default App;
