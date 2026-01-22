-- guardian database init script
-- run this on first setup

-- enable uuid extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'viewer',
  created_at TIMESTAMP DEFAULT NOW()
);

-- ml models table
CREATE TABLE IF NOT EXISTS ml_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  framework VARCHAR(50) DEFAULT 'other',
  file_path VARCHAR(500) NOT NULL,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- audits table
CREATE TABLE IF NOT EXISTS audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID REFERENCES ml_models(id) ON DELETE CASCADE,
  audit_type VARCHAR(50) DEFAULT 'full',
  status VARCHAR(50) DEFAULT 'pending',
  bias_score FLOAT,
  fairness_score FLOAT,
  cern_compliance FLOAT,
  results JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_audits_model_id ON audits(model_id);
CREATE INDEX IF NOT EXISTS idx_audits_status ON audits(status);
CREATE INDEX IF NOT EXISTS idx_audits_created_at ON audits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_models_uploaded_by ON ml_models(uploaded_by);

-- insert a default admin user (password: admin123)
-- you should change this in production obviously
INSERT INTO users (email, password_hash, role) 
VALUES ('admin@guardian.local', '$2a$10$rQnM1.5K5Z5Z5Z5Z5Z5Z5OqZ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', 'admin')
ON CONFLICT (email) DO NOTHING;
