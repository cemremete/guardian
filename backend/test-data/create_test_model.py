#!/usr/bin/env python3
"""
GUARDIAN Test Model Generator

Creates a simple scikit-learn RandomForest classifier for testing
the ML audit functionality. Also generates test data CSV.

Usage:
    python create_test_model.py

Output:
    - test_model.pkl: Trained RandomForest model
    - test_data.csv: Test dataset with features and labels
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

# Configuration
N_SAMPLES = 1000
N_FEATURES = 10
RANDOM_STATE = 42
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

def generate_synthetic_data(n_samples=N_SAMPLES, n_features=N_FEATURES):
    """
    Generate synthetic data for binary classification.
    Simulates a credit risk assessment scenario with demographic features.
    """
    np.random.seed(RANDOM_STATE)
    
    # Feature names (simulating a credit risk model)
    feature_names = [
        'age',
        'income',
        'debt_ratio',
        'credit_history_length',
        'num_credit_accounts',
        'payment_history_score',
        'employment_years',
        'education_level',
        'gender',  # Sensitive attribute for bias testing
        'region_code'
    ]
    
    # Generate features
    data = {
        'age': np.random.randint(18, 70, n_samples),
        'income': np.random.exponential(50000, n_samples),
        'debt_ratio': np.random.uniform(0, 1, n_samples),
        'credit_history_length': np.random.randint(0, 30, n_samples),
        'num_credit_accounts': np.random.randint(1, 15, n_samples),
        'payment_history_score': np.random.uniform(0, 100, n_samples),
        'employment_years': np.random.randint(0, 40, n_samples),
        'education_level': np.random.randint(1, 5, n_samples),  # 1=HS, 2=Some College, 3=Bachelor, 4=Master+
        'gender': np.random.randint(0, 2, n_samples),  # 0=Female, 1=Male (sensitive)
        'region_code': np.random.randint(1, 10, n_samples)
    }
    
    df = pd.DataFrame(data)
    
    # Generate labels based on features (with some intentional bias for testing)
    # Higher income, longer credit history, better payment score -> approved
    score = (
        0.3 * (df['income'] / 100000) +
        0.2 * (df['payment_history_score'] / 100) +
        0.15 * (df['credit_history_length'] / 30) +
        0.1 * (df['employment_years'] / 40) +
        0.1 * (1 - df['debt_ratio']) +
        0.05 * (df['education_level'] / 4) +
        0.05 * (df['age'] / 70) +
        0.05 * np.random.random(n_samples)  # noise
    )
    
    # Add slight bias based on gender (for bias detection testing)
    score += 0.05 * df['gender']
    
    # Binary classification: approved (1) or denied (0)
    threshold = np.percentile(score, 40)  # ~60% approval rate
    df['label'] = (score > threshold).astype(int)
    
    return df, feature_names

def train_model(X, y):
    """Train a RandomForest classifier."""
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE
    )
    
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=RANDOM_STATE,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"Model trained successfully!")
    print(f"Accuracy: {accuracy:.4f}")
    print(f"\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['Denied', 'Approved']))
    
    return model

def main():
    print("=" * 50)
    print("GUARDIAN Test Model Generator")
    print("=" * 50)
    
    # Generate data
    print("\n[1/4] Generating synthetic data...")
    df, feature_names = generate_synthetic_data()
    print(f"Generated {len(df)} samples with {len(feature_names)} features")
    
    # Prepare features and labels
    X = df.drop('label', axis=1)
    y = df['label']
    
    # Train model
    print("\n[2/4] Training RandomForest classifier...")
    model = train_model(X, y)
    
    # Save model
    print("\n[3/4] Saving model...")
    model_path = os.path.join(OUTPUT_DIR, 'test_model.pkl')
    joblib.dump(model, model_path)
    print(f"Model saved to: {model_path}")
    
    # Save test data
    print("\n[4/4] Saving test data...")
    data_path = os.path.join(OUTPUT_DIR, 'test_data.csv')
    df.to_csv(data_path, index=False)
    print(f"Test data saved to: {data_path}")
    
    # Summary
    print("\n" + "=" * 50)
    print("DONE! Files created:")
    print(f"  - test_model.pkl ({os.path.getsize(model_path) / 1024:.1f} KB)")
    print(f"  - test_data.csv ({os.path.getsize(data_path) / 1024:.1f} KB)")
    print("\nYou can now upload test_model.pkl to GUARDIAN for auditing.")
    print("=" * 50)

if __name__ == '__main__':
    main()
