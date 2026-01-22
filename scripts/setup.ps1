# setup script for windows
# run this after cloning

Write-Host "Setting up GUARDIAN..." -ForegroundColor Cyan

# backend
Write-Host "`nInstalling backend dependencies..." -ForegroundColor Yellow
Set-Location backend
if (!(Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "Created .env file - edit it with your settings" -ForegroundColor Green
}
npm install
Set-Location ..

# ml-audit
Write-Host "`nSetting up Python environment..." -ForegroundColor Yellow
Set-Location ml-audit
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Set-Location ..

# create uploads dir
New-Item -ItemType Directory -Force -Path backend\uploads\models | Out-Null

Write-Host "`n" -NoNewline
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "`nTo start development:"
Write-Host "  1. Start postgres: docker-compose up -d postgres"
Write-Host "  2. Backend: cd backend; npm run dev"
Write-Host "  3. ML service: cd ml-audit; uvicorn main:app --reload"
Write-Host "  4. Frontend: cd frontend; python -m http.server 8080"
Write-Host "`nOr just run: docker-compose up"
