# Risotto Loan Application Portal

**Live URL:** Add your Vercel URL here  
**API URL:** Add your Render URL here

## Stack
- Backend: Node.js, Express, PostgreSQL (Neon)
- Frontend: React (Vite), React Router

## Local Setup

### Backend
```bash
cd backend
cp .env.example .env
# fill in DATABASE_URL
npm install
node src/index.js
```

The API runs on `http://localhost:3001`.

### Frontend
```bash
cd frontend
cp .env.example .env
# set VITE_API_URL=http://localhost:3001
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Database
Run `backend/migrations/001_init.sql` against your PostgreSQL instance.

## Known Issues
- Render free tier cold starts can take about 30 seconds on first load.
- No authentication: the agent portal is open access for this assignment.

## What I'd Improve
- Add pagination to the applications table.
- Add an auth layer for agent login.
- Send SMS confirmation to borrowers on status changes.
