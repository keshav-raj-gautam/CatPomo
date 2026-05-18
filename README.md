#  CatPomo — Microservices Pomodoro App

A cozy study companion with animated cats, real PostgreSQL storage, leaderboards, and analytics.

---

## Architecture

```
catpomo-v2/
├── frontend/          React 18 + Vite  (port 80 in Docker)
├── backend/           Node.js + Express (port 4000)
│   └── src/
│       ├── db/
│       │   ├── init.sql    ← schema, runs automatically
│       │   └── pool.js     ← pg connection pool
│       ├── routes/
│       │   ├── users.js        POST/GET/PATCH
│       │   ├── sessions.js     POST/GET
│       │   ├── todos.js        CRUD
│       │   ├── leaderboard.js  GET (real DB data)
│       │   └── stats.js        GET/PATCH
│       └── index.js
└── docker-compose.yml  3 services: db · api · frontend
```

### Services
| Service  | Tech               | Port |
|----------|--------------------|------|
| db       | PostgreSQL 16      | 5432 |
| api      | Node.js / Express  | 4000 |
| frontend | React / nginx      | 80   |

---

##  Quick Start (Docker)

```bash
# 1. Clone / unzip project
cd catpomo-v2

# 2. Start everything
docker compose up --build

# 3. Open browser
open http://localhost
```

That's it. PostgreSQL initialises automatically on first run.

---

## 🛠 Local Development (without Docker)

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ running locally

### Backend
```bash
cd backend
npm install
# copy and edit env
cp .env.example .env
npm run dev         # http://localhost:4000
```

### Frontend
```bash
cd frontend
npm install
# set API URL
echo "VITE_API_URL=http://localhost:4000" > .env.local
npm run dev         # http://localhost:5173
```

---

## API Reference

| Method | Path                       | Description                     |
|--------|----------------------------|---------------------------------|
| POST   | /api/users                 | Create / fetch user by name     |
| GET    | /api/users/:id             | Get user profile                |
| PATCH  | /api/users/:id             | Update user fields              |
| POST   | /api/sessions              | Record completed session        |
| GET    | /api/sessions/:userId      | Last 100 sessions               |
| GET    | /api/todos/:userId         | List todos                      |
| POST   | /api/todos                 | Create todo                     |
| PATCH  | /api/todos/:id             | Toggle / edit todo              |
| DELETE | /api/todos/:id             | Delete todo                     |
| GET    | /api/leaderboard           | Rankings (real DB data)         |
| GET    | /api/stats/:userId         | 90-day + weekly activity        |
| PATCH  | /api/stats/:userId         | Update cat / achievements       |
| GET    | /health                    | Health check                    |

### Leaderboard query params
- `category` — `sessions` | `hours` | `streak` | `score`
- `limit`    — max 50 (default 20)

---

## Database Schema

```sql
users            -- profile + aggregated counters
sessions         -- each focus/break event
daily_activity   -- one row per user per day
todos            -- per-user todo items
```

Aggregates (`total_sessions`, `streak`, `focus_score`, etc.) are updated atomically in a single transaction when a session is recorded — fast leaderboard queries, no recalculation needed.

---

## Environment Variables

### Backend `.env`
```
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=catpomo
DB_USER=catpomo
DB_PASS=catpomo_secret
JWT_SECRET=change_me
CORS_ORIGIN=http://localhost:5173
```

### Frontend `.env.local`
```
VITE_API_URL=http://localhost:4000
```

---

## Features
-  Animated cats (idle / studying / sleeping / happy)
-  Pomodoro timer — focus, short break, long break
-  Analytics — weekly bar chart, 90-day heatmap, donut
-  Real leaderboard from PostgreSQL — no dummy data
-  Sudoku break mode
-  Todos synced to DB
-  Cat accessories unlocked by session count
-  Dark / light mode
-  All data persists in PostgreSQL
-  Name-based onboarding (no passwords needed)
-  One-command Docker deployment
