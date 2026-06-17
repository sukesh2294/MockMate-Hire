# MockMate Hire

![Frontend](https://img.shields.io/badge/frontend-React%2019-61DAFB)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688)
![Database](https://img.shields.io/badge/database-SQLAlchemy%2FAsync-4B8BBE)
![Deployment](https://img.shields.io/badge/deployment-Docker%20%7C%20Railway%20%7C%20Render-blue)
![Status](https://img.shields.io/badge/status-production-ready-brightgreen)
![License](https://img.shields.io/badge/license-Unspecified-lightgrey)

> MockMate Hire is a recruiter and candidate interview platform with LiveKit-powered interview rooms, Clerk authentication, resume analysis, recruiter dashboards, and interview evaluation workflows.

---

## Project Overview

MockMate Hire is a hiring platform built to support recruiters and candidates during interview sessions. The app combines a React/Vite frontend with a FastAPI backend, LiveKit video conferencing, Clerk authentication, and AI-driven candidate resume/interview analysis.

### What it does

- Recruiters can create and manage interview templates, review candidate reports, and monitor dashboard insights.
- Candidates can upload resumes, participate in interview sessions, and receive analyzed feedback.
- Interview sessions use LiveKit for real-time audio/video room access.
- The backend validates Clerk-issued JWTs and issues LiveKit access tokens.

### Target users

- Recruiters who need a lightweight hiring workflow platform.
- Candidates who want guided interview sessions and feedback.
- Teams evaluating interview performance and candidate scoring.

### Core features

- Candidate resume upload and analysis
- Interview creation and retrieval
- Role-based access control for recruiters and candidates
- LiveKit room token generation for interview sessions
- REST API with FastAPI, Pydantic validation, and OpenAPI docs
- Frontend built with React, Tailwind-inspired styling, and Clerk auth integration

---

## Architecture

```mermaid
flowchart LR
  FE[Frontend<br/>React + Vite] -->|HTTP API| API[Backend<br/>FastAPI]
  API --> DB[(Database<br/>PostgreSQL / SQLite)]
  API --> LiveKit[LiveKit Cloud]
  API --> Clerk[Clerk Auth]
  API --> AI[LangChain / OpenAI / Deepgram / Cartesia]
  API --> FS[(Resume Storage<br/>Local/Container)]
  FE -->|JWT bearer| API
  FE -->|LiveKit token request| API
  FE -->|LiveKit connect| LiveKit
```

### Request flow

1. User authenticates through Clerk in the frontend.
2. Frontend calls backend API with a bearer token.
3. Backend verifies Clerk JWT and loads user data.
4. Backend interacts with the database for interviews, reports, and resume metadata.
5. When candidates start a session, backend issues a LiveKit token.
6. Frontend connects directly to the LiveKit room using the issued token.

### Main components

- **Frontend**: React app under `Frontend/`.
- **Backend**: FastAPI service under `backend/`.
- **Database**: SQLAlchemy async models and session management.
- **Auth**: Clerk JWT verification, role enforcement in API dependencies.
- **Video**: LiveKit token generation via backend service.
- **AI/Agents**: Optional resume/interview analysis with LangChain and Deepgram dependencies.

---

## Tech Stack

### Frontend

- Framework: React 19
- Bundler: Vite
- Routing: React Router DOM
- API client: Axios
- Auth: Clerk
- State / data fetching: React Query
- UI / animations: Tailwind-compatible styling, Framer Motion

### Backend

- Runtime: Python 3.11+
- Framework: FastAPI
- API validation: Pydantic
- HTTP server: Uvicorn
- Async DB: SQLAlchemy asyncio

### Database

- ORM: SQLAlchemy asyncio
- Supported DBs: PostgreSQL via `asyncpg`; SQLite via `aiosqlite` for local tests

### DevOps

- Local dev: npm, Python virtual environments
- Deployment: Docker, Railway, Render, VPS
- Static hosting: Vercel / Netlify for frontend

### Integrations

- Authentication: Clerk
- Realtime video: LiveKit
- AI / NLP: LangChain, OpenAI, Deepgram, Cartesia
- File processing: pypdf, python-multipart

---

## Folder Structure

```text
MockMateHire/
├── backend/
│   ├── app/
│   │   ├── agents/             # LiveKit agent and AI agent utilities
│   │   ├── api/                # FastAPI route definitions and dependencies
│   │   ├── core/               # configuration and settings
│   │   ├── db/                 # database session and base model setup
│   │   ├── models/             # SQLAlchemy ORM models
│   │   ├── services/           # business logic and service helpers
│   │   ├── rag/                # retrieval-augmented generation artifacts
│   │   ├── repositories/       # data access layer
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   └── storage/            # resume/file storage helpers
│   ├── migrations/             # database migrations / SQL scripts
│   ├── main.py                 # FastAPI app entrypoint
│   ├── requirements.txt        # Python dependencies
│   └── .env                   # local secret config (ignored)
├── Frontend/
│   ├── public/                 # static assets
│   ├── src/                    # React source code
│   │   ├── api/                # Axios client and token provider
│   │   ├── components/         # UI components
│   │   ├── layouts/            # route wrapper components
│   │   ├── pages/              # page-level views
│   │   ├── services/           # frontend API service adapters
│   │   ├── hooks/              # reusable React hooks
│   │   └── config/             # Clerk configuration
│   ├── package.json            # frontend dependencies and scripts
│   ├── package-lock.json       # npm lockfile
│   ├── vite.config.js          # Vite configuration
│   └── .env                    # frontend runtime env vars
└── .gitignore
```

---

## Prerequisites

- Git: `git --version`
- Node: `node --version` (recommended `20.x`)
- npm: `npm --version` (recommended `10.x`)
- Python: `python --version` (recommended `3.11+`)
- pip: `python -m pip --version`
- Docker: `docker --version` (recommended `24.x`)

> Use `python -m pip install --upgrade pip` before installing backend dependencies.

---

## Environment Setup

### Backend environment variables

Create `backend/.env` from `backend/.env.example` and set values.

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/MockMate_hire
CLERK_JWK_URL=https://your-clerk-domain/.well-known/jwks.json
CLERK_ISSUER=https://issuer.clerk.dev
LIVEKIT_API_KEY=livekit_api_key
LIVEKIT_API_SECRET=livekit_api_secret
LIVEKIT_URL=wss://your-livekit-host
RESUME_STORAGE_DIR=./storage/resumes
ALLOW_ORIGINS=["http://localhost:5173","http://localhost:8000"]
```

- `DATABASE_URL` — required. Example: `postgresql+asyncpg://user:pass@localhost:5432/MockMate_hire`.
- `CLERK_JWK_URL` — required. Clerk JWK set URL for JWT validation.
- `CLERK_ISSUER` — required. Clerk issuer URL for JWT checks.
- `LIVEKIT_API_KEY` — required. LiveKit API key for token generation.
- `LIVEKIT_API_SECRET` — required. LiveKit API secret.
- `LIVEKIT_URL` — required. LiveKit signaling URL.
- `RESUME_STORAGE_DIR` — optional. Directory for resume uploads.
- `ALLOW_ORIGINS` — optional. API CORS allow list.

### Frontend environment variables

Create `Frontend/.env` from `Frontend/.env.example`.

```env
VITE_API_URL=http://localhost:8000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-host
```

- `VITE_API_URL` — required. Backend API base URL.
- `VITE_CLERK_PUBLISHABLE_KEY` — required. Clerk publishable key for browser auth.
- `NEXT_PUBLIC_LIVEKIT_URL` — required. LiveKit websocket URL.

---

## Local Development

### 1. Backend

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

Run the backend:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Available locally:

- Backend API: `http://localhost:8000/api`
- Health check: `http://localhost:8000/api/health/ping`
- OpenAPI docs: `http://localhost:8000/docs`

### 2. Frontend

```bash
cd Frontend
npm install
npm run dev
```

Available locally:

- Frontend app: `http://localhost:5173`

### Troubleshooting

- If the backend fails to start, verify `backend/.env` exists and contains `DATABASE_URL`, `CLERK_JWK_URL`, `CLERK_ISSUER`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, and `LIVEKIT_URL`.
- If the frontend fails on `VITE_CLERK_PUBLISHABLE_KEY`, confirm `Frontend/.env` includes the key and restart the dev server.
- If CORS errors appear, add the frontend origin(s) to `ALLOW_ORIGINS` in `backend/.env`.

---

## Production Build

### Frontend

```bash
cd Frontend
npm run build
```

The static output is generated at `Frontend/dist`.

### Backend

The backend does not require a compile step. For production use:

```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

Use a `DATABASE_URL` pointing to a production-ready database and ensure `LIVEKIT_*` and `CLERK_*` values are set.

### Optimization notes

- Keep `package-lock.json` checked in for consistent frontend installs.
- Use `npm ci` in CI/CD when available.
- Cache Python virtualenv or Docker layers for faster backend builds.

---

## Deployment Guide

### Frontend hosting

Use Vercel or Netlify for the React app.

- Build command: `npm run build`
- Publish directory: `Frontend/dist`
- Env vars: `VITE_API_URL`, `VITE_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_LIVEKIT_URL`

### Backend hosting

Use Railway, Render, or any VPS.

Recommended start command:

```bash
uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 4
```

Required env vars:

- `DATABASE_URL`
- `CLERK_JWK_URL`
- `CLERK_ISSUER`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `LIVEKIT_URL`
- `RESUME_STORAGE_DIR`
- `ALLOW_ORIGINS`

### Docker

Build and run the backend:

```bash
docker build -t MockMate-hire-backend ./backend
docker run -d -p 8000:8000 --env-file backend/.env MockMate-hire-backend
```

Build and serve the frontend using any static host, or deploy the `Frontend/dist` folder.

### Docker Compose example

```yaml
version: "3.9"
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    restart: unless-stopped
  frontend:
    build: ./Frontend
    ports:
      - "5173:5173"
    env_file:
      - ./Frontend/.env
    restart: unless-stopped
```

### Rollback strategy

- Tag builds by version or commit hash.
- Keep previous Docker image tags available.
- If a deployment fails, redeploy the last-known-good tag.
- Test env values in a staging environment before production.

---

## CI/CD

Recommended GitHub Actions workflow steps:

1. Checkout code
2. Install frontend dependencies and run `npm run build`
3. Install backend dependencies and run a lint/type check or startup smoke test
4. Deploy artifacts or Docker images to a target environment

Sample workflow snippet:

```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v5
        with:
          node-version: "20"
      - name: Install frontend deps
        run: |
          cd Frontend
          npm ci
      - name: Build frontend
        run: |
          cd Frontend
          npm run build
      - name: Setup Python
        uses: actions/setup-python@v6
        with:
          python-version: "3.11"
      - name: Install backend deps
        run: |
          cd backend
          python -m pip install -r requirements.txt
      - name: Backend smoke test
        run: |
          cd backend
          python -m py_compile main.py
```

---

## Security

- Auth flow: frontend uses Clerk browser auth; backend verifies Clerk JWT tokens with `CLERK_JWK_URL` and `CLERK_ISSUER`.
- Secrets: store API keys, Clerk and LiveKit credentials in environment variables only.
- CORS: backend reads `ALLOW_ORIGINS` and applies it through FastAPI middleware.
- Validation: request and response payloads are validated with Pydantic schemas.
- HTTPS: always serve production traffic over TLS.
- Rate limiting: implement service-level rate limiting in production if exposing public endpoints.

---

## Monitoring

- Backend logs: capture stdout and stderr from Uvicorn.
- Analytics: track frontend usage via your chosen analytics provider.
- Uptime: use a uptime monitor for `http://<backend-host>/api/health/ping`.
- Error tracking: add Sentry, Logflare, or a similar service for runtime exceptions.

---

## API Documentation

### Health

- `GET /api/health/ping`
  - Response: `{ status: "ok", message: "MockMate Hire backend is running" }`

### Auth

- `GET /api/me`
  - Auth: required
  - Response: current user profile from Clerk-backed auth.

### Candidates

- `GET /api/candidates/`
  - Auth: recruiter only
  - Response: candidate list.
- `POST /api/candidates/me/resume`
  - Auth: candidate only
  - Upload resume file and receive analysis.

### Interviews

- `GET /api/interviews/`
  - Auth: required
  - Recruiters see their interviews; candidates see open interviews.
- `POST /api/interviews/`
  - Auth: recruiter only
  - Create a new interview.
- `GET /api/interviews/{interview_id}`
  - Auth: required
  - Get interview details.
- `POST /api/interviews/{interview_id}/analysis`
  - Auth: required
  - Submit answer text for analysis.
- `PUT /api/interviews/{interview_id}`
  - Auth: recruiter only
  - Update interview details.
- `DELETE /api/interviews/{interview_id}`
  - Auth: recruiter only
  - Delete an interview.
- `POST /api/interviews/{interview_id}/sessions`
  - Auth: candidate only
  - Start a candidate session.

### Reports

- `GET /api/reports/{candidate_id}`
  - Auth: recruiter or matching candidate
  - Get candidate interview report.

### LiveKit

- `POST /api/livekit/token`
  - Auth: required
  - Request body: `{ interview_id, identity, room_name }`
  - Response: LiveKit token and URL.

---

## Performance

- Use `npm run build` to generate an optimized frontend bundle.
- Avoid shipping debug mode to production.
- Use HTTP caching headers for static assets.
- Minimize repeated API requests with frontend caching.
- Use indexed database columns for lookups in production.

---

## Troubleshooting

| Issue                      | Cause                                | Fix                                                               |
| -------------------------- | ------------------------------------ | ----------------------------------------------------------------- |
| Backend fails to start     | Missing or invalid `backend/.env`    | Copy `backend/.env.example`, set required values, restart backend |
| Frontend auth errors       | Missing `VITE_CLERK_PUBLISHABLE_KEY` | Add key to `Frontend/.env` and restart `npm run dev`              |
| CORS blocked               | `ALLOW_ORIGINS` not matching origin  | Add frontend origin to `ALLOW_ORIGINS`                            |
| Database connection failed | `DATABASE_URL` is invalid            | Verify DB connection string and reachable database                |
| LiveKit room connect fails | Invalid LiveKit credentials or URL   | Confirm `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `LIVEKIT_URL`    |

---

## Production Checklist

- [ ] Environment variables configured in hosting environment
- [ ] Frontend build passes
- [ ] Backend loads without startup errors
- [ ] HTTPS / TLS enabled
- [ ] Secrets stored securely
- [ ] Logging enabled
- [ ] Monitoring / uptime checks configured
- [ ] Backup or persistence strategy for database in place

---

## Contributors

- MockMate Hire Team
- Engineering, design, and product contributors supporting recruiter interview workflows

---

## License

This repository does not currently include a `LICENSE` file. Add a license such as `MIT`, `Apache-2.0`, or another compatible license before publishing.
