const express = require('express');
const cors = require('cors'); // Import CORS
const pool = require('./db'); // Import the database connection
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import JWT
const { verifyToken, generateToken } = require('./middlewares/auth'); // Use modularized auth functions
require('dotenv').config({ path: '.env.dev' });

const app = express();
const PORT = process.env.PORT || 5000;


// Debugging endpoint for database connection
app.get('/api/debug-users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    console.log('Users Table:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying users table:', err);
    res.status(500).send('Error querying users table');
  }
});


// Apply Middleware
app.use(cors({
  origin: '*', // Allow all origins (use cautiously in production)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));
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

// login endpoint
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
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Include the user object in the response (excluding sensitive fields)
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Failed to log in' });
  }
});


// Staff Login Endpoint
app.post('/api/staff/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('Attempting login for user:', username);
  console.log('Expected role:', 'staff');

  try {
    // Debug: Print all users before querying
    const allUsers = await pool.query('SELECT * FROM public.users');
    console.log('All Users in Table:', allUsers.rows);

    // Debug: Log the exact query being executed
    const query = 'SELECT * FROM public.users WHERE LOWER(username) = LOWER($1) AND LOWER(role) = LOWER($2)';
    const queryValues = [username, 'staff'];
    console.log('Executing Query:', query, 'Values:', queryValues);

    const result = await pool.query(query, queryValues);

    // Debug: Log the result of the query
    console.log('Query Result:', result.rows);

    if (result.rows.length === 0) {
      console.log('No matching user found for username:', username, 'and role: staff');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const staff = result.rows[0];
    console.log('Matching Staff User:', staff);

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, staff.password_hash);
    console.log('Password Match Result:', passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: staff.id, role: staff.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });       

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error during staff login:', err);
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

// Fetch a specific event by ID
app.get('/api/events/:id', async (req, res) => {
  const { id } = req.params; // Extract the event ID from the URL
  try {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]); // Query the database for the specific event
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Event not found' }); // Return 404 if no event is found
    }
    res.json(result.rows[0]); // Return the event details
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ error: 'Failed to fetch event details' }); // Handle server errors
  }
});


// Fetch saved events for a user
app.get('/api/users/:id/saved-events', verifyToken, async (req, res) => {
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

    if (!result || result.rowCount === 0) {
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


// staff can delete an event
app.delete('/api/events/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully', event: result.rows[0] });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ error: 'Failed to delete event.' });
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

// create an event as staff
app.post('/api/events', async (req, res) => {
  try {
    const { title, description, date, location, price } = req.body;

    if (!title || !description || !date || !location || !price) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const result = await pool.query(
      'INSERT INTO events (title, description, date, location, price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, date, location, price]
    );

    res.status(201).json({ message: 'Event created successfully', event: result.rows[0] });
  } catch (err) {
    console.error('Error adding event:', err);
    res.status(500).json({ error: 'Failed to add event.' });
  }
});



// Verify Database Connection
app.get('/api/debug-users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    console.log('Users Table:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error querying users table:', err);
    res.status(500).send('Error querying users table');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

