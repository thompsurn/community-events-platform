import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { fetchEvents } from './api';
import LoginPage from './components/LoginPage';
import SavedEvents from './components/SavedEvents';
import EventDetails from './components/EventDetails';
import EditEvent from './components/EditEvent';
import StaffDashboard from './components/StaffDashboard';
import CreateAccount from './components/CreateAccount';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './AuthContext';
import './styles/styles.css';

function App() {
  const [events, setEvents] = useState([]);
  const { user, logout } = useAuth();

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

  const handleLogout = () => {
    logout();
    if (user?.role === 'staff') {
      window.location.href = '/staff-login';
    } else {
      window.location.href = '/login';
    }
  };

  const groupEventsByMonth = (events) => {
    const grouped = events.reduce((acc, event) => {
      const eventDate = new Date(event.date);
      const month = eventDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'long' });
      if (!acc[month]) acc[month] = [];
      acc[month].push(event);
      return acc;
    }, {});

    return Object.entries(grouped).map(([month, events]) => ({ month, events }));
  };

  return (
    <Router>
      <nav className="nav-bar">
        <ul className="nav-list">
          <li>
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li>
            {user ? (
              <Link to="/saved-events" className="nav-link">Saved Events</Link>
            ) : (
              <Link to="/login" className="nav-link">Login</Link>
            )}
          </li>
          {user && user.role === 'staff' && (
            <li>
              <Link to="/staff-dashboard" className="nav-link">Staff Dashboard</Link>
            </li>
          )}
          {user && (
            <li>
              <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
            </li>
          )}
        </ul>
      </nav>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route
          path="/staff-dashboard"
          element={
            <ProtectedRoute allowedRoles={['staff']}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-events"
          element={
            <ProtectedRoute allowedRoles={['user', 'staff']}>
              <SavedEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id"
          element={
            <ProtectedRoute allowedRoles={['user', 'staff']}>
              <EventDetails events={events} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['staff']}>
              <EditEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <div className="homepage">
              <h1 className="page-title">Upcoming Events</h1>
              <div>
                {groupEventsByMonth(events).map(({ month, events }) => (
                  <div key={month} className="month-group">
                    <h2 className="month-heading">{month}</h2>
                    <ul className="event-list">
                      {events.map((event) => (
                        <li key={event.id} className="event-card-homepage">
                          <div className="event-date-homepage">
                            <span className="day">
                              {new Date(event.date).toLocaleDateString('en-GB', { weekday: 'short' })}
                            </span>
                            <span className="date">
                              {new Date(event.date).getDate()}
                            </span>
                          </div>
                          <div className="event-details-homepage">
                            <h3 className="event-title-homepage">{event.title}</h3>
                            <p className="event-location-homepage">{event.location}</p>
                            <Link to={`/events/${event.id}`} className="event-link">
                              View Details
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
