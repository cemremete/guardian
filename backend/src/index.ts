import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';

import modelRoutes from './routes/models';
import auditRoutes from './routes/audits';
import reportRoutes from './routes/reports';
import { errorHandler } from './middleware/errorHandler';
import { generateEnhancedPDF } from './services/pdfService';

dotenv.config();

// In-memory users database
interface User {
  id: number;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

const users: User[] = [
  { id: 1, email: 'test@test.com', password: '123456', firstName: 'Test', lastName: 'User' }
];

console.log('Initial users:', users);

const app = express();
const PORT = process.env.PORT || 3010;

// middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// cors config - allow multiple origins for dev
const allowedOrigins = [
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:5500',  // live server
  'http://127.0.0.1:5500',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // in dev, allow all origins
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static files for uploaded models
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// AUTH ENDPOINTS - Simple in-memory implementation

// Register
app.post('/api/auth/register', (req, res) => {
  console.log('[REGISTER] Request body:', req.body);
  
  const { email, password, firstName, lastName } = req.body;
  
  if (!email || !password) {
    console.log('[REGISTER] Missing email or password');
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  // Check if email already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    console.log('[REGISTER] Email already exists:', email);
    return res.status(400).json({ error: 'Email already exists' });
  }
  
  // Create new user with firstName and lastName
  const newUser: User = { 
    id: Date.now(), 
    email, 
    password,
    firstName: firstName || '',
    lastName: lastName || ''
  };
  users.push(newUser);
  
  console.log('[REGISTER] User created:', newUser.email, newUser.firstName, newUser.lastName);
  console.log('[REGISTER] Total users:', users.length);
  
  res.json({ 
    success: true, 
    message: 'User created successfully',
    user: { id: newUser.id, email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName },
    token: 'fake-jwt-token-' + newUser.id
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  console.log('[LOGIN] Request body:', req.body);
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    console.log('[LOGIN] Missing email or password');
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  // Find user
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    console.log('[LOGIN] Invalid credentials for:', email);
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  console.log('[LOGIN] Success for:', email);
  
  res.json({ 
    success: true,
    message: 'Login successful',
    user: { id: user.id, email: user.email },
    token: 'fake-jwt-token-' + user.id
  });
});

// Get current user (for token validation)
app.get('/api/auth/me', (req, res) => {
  console.log('[ME] Request headers:', req.headers.authorization);
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  // Extract user id from fake token
  const userId = parseInt(token.replace('fake-jwt-token-', ''));
  
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  console.log('[ME] User found:', user.email);
  
  res.json({ 
    user: { id: user.id, email: user.email }
  });
});

// Simple auth middleware for in-memory auth
const simpleAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  const userId = parseInt(token.replace('fake-jwt-token-', ''));
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  req.user = { id: user.id, email: user.email, role: 'admin' };
  next();
};

// In-memory models storage
interface Model {
  id: string;
  name: string;
  framework: string;
  filename: string;
  originalName: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

const models: Model[] = [];

// In-memory audits storage
interface Audit {
  id: string;
  modelId: string;
  modelName: string;
  status: string;
  biasScore: number | null;
  fairnessScore: number | null;
  complianceScore: number | null;
  createdAt: string;
  completedAt: string | null;
  results: any;
}

const audits: Audit[] = [];

// Setup multer for file uploads
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const uploadDir = path.join(__dirname, '../uploads/models');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }
});

// MODELS ENDPOINTS

// Upload model
app.post('/api/models/upload', simpleAuth, upload.single('model'), (req: any, res) => {
  console.log('[UPLOAD] File:', req.file);
  console.log('[UPLOAD] Body:', req.body);
  
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const { name, framework = 'other' } = req.body;
  
  if (!name) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: 'Model name is required' });
  }
  
  const model: Model = {
    id: uuidv4(),
    name,
    framework,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    uploadedBy: req.user.email,
    uploadedAt: new Date().toISOString()
  };
  
  models.push(model);
  console.log('[UPLOAD] Model saved:', model.name);
  console.log('[UPLOAD] Total models:', models.length);
  
  res.status(201).json({
    message: 'Model uploaded successfully',
    model
  });
});

// List models
app.get('/api/models', simpleAuth, (req: any, res) => {
  console.log('[MODELS] Listing models, total:', models.length);
  res.json({
    models,
    pagination: {
      page: 1,
      limit: 20,
      total: models.length,
      pages: 1
    }
  });
});

// Get single model
app.get('/api/models/:id', simpleAuth, (req: any, res) => {
  const model = models.find(m => m.id === req.params.id);
  if (!model) {
    return res.status(404).json({ error: 'Model not found' });
  }
  res.json({ model });
});

// Delete model
app.delete('/api/models/:id', simpleAuth, (req: any, res) => {
  const index = models.findIndex(m => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Model not found' });
  }
  
  const model = models[index];
  const filePath = path.join(uploadDir, model.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  
  models.splice(index, 1);
  console.log('[DELETE] Model deleted:', model.name);
  
  res.json({ message: 'Model deleted' });
});

// AUDITS ENDPOINTS

// Start audit
app.post('/api/audits', simpleAuth, (req: any, res) => {
  const { modelId } = req.body;
  
  const model = models.find(m => m.id === modelId);
  if (!model) {
    return res.status(404).json({ error: 'Model not found' });
  }
  
  const audit: Audit = {
    id: uuidv4(),
    modelId,
    modelName: model.name,
    status: 'running',
    biasScore: null,
    fairnessScore: null,
    complianceScore: null,
    createdAt: new Date().toISOString(),
    completedAt: null,
    results: null
  };
  
  audits.push(audit);
  console.log('[AUDIT] Started for model:', model.name);
  
  // Simulate audit completion after 3 seconds
  setTimeout(() => {
    const auditIndex = audits.findIndex(a => a.id === audit.id);
    if (auditIndex !== -1) {
      audits[auditIndex].status = 'completed';
      audits[auditIndex].biasScore = Math.random() * 0.3 + 0.1;
      audits[auditIndex].fairnessScore = Math.random() * 0.2 + 0.7;
      audits[auditIndex].complianceScore = Math.random() * 20 + 70;
      audits[auditIndex].completedAt = new Date().toISOString();
      audits[auditIndex].results = {
        metrics: {
          demographicParity: Math.random() * 0.2,
          equalizedOdds: Math.random() * 0.15,
          disparateImpact: 0.8 + Math.random() * 0.2
        },
        warnings: ['Potential gender bias detected', 'Review feature importance'],
        recommendations: ['Consider rebalancing training data', 'Apply fairness constraints']
      };
      console.log('[AUDIT] Completed:', audit.id);
    }
  }, 3000);
  
  res.status(201).json({
    message: 'Audit started',
    audit
  });
});

// List audits
app.get('/api/audits', simpleAuth, (req: any, res) => {
  const { status } = req.query;
  let filteredAudits = audits;
  
  if (status) {
    filteredAudits = audits.filter(a => a.status === status);
  }
  
  console.log('[AUDITS] Listing audits, total:', filteredAudits.length);
  res.json({
    audits: filteredAudits.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    pagination: {
      page: 1,
      limit: 20,
      total: filteredAudits.length,
      pages: 1
    }
  });
});

// Get single audit
app.get('/api/audits/:id', simpleAuth, (req: any, res) => {
  const audit = audits.find(a => a.id === req.params.id);
  if (!audit) {
    return res.status(404).json({ error: 'Audit not found' });
  }
  res.json({ audit });
});

// Dashboard stats
app.get('/api/dashboard/stats', simpleAuth, (req: any, res) => {
  const completedAudits = audits.filter(a => a.status === 'completed');
  const avgCompliance = completedAudits.length > 0
    ? completedAudits.reduce((sum, a) => sum + (a.complianceScore || 0), 0) / completedAudits.length
    : 0;
  
  res.json({
    totalModels: models.length,
    totalAudits: audits.length,
    avgCompliance: Math.round(avgCompliance),
    runningAudits: audits.filter(a => a.status === 'running').length,
    recentAudits: completedAudits.slice(0, 5)
  });
});

// PDF Report Generation - Using enhanced PDF service
app.get('/api/reports/:auditId/pdf', simpleAuth, (req: any, res) => {
  const auditId = req.params.auditId;
  const audit = audits.find(a => a.id === auditId);
  
  if (!audit) {
    return res.status(404).json({ error: 'Audit not found' });
  }

  // Get user info
  const user = users.find(u => u.id === req.user?.id);
  
  // Prepare audit data for PDF
  const auditData = {
    id: audit.id,
    modelId: audit.modelId,
    modelName: audit.modelName || 'Unknown Model',
    framework: 'scikit-learn',
    status: audit.status,
    createdAt: audit.createdAt,
    completedAt: audit.completedAt || undefined,
    biasScore: audit.biasScore || 0.15,
    fairnessScore: audit.fairnessScore || 85,
    complianceScore: audit.complianceScore || 0,
    results: audit.results,
    auditorName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : undefined,
    username: user?.email || 'System'
  };

  try {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=guardian-audit-${auditId}.pdf`);
    
    const doc = generateEnhancedPDF(auditData);
    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Other routes (disabled for now, using in-memory)
// app.use('/api/models', modelRoutes);
// app.use('/api/audits', auditRoutes);
app.use('/api/reports', reportRoutes);

// health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // console.log('Debug: env loaded -', process.env.NODE_ENV);
});

export default app;
