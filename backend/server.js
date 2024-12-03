const express = require('express');
const cors = require('cors'); // Import CORS
const pool = require('./db'); // Import the database connection
const bcrypt = require('bcrypt');
const { verifyToken, generateToken } = require('./middlewares/auth'); // Use modularized auth functions
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Apply Middleware
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Middleware to parse JSON

// Test API is running
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Create Account Endpoint
app.post('/api/create-account', async (req, res) => {
  console.log('Request received at /api/create-account');
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.',
    });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, role, created_at',
      [username, passwordHash]
    );

    res.status(201).json({ message: 'Account created successfully', user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ error: 'Username already exists' });
    } else {
      console.error('Error creating account:', err);
      res.status(500).json({ error: 'Failed to create account. Please try again.' });
    }
  }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = generateToken(user.id);

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

// Fetch all events
app.get('/api/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY date ASC, id ASC');
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No events found' });
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Fetch saved events for a user
app.get('/api/users/:id/saved-events', verifyToken, async (req, res) => {
  if (result.rowCount === 0) {
    return res.json([]); // Return an empty array instead of a 404
  }  
  const { id } = req.params;

  if (req.user.id !== parseInt(id)) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  try {
    const result = await pool.query(
      `SELECT events.*
       FROM saved_events
       JOIN events ON saved_events.event_id = events.id
       WHERE saved_events.user_id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'No saved events found for this user' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching saved events:', err);
    res.status(500).json({ error: 'Failed to fetch saved events.' });
  }
});

// Save an event for a user
app.post('/api/users/:id/saved-events', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { eventId } = req.body;

  if (req.user.id !== parseInt(id)) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  try {
    const eventCheck = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
    if (eventCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const savedEventCheck = await pool.query(
      'SELECT * FROM saved_events WHERE user_id = $1 AND event_id = $2',
      [id, eventId]
    );

    if (savedEventCheck.rowCount > 0) {
      return res.status(400).json({ error: 'Event already saved' });
    }

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

// Delete a saved event for a user
app.delete('/api/users/:id/saved-events/:eventId', verifyToken, async (req, res) => {
  const { id, eventId } = req.params;

  if (req.user.id !== parseInt(id)) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM saved_events WHERE user_id = $1 AND event_id = $2 RETURNING *',
      [id, eventId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Saved event not found' });
    }

    res.status(200).json({ message: 'Event removed successfully' });
  } catch (err) {
    console.error('Error removing saved event:', err);
    res.status(500).json({ error: 'Failed to remove event' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
