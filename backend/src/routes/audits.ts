import { Router, Response } from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database';
import { authenticate, requireRole } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// trigger a new audit
router.post('/run',
  authenticate,
  requireRole('admin', 'auditor'),
  async (req: AuthRequest, res: Response) => {
    try {
      const { model_id, audit_type = 'full' } = req.body;

      if (!model_id) {
        return res.status(400).json({ error: 'model_id is required' });
      }

      // check if model exists
      const modelResult = await query('SELECT * FROM ml_models WHERE id = $1', [model_id]);
      if (modelResult.rows.length === 0) {
        return res.status(404).json({ error: 'Model not found' });
      }

      const model = modelResult.rows[0];
      const auditId = uuidv4();

      // create audit record
      await query(
        `INSERT INTO audits (id, model_id, audit_type, status, created_at)
         VALUES ($1, $2, $3, 'pending', NOW())`,
        [auditId, model_id, audit_type]
      );

      // trigger ml service async - don't wait for it
      // the ml service will update the audit when done
      triggerMLAudit(auditId, model.file_path, audit_type).catch(err => {
        console.error('ML audit trigger failed:', err);
        // update status to failed
        query(
          `UPDATE audits SET status = 'failed', results = $2 WHERE id = $1`,
          [auditId, JSON.stringify({ error: 'ML service unavailable' })]
        );
      });

      res.status(202).json({
        message: 'Audit started',
        audit_id: auditId,
        status: 'pending'
      });
    } catch (err) {
      console.error('Start audit error:', err);
      res.status(500).json({ error: 'Failed to start audit' });
    }
  }
);

// helper to call ml service
async function triggerMLAudit(auditId: string, modelPath: string, auditType: string) {
  // update status to running
  await query(`UPDATE audits SET status = 'running' WHERE id = $1`, [auditId]);

  try {
    const response = await axios.post(`${ML_SERVICE_URL}/audit`, {
      audit_id: auditId,
      model_path: modelPath,
      audit_type: auditType
    }, {
      timeout: 300000 // 5 min timeout for big models
    });

    const results = response.data;

    // update audit with results
    await query(
      `UPDATE audits 
       SET status = 'completed',
           bias_score = $2,
           fairness_score = $3,
           cern_compliance = $4,
           results = $5,
           completed_at = NOW()
       WHERE id = $1`,
      [
        auditId,
        results.bias_score,
        results.fairness_score,
        results.cern_compliance,
        JSON.stringify(results)
      ]
    );
  } catch (err: any) {
    console.error('ML service error:', err.message);
    await query(
      `UPDATE audits SET status = 'failed', results = $2 WHERE id = $1`,
      [auditId, JSON.stringify({ error: err.message || 'Audit failed' })]
    );
  }
}

// get audit status
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      `SELECT a.*, m.name as model_name, m.framework
       FROM audits a
       LEFT JOIN ml_models m ON a.model_id = m.id
       WHERE a.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Audit not found' });
    }

    res.json({ audit: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit' });
  }
});

// list audits
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, model_id, status } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereClause = '';
    const params: any[] = [];
    let paramCount = 0;

    if (model_id) {
      paramCount++;
      whereClause += `WHERE a.model_id = $${paramCount}`;
      params.push(model_id);
    }

    if (status) {
      paramCount++;
      whereClause += whereClause ? ` AND a.status = $${paramCount}` : `WHERE a.status = $${paramCount}`;
      params.push(status);
    }

    params.push(limit, offset);

    const result = await query(
      `SELECT a.id, a.model_id, a.audit_type, a.status, a.bias_score, 
              a.fairness_score, a.cern_compliance, a.created_at, a.completed_at,
              m.name as model_name
       FROM audits a
       LEFT JOIN ml_models m ON a.model_id = m.id
       ${whereClause}
       ORDER BY a.created_at DESC
       LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
      params
    );

    // count query
    const countParams = params.slice(0, paramCount);
    const countResult = await query(
      `SELECT COUNT(*) FROM audits a ${whereClause}`,
      countParams
    );
    const total = parseInt(countResult.rows[0].count);

    res.json({
      audits: result.rows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    console.error('List audits error:', err);
    res.status(500).json({ error: 'Failed to fetch audits' });
  }
});

// get dashboard stats
router.get('/stats/summary', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_audits,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'running') as running,
        COUNT(*) FILTER (WHERE status = 'failed') as failed,
        AVG(cern_compliance) FILTER (WHERE status = 'completed') as avg_compliance,
        AVG(bias_score) FILTER (WHERE status = 'completed') as avg_bias_score,
        AVG(fairness_score) FILTER (WHERE status = 'completed') as avg_fairness_score
      FROM audits
    `);

    const modelCount = await query('SELECT COUNT(*) FROM ml_models');

    res.json({
      stats: {
        ...stats.rows[0],
        total_models: parseInt(modelCount.rows[0].count)
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
