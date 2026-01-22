# GUARDIAN

I built this because I was working on ML projects at a research lab and kept running into the same problem - how do you actually verify that your models aren't biased before deploying them? There's a ton of academic papers about fairness metrics but no simple tool that just... checks your model and tells you if it's okay.

So GUARDIAN happened. It's basically an audit platform that checks ML models for bias, generates explainability reports, and scores them against CERN's AI ethics guidelines. Nothing fancy, just practical stuff that actually works.

## what it does

- upload your trained model (sklearn, pytorch, tensorflow - whatever)
- runs bias detection using Fairlearn and AIF360
- generates SHAP explanations so you can see what features matter
- gives you a compliance score (0-100) based on CERN guidelines
- spits out a PDF report you can attach to your documentation

## tech stack

**backend**: node.js + express + typescript + postgresql  
**ml engine**: python + fastapi + fairlearn + aif360 + shap  
**frontend**: vanilla js + chart.js (no react, kept it simple)  
**deploy**: docker + gitlab ci/cd

## getting started

```bash
# clone it
git clone https://gitlab.cern.ch/your-username/guardian.git
cd guardian

# spin up everything
docker-compose up -d

# backend runs on :3010, ml service on :8000, frontend on :8080
```

you'll need to set up the database first:
```bash
docker exec -it guardian-postgres psql -U guardian -d guardian_db -f /docker-entrypoint-initdb.d/init.sql
```

## env variables

create a `.env` file in the root:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=guardian_db
DB_USER=guardian
DB_PASSWORD=changeme

JWT_SECRET=your-secret-here
ML_SERVICE_URL=http://localhost:8000
```

## project structure

```
guardian/
├── backend/          # express api
├── frontend/         # vanilla js dashboard  
├── ml-audit/         # python fastapi service
├── postgres/         # db init scripts
├── docker/           # dockerfiles
└── scripts/          # utility scripts
```

## running locally (without docker)

if you wanna run things separately for dev:

```bash
# backend
cd backend
npm install
npm run dev

# ml service
cd ml-audit
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# frontend - just serve the files
cd frontend
python -m http.server 8080
```

## testing with sample model

there's a test model generator in `backend/test-data/`:

```bash
cd backend/test-data
python create_test_model.py
```

this creates:
- `test_model.pkl` - a RandomForest classifier trained on synthetic credit risk data
- `test_data.csv` - 1000 samples with 10 features

the model has intentional gender bias built in so you can see the bias detection actually working.

**quick test flow:**
1. start the services (backend on :3010, frontend on :5500)
2. login with `test@test.com` / `123456`
3. go to Models > Upload Model
4. upload `test_model.pkl` with framework "Scikit-learn"
5. click "Run Audit" on the model
6. check Audits page for results

expected results:
- compliance score: ~70%
- bias detected on gender feature
- recommendations for bias mitigation

see `backend/test-data/README.md` for API examples and more details.

## api endpoints

check out the backend readme for full api docs, but the main ones:

- `POST /api/auth/login` - get your token
- `POST /api/models/upload` - upload a model
- `POST /api/audits/run` - trigger an audit
- `GET /api/audits/:id` - get results
- `GET /api/reports/:id/pdf` - download report

## todo

- [ ] add batch model processing
- [ ] webhook notifications when audit completes
- [ ] maybe add a cli tool?
- [ ] better error messages (they're kinda cryptic rn)

## contributing

feel free to open issues or PRs. the codebase is pretty straightforward, just follow the existing patterns.

## license

MIT 
