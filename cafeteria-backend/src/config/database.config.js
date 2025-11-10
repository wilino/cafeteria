const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * MySQL connection pool configuration
 * Uses environment variables for credentials
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  charset: 'utf8mb4'
});

/**
 * Test database connection
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connection established');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

// Test connection on module load
testConnection();

module.exports = pool;
