const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;


// Test database connection
/*
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
*/