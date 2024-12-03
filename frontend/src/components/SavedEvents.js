import React, { useEffect, useState } from 'react';
import { fetchSavedEvents, removeSavedEvent } from '../api';
import '../styles/styles.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Ensure you import the user's context
import { createGoogleCalendarLink } from '../utils';

function SavedEvents() {
  const [savedEvents, setSavedEvents] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Use the logged-in user's context

  useEffect(() => {
    const loadSavedEvents = async () => {
      if (!user) {
        setError('You must be logged in to view saved events.');
        return;
      }
  
      try {
        const response = await fetchSavedEvents(user.id); // Call the API
        if (Array.isArray(response)) {
          setSavedEvents(response); // If response is already an array
        } else if (response && Array.isArray(response.data)) {
          setSavedEvents(response.data); // Handle cases where data is wrapped in an object
        } else {
          console.error('Invalid data: response is not an array or does not contain data', response);
          setSavedEvents([]); // Fallback to empty array
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setSavedEvents([]); // No saved events
        } else {
          console.error('Failed to fetch saved events:', err);
          setError('Could not load saved events.');
        }
      }
    };
  
    loadSavedEvents();
  }, [user]);
  
  
  

  const handleRemoveEvent = async (eventId) => {
    try {
      await removeSavedEvent(user.id, eventId); // Replace 'user.id' with the actual logged-in user ID
      setSavedEvents(savedEvents.filter((event) => event.id !== eventId));
    } catch (err) {
      console.error('Failed to remove event:', err);
      setError('Failed to remove event. Please try again.');
    }
  };

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
  const groupEventsByMonth = (events) => {
    // Check if events is a valid array
    if (!Array.isArray(events)) {
      console.error('Invalid data: events is not an array', events);
      return []; // Return an empty array to prevent further errors
    }
  
    // Group events by month using reduce
    const grouped = events.reduce((acc, event) => {
      const eventDate = new Date(event.date);
      const month = eventDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'long' });
      if (!acc[month]) acc[month] = [];
      acc[month].push(event);
      return acc;
    }, {});
  
    // Convert grouped events into an array of objects
    return Object.entries(grouped).map(([month, events]) => ({ month, events }));
  };
  

  const groupedSavedEvents = groupEventsByMonth(savedEvents);

  return (
    <div className="page-container">
      <h1 className="page-title">Saved Events</h1>
      {groupedSavedEvents.map(({ month, events }) => (
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
                  <a
                    href={createGoogleCalendarLink(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="google-calendar-link"
                  >
                    Add to Google Calendar
                  </a>
                  <button
                    onClick={() => handleRemoveEvent(event.id)}
                    className="remove-event-button"
                  >
                    Remove Event
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default SavedEvents;
