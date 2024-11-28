require('dotenv').config(); // Load environment variables

const { Pool } = require('pg');

// Create a connection pool
const pool = new Pool({
  user: process.env.DB_USER,       // Username from .env
  host: process.env.DB_HOST,       // Host from .env
  database: process.env.DB_NAME,   // Database name from .env
  password: process.env.DB_PASSWORD, // Password from .env
  port: process.env.DB_PORT,       // Port from .env
});

module.exports = pool; // Export the pool for use in other files
