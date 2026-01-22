# GUARDIAN ML Audit Service

Python FastAPI service that does the actual ML model auditing - bias detection, fairness metrics, and explainability.

## what it does

- loads ML models (sklearn, pytorch, tensorflow, onnx)
- runs Fairlearn metrics for bias detection
- computes AIF360 disparate impact
- generates SHAP explanations
- scores against CERN AI ethics guidelines

## running locally

```bash
# create virtual env
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on windows

# install deps (takes a while, lots of ml libs)
pip install -r requirements.txt

# run the server
uvicorn main:app --reload --port 8000
```

## api

### POST /audit

Run an audit on a model.

```json
{
  "audit_id": "uuid",
  "model_path": "/path/to/model.pkl",
  "audit_type": "full",
  "sensitive_features": ["gender", "age"],
  "test_data_path": "/path/to/test.csv"
}
```

Returns all the metrics and scores.

### GET /health

Health check endpoint.

### GET /metrics

List available metrics.

## supported model formats

- `.pkl`, `.joblib` - scikit-learn
- `.pt`, `.pth` - PyTorch
- `.h5` - TensorFlow/Keras
- `.onnx` - ONNX

## notes

- if no test data is provided, synthetic data is generated (not ideal but works for demo)
- SHAP can be slow on large models, might want to add caching later
- the CERN compliance scoring is based on their published AI guidelines
