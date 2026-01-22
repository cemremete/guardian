#!/bin/bash

# quick setup script for local dev
# run this after cloning the repo

echo "Setting up GUARDIAN..."

# backend
echo "Installing backend dependencies..."
cd backend
cp .env.example .env
npm install
cd ..

# ml-audit
echo "Setting up Python environment..."
cd ml-audit
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on windows
pip install -r requirements.txt
cd ..

# create uploads dir
mkdir -p backend/uploads/models

echo ""
echo "Setup complete!"
echo ""
echo "To start development:"
echo "  1. Start postgres: docker-compose up -d postgres"
echo "  2. Backend: cd backend && npm run dev"
echo "  3. ML service: cd ml-audit && uvicorn main:app --reload"
echo "  4. Frontend: cd frontend && python -m http.server 8080"
echo ""
echo "Or just run: docker-compose up"
