export const createGoogleCalendarLink = (event) => {
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
  