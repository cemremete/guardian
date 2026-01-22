#!/usr/bin/env node

// quick script to create an admin user
// run with: node scripts/create-admin.js admin@example.com password123

const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'guardian_db',
  user: process.env.DB_USER || 'guardian',
  password: process.env.DB_PASSWORD || 'changeme',
});

async function createAdmin(email, password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const result = await pool.query(
      `INSERT INTO users (id, email, password_hash, role, created_at)
       VALUES (gen_random_uuid(), $1, $2, 'admin', NOW())
       ON CONFLICT (email) DO UPDATE SET password_hash = $2, role = 'admin'
       RETURNING id, email, role`,
      [email, hash]
    );

    console.log('Admin user created/updated:', result.rows[0]);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Usage: node create-admin.js <email> <password>');
  process.exit(1);
}

createAdmin(email, password);
