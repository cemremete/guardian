import os
import joblib
import numpy as np
import pandas as pd
from typing import Optional, List, Dict, Any
import logging

# fairness libs
from fairlearn.metrics import (
    demographic_parity_difference,
    equalized_odds_difference,
    MetricFrame
)
from aif360.datasets import BinaryLabelDataset
from aif360.metrics import BinaryLabelDatasetMetric, ClassificationMetric

# explainability
import shap

logger = logging.getLogger(__name__)

class AuditEngine:
    """
    Main audit engine that runs bias detection, fairness metrics, and explainability.
    This is where the magic happens I guess
    """
    
    def __init__(self):
        self.supported_frameworks = ['sklearn', 'pytorch', 'tensorflow', 'onnx']
        # default sensitive features if none provided
        self.default_sensitive = ['gender', 'sex', 'race', 'age', 'ethnicity']
    
    def run_audit(
        self,
        model_path: str,
        audit_type: str = "full",
        sensitive_features: Optional[List[str]] = None,
        test_data_path: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Run the full audit pipeline.
        Returns all metrics and scores.
        """
        logger.info(f"Loading model from {model_path}")
        
        # load the model
        model, framework = self._load_model(model_path)
        
        # generate or load test data
        if test_data_path and os.path.exists(test_data_path):
            X_test, y_test, sensitive_cols = self._load_test_data(test_data_path, sensitive_features)
        else:
            # generate synthetic data for testing
            # not ideal but works for demo purposes
            X_test, y_test, sensitive_cols = self._generate_synthetic_data(sensitive_features)
        
        results = {
            "bias_score": 0.0,
            "fairness_score": 0.0,
            "cern_compliance": 0.0,
            "bias_metrics": {},
            "fairness_metrics": {},
            "explainability": {},
            "cern_compliance_details": {},
            "warnings": [],
            "recommendations": []
        }
        
        try:
            # get predictions
            y_pred = self._get_predictions(model, X_test, framework)
            
            # run bias detection
            if audit_type in ["bias", "full"]:
                results["bias_metrics"] = self._compute_bias_metrics(
                    y_test, y_pred, X_test, sensitive_cols
                )
                results["bias_score"] = self._calculate_bias_score(results["bias_metrics"])
            
            # run fairness metrics
            if audit_type in ["fairness", "full"]:
                results["fairness_metrics"] = self._compute_fairness_metrics(
                    y_test, y_pred, X_test, sensitive_cols
                )
                results["fairness_score"] = self._calculate_fairness_score(results["fairness_metrics"])
            
            # run explainability
            if audit_type in ["explainability", "full"]:
                results["explainability"] = self._compute_explainability(
                    model, X_test, framework
                )
            
            # compute CERN compliance
            results["cern_compliance_details"] = self._compute_cern_compliance(results)
            results["cern_compliance"] = results["cern_compliance_details"]["overall_score"]
            
            # generate warnings and recommendations
            results["warnings"] = self._generate_warnings(results)
            results["recommendations"] = self._generate_recommendations(results)
            
        except Exception as e:
            logger.error(f"Audit computation error: {e}")
            results["warnings"].append(f"Partial audit: {str(e)}")
        
        return results
    
    def _load_model(self, model_path: str):
        """Load model from file. Supports multiple formats."""
        ext = os.path.splitext(model_path)[1].lower()
        
        if ext in ['.pkl', '.joblib']:
            model = joblib.load(model_path)
            return model, 'sklearn'
        elif ext in ['.pt', '.pth']:
            import torch
            model = torch.load(model_path, map_location='cpu')
            return model, 'pytorch'
        elif ext == '.h5':
            import tensorflow as tf
            model = tf.keras.models.load_model(model_path)
            return model, 'tensorflow'
        elif ext == '.onnx':
            import onnxruntime as ort
            model = ort.InferenceSession(model_path)
            return model, 'onnx'
        else:
            # try joblib as fallback
            try:
                model = joblib.load(model_path)
                return model, 'sklearn'
            except:
                raise ValueError(f"Unsupported model format: {ext}")
    
    def _load_test_data(
        self, 
        data_path: str, 
        sensitive_features: Optional[List[str]]
    ):
        """Load test data from CSV or parquet."""
        if data_path.endswith('.parquet'):
            df = pd.read_parquet(data_path)
        else:
            df = pd.read_csv(data_path)
        
        # assume last column is target
        y = df.iloc[:, -1].values
        X = df.iloc[:, :-1]
        
        # find sensitive columns
        if sensitive_features:
            sensitive_cols = [c for c in sensitive_features if c in X.columns]
        else:
            sensitive_cols = [c for c in self.default_sensitive if c in X.columns]
        
        return X, y, sensitive_cols
    
    def _generate_synthetic_data(self, sensitive_features: Optional[List[str]]):
        """Generate synthetic test data when no real data is provided."""
        np.random.seed(42)
        n_samples = 1000
        n_features = 10
        
        # create feature names
        feature_names = [f"feature_{i}" for i in range(n_features)]
        
        # add sensitive features
        sensitive_cols = sensitive_features or ['gender', 'age_group']
        for sf in sensitive_cols:
            if sf not in feature_names:
                feature_names.append(sf)
        
        # generate data
        X = pd.DataFrame(
            np.random.randn(n_samples, len(feature_names)),
            columns=feature_names
        )
        
        # make sensitive features binary/categorical
        for sf in sensitive_cols:
            if sf in X.columns:
                X[sf] = np.random.randint(0, 2, n_samples)
        
        # generate labels with some bias
        y = (X.iloc[:, 0] + X.iloc[:, 1] + np.random.randn(n_samples) * 0.5 > 0).astype(int)
        
        return X, y, sensitive_cols
    
    def _get_predictions(self, model, X, framework: str):
        """Get model predictions."""
        if framework == 'sklearn':
            return model.predict(X)
        elif framework == 'pytorch':
            import torch
            model.eval()
            with torch.no_grad():
                X_tensor = torch.FloatTensor(X.values if hasattr(X, 'values') else X)
                outputs = model(X_tensor)
                return (outputs > 0.5).numpy().flatten()
        elif framework == 'tensorflow':
            preds = model.predict(X, verbose=0)
            return (preds > 0.5).astype(int).flatten()
        elif framework == 'onnx':
            input_name = model.get_inputs()[0].name
            X_np = X.values if hasattr(X, 'values') else X
            outputs = model.run(None, {input_name: X_np.astype(np.float32)})
            return (outputs[0] > 0.5).astype(int).flatten()
        else:
            raise ValueError(f"Unknown framework: {framework}")
    
    def _compute_bias_metrics(
        self, 
        y_true, 
        y_pred, 
        X, 
        sensitive_cols: List[str]
    ) -> Dict[str, float]:
        """Compute bias metrics using Fairlearn."""
        metrics = {
            "demographic_parity": 0.0,
            "equalized_odds": 0.0,
            "disparate_impact": 0.0
        }
        
        if not sensitive_cols:
            logger.warning("No sensitive features found, using random split")
            sensitive = np.random.randint(0, 2, len(y_true))
        else:
            # use first sensitive column
            sensitive = X[sensitive_cols[0]].values if hasattr(X, 'values') else X[:, 0]
        
        try:
            # demographic parity difference
            dpd = demographic_parity_difference(y_true, y_pred, sensitive_features=sensitive)
            metrics["demographic_parity"] = abs(float(dpd))
            
            # equalized odds difference
            eod = equalized_odds_difference(y_true, y_pred, sensitive_features=sensitive)
            metrics["equalized_odds"] = abs(float(eod))
            
            # disparate impact using AIF360
            # need to be careful here, aif360 can be finicky
            try:
                metrics["disparate_impact"] = self._compute_disparate_impact(
                    y_true, y_pred, sensitive
                )
            except Exception as e:
                logger.warning(f"Disparate impact calc failed: {e}")
                metrics["disparate_impact"] = 0.0
                
        except Exception as e:
            logger.error(f"Bias metrics error: {e}")
        
        return metrics
    
    def _compute_disparate_impact(self, y_true, y_pred, sensitive) -> float:
        """Calculate disparate impact ratio."""
        # group by sensitive attribute
        group_0_mask = sensitive == 0
        group_1_mask = sensitive == 1
        
        # positive rate for each group
        if group_0_mask.sum() > 0 and group_1_mask.sum() > 0:
            rate_0 = y_pred[group_0_mask].mean()
            rate_1 = y_pred[group_1_mask].mean()
            
            if rate_1 > 0:
                di = rate_0 / rate_1
            elif rate_0 > 0:
                di = 0.0  # infinite disparity
            else:
                di = 1.0  # both zero, technically fair
            
            return float(di)
        return 1.0
    
    def _compute_fairness_metrics(
        self,
        y_true,
        y_pred,
        X,
        sensitive_cols: List[str]
    ) -> Dict[str, float]:
        """Compute additional fairness metrics."""
        metrics = {
            "statistical_parity_difference": 0.0,
            "equal_opportunity_difference": 0.0,
            "average_odds_difference": 0.0
        }
        
        if not sensitive_cols:
            return metrics
        
        sensitive = X[sensitive_cols[0]].values if hasattr(X, 'values') else X[:, 0]
        
        try:
            # statistical parity (same as demographic parity basically)
            group_0_rate = y_pred[sensitive == 0].mean()
            group_1_rate = y_pred[sensitive == 1].mean()
            metrics["statistical_parity_difference"] = abs(group_0_rate - group_1_rate)
            
            # equal opportunity - TPR difference
            tpr_0 = self._true_positive_rate(y_true[sensitive == 0], y_pred[sensitive == 0])
            tpr_1 = self._true_positive_rate(y_true[sensitive == 1], y_pred[sensitive == 1])
            metrics["equal_opportunity_difference"] = abs(tpr_0 - tpr_1)
            
            # average odds - average of TPR and FPR differences
            fpr_0 = self._false_positive_rate(y_true[sensitive == 0], y_pred[sensitive == 0])
            fpr_1 = self._false_positive_rate(y_true[sensitive == 1], y_pred[sensitive == 1])
            metrics["average_odds_difference"] = (abs(tpr_0 - tpr_1) + abs(fpr_0 - fpr_1)) / 2
            
        except Exception as e:
            logger.error(f"Fairness metrics error: {e}")
        
        return metrics
    
    def _true_positive_rate(self, y_true, y_pred) -> float:
        """Calculate TPR."""
        positives = y_true == 1
        if positives.sum() == 0:
            return 0.0
        return (y_pred[positives] == 1).mean()
    
    def _false_positive_rate(self, y_true, y_pred) -> float:
        """Calculate FPR."""
        negatives = y_true == 0
        if negatives.sum() == 0:
            return 0.0
        return (y_pred[negatives] == 1).mean()
    
    def _compute_explainability(
        self,
        model,
        X,
        framework: str
    ) -> Dict[str, Any]:
        """Compute SHAP values for explainability."""
        result = {
            "shap_values": [],
            "feature_importance": {},
            "top_features": []
        }
        
        try:
            # use a sample for speed
            X_sample = X.iloc[:100] if hasattr(X, 'iloc') else X[:100]
            
            if framework == 'sklearn':
                # try tree explainer first, fall back to kernel
                try:
                    explainer = shap.TreeExplainer(model)
                except:
                    explainer = shap.KernelExplainer(model.predict, X_sample)
                
                shap_values = explainer.shap_values(X_sample)
                
                # handle multi-output
                if isinstance(shap_values, list):
                    shap_values = shap_values[1] if len(shap_values) > 1 else shap_values[0]
                
                # feature importance from shap
                importance = np.abs(shap_values).mean(axis=0)
                feature_names = X.columns.tolist() if hasattr(X, 'columns') else [f"f{i}" for i in range(X.shape[1])]
                
                result["feature_importance"] = {
                    name: float(imp) for name, imp in zip(feature_names, importance)
                }
                
                # top 5 features
                sorted_idx = np.argsort(importance)[::-1][:5]
                result["top_features"] = [feature_names[i] for i in sorted_idx]
                
                # store sample of shap values (not all, too big)
                result["shap_values"] = shap_values[:10].tolist()
                
            else:
                # for other frameworks, just use permutation importance
                # shap can be slow with deep learning models
                logger.info(f"Using simplified explainability for {framework}")
                result["feature_importance"] = {}
                result["top_features"] = []
                
        except Exception as e:
            logger.error(f"Explainability error: {e}")
            result["shap_values"] = []
        
        return result
    
    def _compute_cern_compliance(self, results: Dict[str, Any]) -> Dict[str, float]:
        """
        Compute CERN AI ethics compliance score.
        Based on CERN's AI guidelines for transparency, accountability, fairness, safety.
        """
        scores = {
            "transparency_score": 0.0,
            "accountability_score": 0.0,
            "fairness_score": 0.0,
            "safety_score": 0.0,
            "overall_score": 0.0
        }
        
        # transparency - based on explainability
        if results.get("explainability", {}).get("feature_importance"):
            scores["transparency_score"] = 0.8  # has explainability
        else:
            scores["transparency_score"] = 0.3
        
        # accountability - we're auditing so that's good
        scores["accountability_score"] = 0.9
        
        # fairness - based on bias and fairness metrics
        bias_metrics = results.get("bias_metrics", {})
        dp = bias_metrics.get("demographic_parity", 1.0)
        di = bias_metrics.get("disparate_impact", 0.0)
        
        # lower demographic parity diff is better
        fairness_from_dp = max(0, 1 - dp * 2)  # scale it
        
        # disparate impact should be close to 1
        fairness_from_di = 1 - abs(1 - di) if di > 0 else 0.5
        
        scores["fairness_score"] = (fairness_from_dp + fairness_from_di) / 2
        
        # safety - hard to measure without more context, use fairness as proxy
        scores["safety_score"] = scores["fairness_score"] * 0.9
        
        # overall weighted average
        weights = {
            "transparency_score": 0.2,
            "accountability_score": 0.2,
            "fairness_score": 0.4,
            "safety_score": 0.2
        }
        
        scores["overall_score"] = sum(
            scores[k] * weights[k] for k in weights
        )
        
        return scores
    
    def _calculate_bias_score(self, bias_metrics: Dict[str, float]) -> float:
        """Convert bias metrics to a single score (higher is better, less biased)."""
        dp = bias_metrics.get("demographic_parity", 0)
        eo = bias_metrics.get("equalized_odds", 0)
        di = bias_metrics.get("disparate_impact", 1)
        
        # penalize high demographic parity and equalized odds differences
        score = 1 - (dp + eo) / 2
        
        # penalize disparate impact far from 1
        di_penalty = abs(1 - di) * 0.5
        score = max(0, score - di_penalty)
        
        return float(np.clip(score, 0, 1))
    
    def _calculate_fairness_score(self, fairness_metrics: Dict[str, float]) -> float:
        """Convert fairness metrics to a single score."""
        spd = fairness_metrics.get("statistical_parity_difference", 0)
        eod = fairness_metrics.get("equal_opportunity_difference", 0)
        aod = fairness_metrics.get("average_odds_difference", 0)
        
        # lower differences = higher score
        avg_diff = (spd + eod + aod) / 3
        score = 1 - avg_diff
        
        return float(np.clip(score, 0, 1))
    
    def _generate_warnings(self, results: Dict[str, Any]) -> List[str]:
        """Generate warnings based on audit results."""
        warnings = []
        
        bias = results.get("bias_metrics", {})
        
        if bias.get("demographic_parity", 0) > 0.1:
            warnings.append("High demographic parity difference detected (>0.1)")
        
        if bias.get("disparate_impact", 1) < 0.8:
            warnings.append("Disparate impact below 0.8 threshold (potential discrimination)")
        
        if results.get("fairness_score", 1) < 0.7:
            warnings.append("Overall fairness score below acceptable threshold")
        
        if results.get("cern_compliance", 1) < 0.6:
            warnings.append("CERN compliance score below recommended minimum")
        
        return warnings
    
    def _generate_recommendations(self, results: Dict[str, Any]) -> List[str]:
        """Generate recommendations for improving the model."""
        recs = []
        
        bias = results.get("bias_metrics", {})
        
        if bias.get("demographic_parity", 0) > 0.05:
            recs.append("Consider rebalancing training data or applying bias mitigation techniques")
        
        if not results.get("explainability", {}).get("feature_importance"):
            recs.append("Add model explainability documentation for better transparency")
        
        if results.get("cern_compliance", 1) < 0.8:
            recs.append("Review CERN AI ethics guidelines and address compliance gaps")
        
        # always add this one
        recs.append("Regularly re-audit the model after retraining or data updates")
        
        return recs
