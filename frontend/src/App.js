import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { fetchEvents } from './api';
import LoginPage from './components/LoginPage';
import SavedEvents from './components/SavedEvents';
import EventDetails from './components/EventDetails';
import StaffLogin from './components/StaffLogin';
import StaffDashboard from './components/StaffDashboard';

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
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
        <Link to="/">Home</Link> | <Link to="/saved-events">Saved Events</Link> |{' '}
        <Link to="/staff-login">Staff Login</Link>
      </nav>

      {/* Routes */}
      <Routes>
        {/* Default Login Page */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Home Page */}
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

        {/* Staff Login Page */}
        <Route path="/staff-login" element={<StaffLogin />} />

        {/* Staff Dashboard */}
        <Route path="/staff-dashboard" element={<StaffDashboard />} />

        {/* Redirect All Unknown Paths to Login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
