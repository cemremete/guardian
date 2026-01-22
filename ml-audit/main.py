from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import os
import logging

from audit_engine import AuditEngine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="GUARDIAN ML Audit Service",
    description="Bias detection and fairness analysis for ML models",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# request models
class AuditRequest(BaseModel):
    audit_id: str
    model_path: str
    audit_type: str = "full"
    sensitive_features: Optional[List[str]] = None
    test_data_path: Optional[str] = None

class AuditResponse(BaseModel):
    audit_id: str
    status: str
    bias_score: float
    fairness_score: float
    cern_compliance: float
    bias_metrics: Dict[str, float]
    fairness_metrics: Dict[str, float]
    explainability: Dict[str, Any]
    cern_compliance_details: Dict[str, float]
    warnings: List[str]
    recommendations: List[str]

# init audit engine
audit_engine = AuditEngine()

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ml-audit"}

@app.post("/audit", response_model=AuditResponse)
async def run_audit(request: AuditRequest):
    """
    Run a full audit on the provided model.
    This can take a while for big models so maybe add async queue later
    """
    logger.info(f"Starting audit {request.audit_id} for model: {request.model_path}")
    
    try:
        # check if model file exists
        if not os.path.exists(request.model_path):
            raise HTTPException(status_code=404, detail=f"Model file not found: {request.model_path}")
        
        # run the audit
        results = audit_engine.run_audit(
            model_path=request.model_path,
            audit_type=request.audit_type,
            sensitive_features=request.sensitive_features,
            test_data_path=request.test_data_path
        )
        
        logger.info(f"Audit {request.audit_id} completed successfully")
        
        return AuditResponse(
            audit_id=request.audit_id,
            status="completed",
            **results
        )
        
    except FileNotFoundError as e:
        logger.error(f"File not found: {e}")
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Audit failed: {e}")
        # return partial results with error
        raise HTTPException(status_code=500, detail=f"Audit failed: {str(e)}")

@app.get("/metrics")
def get_available_metrics():
    """List all available fairness metrics"""
    return {
        "bias_metrics": [
            "demographic_parity",
            "equalized_odds", 
            "disparate_impact"
        ],
        "fairness_metrics": [
            "statistical_parity_difference",
            "equal_opportunity_difference",
            "average_odds_difference"
        ],
        "explainability": [
            "shap_values",
            "feature_importance"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
