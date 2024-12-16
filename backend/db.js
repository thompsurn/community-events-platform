require('dotenv').config(); // Load environment variables
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: isProduction
    ? { rejectUnauthorized: false } // Use SSL in production (Railway)
    : false, // No SSL locally
});

module.exports = pool;


// Test database connection
(async () => {
  try {
    const client = await pool.connect();
    console.log('Database connection successful');
    const result = await client.query(
      'SELECT current_database(), current_schema();'
    );
    console.log('Connected to:', result.rows[0]);
    client.release();
  } catch (error) {
    console.error('Database connection error:', error);
  }
})();