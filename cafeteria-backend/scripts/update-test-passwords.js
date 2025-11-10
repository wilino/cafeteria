/**
 * Script to update test user passwords to OWASP-compliant format
 */

const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

const SALT_ROUNDS = 12;

const TEST_USERS = [
  {
    email: 'admin@cafe.com',
    password: 'Adm!n#2025.Cafe_Latte',
    nombre: 'Administrador del Sistema'
  },
  {
    email: 'barista@cafe.com',
    password: 'B@r1st@#2025.Espresso',
    nombre: 'María García - Barista'
  },
  {
    email: 'cliente@cafe.com',
    password: 'Cl!ente#2025.Mocha_Safe',
    nombre: 'Juan Pérez - Cliente'
  }
];

async function updatePasswords() {
  let connection;
  
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    console.log('Connected to database');
    console.log('\n=== Updating Test User Passwords ===\n');

    for (const user of TEST_USERS) {
      console.log(`Processing: ${user.email}`);
      
      // Hash password
      const passwordHash = await bcrypt.hash(user.password, SALT_ROUNDS);
      
      // Update user
      const [result] = await connection.execute(
        'UPDATE users SET password_hash = ? WHERE email = ?',
        [passwordHash, user.email]
      );

      if (result.affectedRows > 0) {
        console.log(`✅ Updated: ${user.email}`);
        console.log(`   Password: ${user.password}`);
      } else {
        console.log(`⚠️  User not found: ${user.email}`);
      }
      console.log('');
    }

    console.log('=== Password Update Complete ===\n');
    console.log('Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    TEST_USERS.forEach(user => {
      console.log(`${user.email.padEnd(25)} / ${user.password}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('Error updating passwords:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

updatePasswords();
