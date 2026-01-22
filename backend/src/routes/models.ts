import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database';
import { authenticate, requireRole } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

// setup multer for file uploads
const uploadDir = path.join(__dirname, '../../uploads/models');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // keep original extension but add uuid
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

// only allow certain file types
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['.pkl', '.joblib', '.h5', '.pt', '.pth', '.onnx', '.pb', '.zip'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: pkl, joblib, h5, pt, pth, onnx, pb, zip'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 } // 500mb max
});

// upload a model
router.post('/upload',
  authenticate,
  requireRole('admin', 'auditor'),
  upload.single('model'),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { name, framework = 'other' } = req.body;
      
      if (!name) {
        // cleanup uploaded file
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'Model name is required' });
      }

      const modelId = uuidv4();
      const result = await query(
        `INSERT INTO ml_models (id, name, framework, file_path, uploaded_by, uploaded_at, metadata)
         VALUES ($1, $2, $3, $4, $5, NOW(), $6)
         RETURNING id, name, framework, uploaded_at`,
        [modelId, name, framework, req.file.path, req.user?.id, JSON.stringify({ originalName: req.file.originalname, size: req.file.size })]
      );

      res.status(201).json({
        message: 'Model uploaded successfully',
        model: result.rows[0]
      });
    } catch (err) {
      console.error('Upload error:', err);
      // try to cleanup file if something went wrong
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: 'Failed to upload model' });
    }
  }
);

// list all models
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const result = await query(
      `SELECT m.id, m.name, m.framework, m.uploaded_at, m.metadata,
              u.email as uploaded_by_email
       FROM ml_models m
       LEFT JOIN users u ON m.uploaded_by = u.id
       ORDER BY m.uploaded_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await query('SELECT COUNT(*) FROM ml_models');
    const total = parseInt(countResult.rows[0].count);

    res.json({
      models: result.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    console.error('List models error:', err);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

// get single model
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      `SELECT m.*, u.email as uploaded_by_email
       FROM ml_models m
       LEFT JOIN users u ON m.uploaded_by = u.id
       WHERE m.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Model not found' });
    }

    res.json({ model: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch model' });
  }
});

// delete model
router.delete('/:id',
  authenticate,
  requireRole('admin'),
  async (req: AuthRequest, res: Response) => {
    try {
      // get file path first
      const model = await query('SELECT file_path FROM ml_models WHERE id = $1', [req.params.id]);
      
      if (model.rows.length === 0) {
        return res.status(404).json({ error: 'Model not found' });
      }

      // delete from db
      await query('DELETE FROM ml_models WHERE id = $1', [req.params.id]);

      // delete file
      const filePath = model.rows[0].file_path;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      res.json({ message: 'Model deleted' });
    } catch (err) {
      console.error('Delete model error:', err);
      res.status(500).json({ error: 'Failed to delete model' });
    }
  }
);

export default router;
