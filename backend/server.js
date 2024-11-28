const express = require('express');
const pool = require('./db'); // Import the database connection

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Middleware to parse JSON

// Test API is running
app.get('/', (req, res) => {
    res.send('API is running...');
  });  


// Fetch all events
app.get('/api/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events');
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No events found' });
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Add a new event
app.post('/api/events', async (req, res) => {
    const { title, description, date, location, price } = req.body;
  
    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }
  
    try {
      const result = await pool.query(
        'INSERT INTO events (title, description, date, location, price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, description, date, location, price]
      );
      res.status(201).json(result.rows[0]); // Respond with the created event
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create event' });
    }
  });

// Get an event by ID
app.get('/api/events/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      res.json(result.rows[0]); // Return the specific event
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch event' });
    }
  });

  // Update an event by ID
app.patch('/api/events/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, date, location, price } = req.body;
  
    try {
      const result = await pool.query(
        `UPDATE events
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             date = COALESCE($3, date),
             location = COALESCE($4, location),
             price = COALESCE($5, price)
         WHERE id = $6
         RETURNING *`,
        [title, description, date, location, price, id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      res.json(result.rows[0]); // Return the updated event
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update event' });
    }
  });
  
  // Delete an event by ID
app.delete('/api/events/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      res.json({ message: 'Event deleted successfully', event: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete event' });
    }
  });  
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
