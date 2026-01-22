import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'auditor' | 'viewer';
  created_at: Date;
}

export interface MLModel {
  id: string;
  name: string;
  framework: 'sklearn' | 'pytorch' | 'tensorflow' | 'onnx' | 'other';
  file_path: string;
  uploaded_by: string;
  uploaded_at: Date;
  metadata?: Record<string, any>;
}

export interface Audit {
  id: string;
  model_id: string;
  audit_type: 'bias' | 'fairness' | 'explainability' | 'full';
  status: 'pending' | 'running' | 'completed' | 'failed';
  bias_score: number | null;
  fairness_score: number | null;
  cern_compliance: number | null;
  results: AuditResults | null;
  created_at: Date;
  completed_at?: Date;
}

export interface AuditResults {
  bias_metrics?: {
    demographic_parity: number;
    equalized_odds: number;
    disparate_impact: number;
  };
  fairness_metrics?: {
    statistical_parity_difference: number;
    equal_opportunity_difference: number;
    average_odds_difference: number;
  };
  explainability?: {
    shap_values: number[][];
    feature_importance: Record<string, number>;
    top_features: string[];
  };
  cern_compliance_details?: {
    transparency_score: number;
    accountability_score: number;
    fairness_score: number;
    safety_score: number;
    overall_score: number;
  };
  warnings?: string[];
  recommendations?: string[];
}

// extend express request to include user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface JWTPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
