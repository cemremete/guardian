import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// probably should use connection string but this works fine
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'guardian_db',
  user: process.env.DB_USER || 'guardian',
  password: process.env.DB_PASSWORD || 'changeme',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  // don't crash the whole thing, just log it
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  // console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
};

export const getClient = () => pool.connect();

export default pool;
