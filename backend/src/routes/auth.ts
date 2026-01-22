import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { query } from '../config/database';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-prod';
const JWT_EXPIRES = '24h';

// register new user
router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 chars'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role = 'viewer' } = req.body;

    try {
      // check if user exists
      const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'Email already registered' });
      }

      // hash password - 10 rounds is fine for now
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const result = await query(
        `INSERT INTO users (id, email, password_hash, role, created_at) 
         VALUES (gen_random_uuid(), $1, $2, $3, NOW()) 
         RETURNING id, email, role`,
        [email, passwordHash, role]
      );

      const user = result.rows[0];
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
      );

      res.status(201).json({
        message: 'User created',
        user: { id: user.id, email: user.email, role: user.role },
        token
      });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
);

// login
router.post('/login',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const result = await query(
        'SELECT id, email, password_hash, role FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = result.rows[0];
      const validPassword = await bcrypt.compare(password, user.password_hash);

      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
      );

      res.json({
        message: 'Login successful',
        user: { id: user.id, email: user.email, role: user.role },
        token
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// get current user
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      'SELECT id, email, role, created_at FROM users WHERE id = $1',
      [req.user?.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
