import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { fetchEvents } from './api';
import SavedEvents from './components/SavedEvents';
import EventDetails from './components/EventDetails';

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents(); // Fetch events from the backend
        setEvents(data); // Update the state with fetched events
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    loadEvents();
  }, []);

  return (
    <Router>
      {/* Navigation Bar */}
      <nav>
        <Link to="/">Home</Link> | <Link to="/saved-events">Saved Events</Link>
      </nav>

      {/* Routes */}
      <Routes>
        {/* Home Page: Displays a list of events */}
        <Route
          path="/"
          element={
            <div>
              <h1>Upcoming Events</h1>
              <ul>
                {events.map((event) => (
                  <li key={event.id}>
                    <Link to={`/events/${event.id}`}>{event.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          }
        />

        {/* Saved Events Page */}
        <Route path="/saved-events" element={<SavedEvents />} />

        {/* Event Details Page */}
        <Route path="/events/:id" element={<EventDetails events={events} />} />
      </Routes>
    </Router>
  );
}

export default App;
