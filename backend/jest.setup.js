const dotenv = require('dotenv');

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Optionally, you can add any global setup needed for your tests here

// Mock external services
jest.mock('passport-facebook', () => {
  const Strategy = jest.fn();
  Strategy.prototype.name = 'facebook';
  Strategy.prototype.authenticate = jest.fn(function (req, options) {
    this.success({ id: '12345', displayName: 'Test User' });
  });
  return { Strategy };
});

jest.mock('passport-google-oauth20', () => {
  const Strategy = jest.fn();
  Strategy.prototype.name = 'google';
  Strategy.prototype.authenticate = jest.fn(function (req, options) {
    this.success({ id: '12345', displayName: 'Test User' });
  });
  return { Strategy };
});

jest.setTimeout(30000); // Increase timeout to 30 seconds

beforeAll(async () => {
  try {
    // Clean the database
    const pool = require('./config/db');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL,
        reset_token VARCHAR(255) NULL,
        reset_token_expiry TIMESTAMP NULL,
        profile_picture VARCHAR(255) NULL,
        phone_number VARCHAR(20) NULL,
        auth_provider VARCHAR(50) DEFAULT 'local',
        auth_provider_id VARCHAR(255) NULL
      );
    `);
    await pool.query('DELETE FROM users'); // Clear the table before tests
  } catch (error) {
    console.error('Test setup failed:', error);
    process.exit(1);
  }
});

afterAll(async () => {
  try {
    const pool = require('./config/db');
    const redisClient = require('./config/redis');
    await redisClient.quit(); // Close the Redis connection
    await pool.end(); // Close the connection pool
  } catch (error) {
    console.error('Error closing the database connection:', error);
  }
});