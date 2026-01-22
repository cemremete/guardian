#!/usr/bin/env python
"""
Creates a sample sklearn model for testing the audit system.
Run this to generate a test model you can upload.
"""

import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification
import joblib
import os

def create_sample_model():
    print("Creating sample model for testing...")
    
    # generate some fake data with bias
    np.random.seed(42)
    X, y = make_classification(
        n_samples=1000,
        n_features=10,
        n_informative=5,
        n_redundant=2,
        random_state=42
    )
    
    # train a simple model
    model = RandomForestClassifier(n_estimators=50, random_state=42)
    model.fit(X, y)
    
    # save it
    output_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(output_dir, "sample_model.pkl")
    joblib.dump(model, output_path)
    
    print(f"Model saved to: {output_path}")
    print("You can now upload this model to test the audit system")
    
    # also save some test data
    import pandas as pd
    df = pd.DataFrame(X, columns=[f"feature_{i}" for i in range(10)])
    df["gender"] = np.random.randint(0, 2, 1000)  # add sensitive feature
    df["target"] = y
    
    data_path = os.path.join(output_dir, "sample_test_data.csv")
    df.to_csv(data_path, index=False)
    print(f"Test data saved to: {data_path}")

if __name__ == "__main__":
    create_sample_model()
