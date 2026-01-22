import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

client = TestClient(app)


def test_health_check():
    """Test health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_get_metrics():
    """Test metrics listing"""
    response = client.get("/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "bias_metrics" in data
    assert "fairness_metrics" in data


def test_audit_missing_model():
    """Test audit with non-existent model"""
    response = client.post("/audit", json={
        "audit_id": "test-123",
        "model_path": "/nonexistent/model.pkl",
        "audit_type": "full"
    })
    assert response.status_code == 404


# TODO: add test with actual model file
# TODO: test different audit types
