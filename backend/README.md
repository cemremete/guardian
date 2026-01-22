# GUARDIAN Backend

Express + TypeScript API for the GUARDIAN ML audit platform.

## running locally

```bash
# install deps
npm install

# copy env file and edit as needed
cp .env.example .env

# start dev server (with hot reload)
npm run dev

# or build and run production
npm run build
npm start
```

## api endpoints

### auth
- `POST /api/auth/register` - create new user
- `POST /api/auth/login` - get jwt token
- `GET /api/auth/me` - get current user info

### models
- `GET /api/models` - list all models (paginated)
- `GET /api/models/:id` - get single model
- `POST /api/models/upload` - upload new model (multipart form)
- `DELETE /api/models/:id` - delete model (admin only)

### audits
- `GET /api/audits` - list audits (with filters)
- `GET /api/audits/:id` - get audit details
- `POST /api/audits/run` - trigger new audit
- `GET /api/audits/stats/summary` - get dashboard stats

### reports
- `GET /api/reports/:id/data` - get audit data for charts
- `GET /api/reports/:id/pdf` - download pdf report

## env variables

check `.env.example` for all available options

## testing

```bash
npm test
```

tests are in `__tests__/` folder (TODO: add more tests)
