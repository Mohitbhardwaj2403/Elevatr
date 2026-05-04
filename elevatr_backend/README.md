# Elevatr – Backend API
### AI Resume Builder & Job Preparation Tool
**FastAPI · PostgreSQL · Redis · OpenAI · Docker**

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Quick Start (Local)](#quick-start-local)
4. [Docker Setup](#docker-setup)
5. [Environment Variables](#environment-variables)
6. [API Reference](#api-reference)
7. [Example Requests](#example-requests)
8. [Database Migrations](#database-migrations)
9. [Frontend Integration](#frontend-integration)
10. [Production Checklist](#production-checklist)

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                 │
│               http://localhost:5173                      │
└──────────────────────┬───────────────────────────────────┘
                       │ HTTP / JSON  (Bearer JWT)
┌──────────────────────▼───────────────────────────────────┐
│             FastAPI Backend  :8000                        │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  ┌─────────┐  │
│  │  /auth  │  │ /resume  │  │/interview │  │  /jobs  │  │
│  └────┬────┘  └────┬─────┘  └─────┬─────┘  └────┬────┘  │
│       └────────────┴──────────────┴──────────────┘       │
│            Service Layer  →  AI Layer (OpenAI)            │
│            SQLAlchemy ORM + Pydantic Schemas              │
└────────┬──────────────────────────┬──────────────────────┘
         │                          │
┌────────▼────────┐      ┌──────────▼─────────┐
│  PostgreSQL 16  │      │     Redis 7         │
│  (Primary DB)   │      │  (Cache / Sessions) │
└─────────────────┘      └────────────────────┘
```

---

## Project Structure

```
backend/
├── main.py                       # FastAPI app entry point
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── alembic.ini                   # DB migration config
├── alembic/
│   ├── env.py
│   └── versions/                 # migration scripts
└── app/
    ├── api/
    │   ├── deps.py               # shared dependencies (auth guard)
    │   └── v1/
    │       ├── router.py         # mounts all routers
    │       └── endpoints/
    │           ├── auth.py       # /auth/*
    │           ├── resume.py     # /resume/*
    │           ├── interview.py  # /interview/*
    │           ├── jobs.py       # /jobs/*
    │           └── ai.py         # /ai/*
    ├── services/                 # business logic (one file per feature)
    │   ├── auth_service.py
    │   ├── resume_service.py
    │   ├── interview_service.py
    │   ├── job_service.py
    │   └── ai_service.py
    ├── models/                   # SQLAlchemy ORM models
    │   ├── user.py
    │   ├── resume.py
    │   ├── job_application.py
    │   ├── interview_session.py
    │   └── ai_conversation.py
    ├── schemas/                  # Pydantic request/response models
    │   ├── auth.py
    │   ├── resume.py
    │   ├── job_application.py
    │   ├── interview.py
    │   └── ai.py
    ├── ai/
    │   ├── openai_client.py      # async OpenAI wrapper + dev stub
    │   └── prompts.py            # all system prompts
    ├── database/
    │   ├── session.py            # async engine + get_db dependency
    │   └── redis_client.py       # Redis helpers (cache_get/set/delete)
    └── core/
        ├── config.py             # pydantic-settings (reads .env)
        ├── security.py           # bcrypt + JWT
        ├── logging.py            # structured logging setup
        └── exceptions.py        # domain errors + HTTP helpers
```

---

## Quick Start (Local)

### Prerequisites
- Python 3.11+
- PostgreSQL 15+ running locally
- Redis 7+ running locally
- (Optional) OpenAI API key

### 1 – Clone and set up Python env

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2 – Configure environment

```bash
cp .env.example .env
# Edit .env:
#   DATABASE_URL = postgresql+asyncpg://postgres:yourpassword@localhost:5432/elevatr
#   REDIS_URL    = redis://localhost:6379/0
#   JWT_SECRET   = <run: python -c "import secrets; print(secrets.token_hex(32))">
#   OPENAI_API_KEY = sk-...  (leave blank to use dev stubs)
```

### 3 – Create the database

```bash
# In psql or pgAdmin:
CREATE DATABASE elevatr;
```

### 4 – Run the server

```bash
uvicorn main:app --reload --port 8000
```

The API is now at **http://localhost:8000**
Interactive docs: **http://localhost:8000/docs**

---

## Docker Setup

The easiest way – one command starts PostgreSQL, Redis, and the API:

```bash
# 1. Create .env (only OPENAI_API_KEY and JWT_SECRET need changing)
cp .env.example .env

# 2. Build and start all services
docker compose up --build

# 3. (Optional) Run in background
docker compose up --build -d

# 4. Stop everything
docker compose down

# 5. Stop and wipe data volumes
docker compose down -v
```

**Service URLs inside Docker:**
| Service | URL |
|---------|-----|
| FastAPI API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql+asyncpg://...` | Async PostgreSQL connection string |
| `REDIS_URL` | `redis://localhost:6379/0` | Redis connection URL |
| `JWT_SECRET` | *(required)* | Secret for signing JWTs – use a 32+ char random string |
| `JWT_ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `10080` | Token TTL (7 days) |
| `OPENAI_API_KEY` | *(blank)* | OpenAI key – if blank, dev stubs are returned |
| `OPENAI_MODEL` | `gpt-4o-mini` | OpenAI model to use |
| `ENVIRONMENT` | `development` | `development` or `production` |
| `DEBUG` | `true` | Enables SQL echo and debug logging |
| `CORS_ORIGINS` | `["http://localhost:5173",...]` | Allowed CORS origins |
| `CACHE_TTL` | `300` | Default Redis cache TTL (seconds) |

---

## API Reference

All endpoints (except `/health`) are prefixed with `/api/v1`.

### Authentication

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/auth/register` | ❌ | Register new user |
| `POST` | `/api/v1/auth/login` | ❌ | Login, get JWT |
| `GET` | `/api/v1/auth/profile` | ✅ | Get own profile |
| `PUT` | `/api/v1/auth/profile` | ✅ | Update own profile |

### Resume

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/resume/create` | ✅ | Create resume (+ optional ATS score) |
| `POST` | `/api/v1/resume/improve` | ✅ | AI-improve a resume |
| `POST` | `/api/v1/resume/ats-score` | ✅ | ATS score vs job description |
| `GET` | `/api/v1/resume/` | ✅ | List all user resumes |
| `GET` | `/api/v1/resume/{id}` | ✅ | Get single resume |
| `PUT` | `/api/v1/resume/{id}` | ✅ | Update resume |
| `DELETE` | `/api/v1/resume/{id}` | ✅ | Delete resume |

### Mock Interview

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/interview/generate-questions` | ✅ | Generate interview questions |
| `POST` | `/api/v1/interview/analyze-answer` | ✅ | Submit answer, get AI feedback |
| `GET` | `/api/v1/interview/history` | ✅ | Interview session history |
| `GET` | `/api/v1/interview/{session_id}` | ✅ | Single session details |

### Job Tracker

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/jobs/add` | ✅ | Add job application |
| `GET` | `/api/v1/jobs/list` | ✅ | List jobs (filterable by `?status=`) |
| `GET` | `/api/v1/jobs/stats` | ✅ | Application stats by status |
| `PUT` | `/api/v1/jobs/{id}` | ✅ | Update application |
| `DELETE` | `/api/v1/jobs/{id}` | ✅ | Delete application |

### AI Career Guidance

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/ai/career-advice` | ✅ | Get AI career guidance |

---

## Example Requests

### Register

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"secret123"}'
```

```json
{"id": "uuid...", "email": "jane@example.com", "name": "Jane Doe"}
```

### Login

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"secret123"}'
```

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {"id": "...", "name": "Jane Doe", "email": "jane@example.com", "plan": "free", ...}
}
```

### ATS Score

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:8000/api/v1/resume/ats-score \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "John Doe | john@email.com\n\nSoftware Engineer with 5 years experience in Python, FastAPI, PostgreSQL, Docker...",
    "job_description": "We are looking for a Backend Engineer with Python, FastAPI, PostgreSQL, Docker and Kubernetes experience..."
  }'
```

```json
{
  "score": 78.5,
  "grade": "C",
  "message": "Good match – add Kubernetes to strengthen your application.",
  "keywords_found": ["Python", "FastAPI", "PostgreSQL", "Docker"],
  "keywords_missing": ["Kubernetes", "CI/CD"],
  "strengths": ["Strong technical skills section", "Relevant work experience"],
  "suggestions": [
    {"category": "Keywords", "message": "Add Kubernetes experience or coursework", "priority": "high"},
    {"category": "Achievements", "message": "Quantify impact with numbers (e.g. 'reduced latency by 40%')", "priority": "medium"}
  ],
  "section_scores": {"summary": 80, "experience": 75, "skills": 85, "education": 90}
}
```

### Generate Interview Questions

```bash
curl -X POST http://localhost:8000/api/v1/interview/generate-questions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"job_role":"Software Engineer","difficulty":"intermediate","num_questions":3}'
```

```json
{
  "job_role": "Software Engineer",
  "difficulty": "intermediate",
  "questions": [
    "Describe a time you had to optimise a slow database query. What was your approach?",
    "How would you design a URL shortener service?",
    "Tell me about a challenging bug you debugged. How did you find and fix it?"
  ]
}
```

### Add Job Application

```bash
curl -X POST http://localhost:8000/api/v1/jobs/add \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Google",
    "role": "Senior Software Engineer",
    "status": "applied",
    "job_url": "https://careers.google.com/...",
    "location": "Bangalore, India",
    "salary_range": "₹40L – ₹60L"
  }'
```

### Get Career Advice

```bash
curl -X POST http://localhost:8000/api/v1/ai/career-advice \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I am a 2nd year CS student. How should I prepare for SDE roles at big tech?",
    "current_role": "Student",
    "target_role": "Software Engineer",
    "years_experience": 0,
    "skills": ["Python", "C++", "Data Structures"]
  }'
```

---

## Database Migrations

This project uses **Alembic** for schema migrations.

```bash
# Generate a new migration after changing models
alembic revision --autogenerate -m "add_column_xyz"

# Apply all pending migrations
alembic upgrade head

# Downgrade one step
alembic downgrade -1

# View migration history
alembic history
```

> **Note:** On first run, `create_tables()` in `lifespan()` auto-creates all tables.
> Use Alembic for any subsequent schema changes in production.

---

## Frontend Integration

The `resume-builder` app uses `VITE_API_URL` (default `http://localhost:8000/api/v1`) for FastAPI.  
The legacy Express server under `resume-builder/server` has been **removed**; ATS quick analysis on the public “Resume Analysis” page runs in the browser (`ATSAnalyzer` + PDF text via `pdfjs-dist`). For authenticated AI ATS scoring against a job description, call FastAPI:

| Legacy (removed Node on :5000) | FastAPI |
|----------------------------------|-----------|
| `http://localhost:5000/api/ats/analyze` | Browser: `ATSAnalyzer` + optional `POST /api/v1/resume/ats-score` (JWT + JSON body) |
| `http://localhost:5566/api/auth/...` | `http://localhost:8000/api/v1/auth/...` |

| Old (Node.js) | New (FastAPI) |
|---------------|---------------|
| `http://localhost:5566/api/auth/register` | `http://localhost:8000/api/v1/auth/register` |
| `http://localhost:5566/api/auth/login` | `http://localhost:8000/api/v1/auth/login` |
| `http://localhost:5566/api/resumes/upload` | `http://localhost:8000/api/v1/resume/create` |
| `http://localhost:5566/api/interviews` | `http://localhost:8000/api/v1/interview/analyze-answer` |
| `http://localhost:5566/api/jobs` | `http://localhost:8000/api/v1/jobs/list` |
| `http://localhost:5566/api/ats` | `http://localhost:8000/api/v1/resume/ats-score` |

**Auth header format** (same as before):
```
Authorization: Bearer <token>
```

**Login response** now includes a `user` object alongside `access_token` – update `AuthContext.tsx`:
```typescript
const { access_token, user } = await resp.json();
localStorage.setItem('token', access_token);
login(user.name, user.plan);
```

---

## Production Checklist

- [ ] Set `ENVIRONMENT=production` and `DEBUG=false`
- [ ] Use a strong random `JWT_SECRET` (32+ chars)
- [ ] Set `DATABASE_URL` to your production PostgreSQL
- [ ] Use `CORS_ORIGINS` with only your real frontend domain
- [ ] Run `alembic upgrade head` before deploying
- [ ] Configure a reverse proxy (nginx / Caddy) with TLS
- [ ] Set `uvicorn --workers` to `2 × CPU_cores + 1`
- [ ] Enable PostgreSQL connection pooling (PgBouncer)
- [ ] Set Redis `maxmemory` and eviction policy
- [ ] Store `OPENAI_API_KEY` in a secrets manager (not plain `.env`)
