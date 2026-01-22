import pytest
import numpy as np
import pandas as pd
from unittest.mock import Mock, patch
import sys
import os

# add parent dir to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from audit_engine import AuditEngine


class TestAuditEngine:
    """Basic tests for the audit engine"""
    
    def setup_method(self):
        self.engine = AuditEngine()
    
    def test_init(self):
        """Check engine initializes correctly"""
        assert self.engine is not None
        assert 'sklearn' in self.engine.supported_frameworks
    
    def test_generate_synthetic_data(self):
        """Test synthetic data generation"""
        X, y, sensitive = self.engine._generate_synthetic_data(None)
        
        assert len(X) == 1000
        assert len(y) == 1000
        assert isinstance(X, pd.DataFrame)
    
    def test_calculate_bias_score(self):
        """Test bias score calculation"""
        metrics = {
            "demographic_parity": 0.1,
            "equalized_odds": 0.1,
            "disparate_impact": 0.9
        }
        
        score = self.engine._calculate_bias_score(metrics)
        assert 0 <= score <= 1
    
    def test_calculate_fairness_score(self):
        """Test fairness score calculation"""
        metrics = {
            "statistical_parity_difference": 0.05,
            "equal_opportunity_difference": 0.05,
            "average_odds_difference": 0.05
        }
        
        score = self.engine._calculate_fairness_score(metrics)
        assert 0 <= score <= 1
        assert score > 0.8  # low differences should give high score
    
    def test_generate_warnings(self):
        """Test warning generation"""
        results = {
            "bias_metrics": {
                "demographic_parity": 0.2,
                "disparate_impact": 0.7
            },
            "fairness_score": 0.5,
            "cern_compliance": 0.5
        }
        
        warnings = self.engine._generate_warnings(results)
        assert len(warnings) > 0
    
    def test_generate_recommendations(self):
        """Test recommendation generation"""
        results = {
            "bias_metrics": {"demographic_parity": 0.1},
            "explainability": {},
            "cern_compliance": 0.7
        }
        
        recs = self.engine._generate_recommendations(results)
        assert len(recs) > 0
    
    def test_true_positive_rate(self):
        """Test TPR calculation"""
        y_true = np.array([1, 1, 1, 0, 0])
        y_pred = np.array([1, 1, 0, 0, 0])
        
        tpr = self.engine._true_positive_rate(y_true, y_pred)
        assert tpr == pytest.approx(2/3, rel=0.01)
    
    def test_false_positive_rate(self):
        """Test FPR calculation"""
        y_true = np.array([0, 0, 0, 1, 1])
        y_pred = np.array([1, 0, 0, 1, 1])
        
        fpr = self.engine._false_positive_rate(y_true, y_pred)
        assert fpr == pytest.approx(1/3, rel=0.01)


# TODO: add integration tests with actual models
# TODO: test with different model formats
