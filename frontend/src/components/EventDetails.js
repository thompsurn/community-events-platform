import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { saveEvent } from '../api';

function EventDetails({ events }) {
  const { id } = useParams(); // Get event ID from the URL
  const [message, setMessage] = useState('');
  const event = events.find((e) => e.id === Number(id)); // Find event by ID

  if (!event) {
    return <p>Event not found</p>;
  }

  const handleSignup = async () => {
    try {
        await saveEvent(1, event.id); // Replace '1' with actual user ID
        setMessage('Event successfully added to your saved events page!');
    } catch (err) {
      console.error('Error signing up for event:', err);
      if (err.response && err.response.status === 400) {
        setMessage('You’ve already signed up for this event!');
      } else {
        setMessage('Failed to save event. Please try again.');
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
      .slice(0, 15) + 'Z'; // Adds 1 hour to the event

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${description}&location=${location}`;
  };

  return (
    <div>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p>Date: {event.date}</p>
      <p>Location: {event.location}</p>
      <p>Price: {event.price === 0 ? 'Free' : `£${event.price}`}</p>
      <button onClick={handleSignup}>Sign up!</button>
      {message && (
        <div>
          <p>{message}</p>
          <a
            href={createGoogleCalendarLink()}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: 'blue' }}
          >
            Click here to add to your Google Calendar
          </a>
        </div>
      )}
    </div>
  );
}

export default EventDetails;
