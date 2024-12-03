import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { fetchEvents } from './api';
import LoginPage from './components/LoginPage';
import SavedEvents from './components/SavedEvents';
import EventDetails from './components/EventDetails';
import EditEvent from './components/EditEvent';
import StaffLogin from './components/StaffLogin';
import StaffDashboard from './components/StaffDashboard';
import CreateAccount from './components/CreateAccount'; // New component for account creation
import { useAuth } from './AuthContext'; // Use AuthContext for authentication
import './styles/styles.css';

function App() {
  const [events, setEvents] = useState([]);
  const { user } = useAuth();

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
        </ul>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/create-account" element={<CreateAccount />} />

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

        <Route path="/saved-events" element={user ? <SavedEvents /> : <Navigate to="/login" />} />
        <Route
          path="/events/:id"
          element={user ? <EventDetails events={events} /> : <Navigate to="/login" />}
        />
        <Route
          path="/events/:id/edit"
          element={user && user.role === 'staff' ? <EditEvent /> : <Navigate to="/staff-login" />}
        />
        <Route
          path="/staff-dashboard"
          element={user && user.role === 'staff' ? <StaffDashboard /> : <Navigate to="/staff-login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

// Helper Function: Group Events by Month
function groupEventsByMonth(events) {
  const grouped = events.reduce((acc, event) => {
    const eventDate = new Date(event.date);
    const month = eventDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'long' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(event);
    return acc;
  }, {});

  return Object.entries(grouped).map(([month, events]) => ({ month, events }));
}

export default App;
