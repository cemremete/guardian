# GUARDIAN Frontend

Vanilla JS dashboard for the GUARDIAN ML audit platform. No React, no Vue, just plain JavaScript and Chart.js.

## running locally

Just serve the files with any static server:

```bash
# python
python -m http.server 8080

# node
npx serve -p 8080

# or use the docker setup
docker-compose up frontend
```

Then open http://localhost:8080

## features

- login/logout (jwt auth)
- dark/light theme toggle
- model upload with drag & drop
- audit triggering
- results visualization with charts
- pdf report download

## structure

```
frontend/
├── index.html      # main html
├── css/
│   └── styles.css  # all styles
└── js/
    ├── api.js      # api wrapper
    └── app.js      # main app logic
```

## notes

- tokens are stored in memory, not localStorage (security requirement)
- refreshing the page will log you out (that's intentional)
- charts use Chart.js v4
