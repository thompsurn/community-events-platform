import React, { useEffect, useState } from 'react';
import { fetchSavedEvents, removeSavedEvent } from '../api';
import '../styles/styles.css';
import { useAuth } from '../AuthContext';
import { createGoogleCalendarLink } from '../utils';

function SavedEvents() {
  const [savedEvents, setSavedEvents] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadSavedEvents = async () => {
      if (!user) {
        setError('You must be logged in to view saved events.');
        return;
      }
  
      try {
        const response = await fetchSavedEvents(user.id);
        if (Array.isArray(response)) {
          setSavedEvents(response);
        } else if (response && Array.isArray(response.data)) {
          setSavedEvents(response.data);
        } else {
          console.error('Invalid data: response is not an array or does not contain data', response);
          setSavedEvents([]);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setSavedEvents([]);
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
      await removeSavedEvent(user.id, eventId);
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
    if (!Array.isArray(events)) {
      console.error('Invalid data: events is not an array', events);
      return [];
    }
  
    const grouped = events.reduce((acc, event) => {
      const eventDate = new Date(event.date);
      const month = eventDate.toLocaleDateString('en-GB', { year: 'numeric', month: 'long' });
      if (!acc[month]) acc[month] = [];
      acc[month].push(event);
      return acc;
    }, {});
  
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
              <li key={event.id} className="saved-event-card">
                <div className="saved-event-date">
                  <span className="saved-event-day">
                    {new Date(event.date).toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase()}
                  </span>
                  <span className="saved-event-date-number">
                    {new Date(event.date).getDate()}
                  </span>
                </div>
                <div className="saved-event-info">
                  <h3 className="saved-event-title">{event.title}</h3>
                  <p className="saved-event-location">{event.location}</p>
                  <div className='saved-event-links'>
                    <a href={`/events/${event.id}`} className="saved-event-details-link">
                        View Details
                    </a>
                    <a
                        href={createGoogleCalendarLink(event)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="saved-event-calendar-link"
                    >
                        Add to Google Calendar
                    </a>
                    <button
                        onClick={() => handleRemoveEvent(event.id)}
                        className="saved-event-remove-button"
                    >
                        Remove Event
                    </button>
                  </div>
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
