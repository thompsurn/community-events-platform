const express = require('express');
const cors = require('cors'); // Import CORS
const pool = require('./db'); // Import the database connection
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;

// Apply CORS middleware
app.use(cors()); // Enable CORS for all requests

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


// Save an event for a user
app.post('/api/users/:id/saved-events', async (req, res) => {
  const { id } = req.params; // User ID
  const { eventId } = req.body; // Event ID from the request body

  try {
    // Check if the event exists
    const eventCheck = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
    if (eventCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if the event is already saved by the user
    const savedEventCheck = await pool.query(
      'SELECT * FROM saved_events WHERE user_id = $1 AND event_id = $2',
      [id, eventId]
    );

    if (savedEventCheck.rowCount > 0) {
      return res.status(400).json({ error: 'Event already saved' });
    }

    // Insert into saved_events
    const result = await pool.query(
      'INSERT INTO saved_events (user_id, event_id) VALUES ($1, $2) RETURNING *',
      [id, eventId]
    );

    res.status(201).json({ message: 'Event saved successfully', savedEvent: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save event' });
  }
});

// Get all saved events for a user
app.get('/api/users/:id/saved-events', async (req, res) => {
    const { id } = req.params; // User ID
  
    try {
      // Fetch all events saved by the user
      const result = await pool.query(
        `SELECT events.*
         FROM saved_events
         JOIN events ON saved_events.event_id = events.id
         WHERE saved_events.user_id = $1`,
        [id]
      );
  
      // Return the list of events or a friendly message if none are found
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'No saved events found for this user' });
      }
  
      res.json(result.rows); // Return the list of saved events
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch saved events' });
    }
  });
  
  
  // Staff login
app.post('/api/staff/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the staff user exists
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND role = $2',
      [username, 'staff']
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const staff = result.rows[0];

    // Check if the password matches
    const passwordMatch = await bcrypt.compare(password, staff.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', staffId: staff.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
