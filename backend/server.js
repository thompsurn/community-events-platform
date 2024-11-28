const express = require('express');
const pool = require('./db'); // Import the database connection

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()'); // Simple query to test the connection
    res.json({ message: 'Database connected successfully!', time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
