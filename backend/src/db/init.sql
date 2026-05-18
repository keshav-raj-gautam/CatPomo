-- ============================================================
--  CatPomo – PostgreSQL Schema
--  Auto-runs on first container start via init.sql mount
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 TEXT        NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- aggregated counters (denormalised for O(1) leaderboard reads)
  total_sessions       INT  NOT NULL DEFAULT 0,
  total_minutes        INT  NOT NULL DEFAULT 0,
  streak               INT  NOT NULL DEFAULT 0,
  best_streak          INT  NOT NULL DEFAULT 0,
  last_study_date      DATE,
  today_sessions       INT  NOT NULL DEFAULT 0,
  night_study          BOOL NOT NULL DEFAULT FALSE,
  morning_study        BOOL NOT NULL DEFAULT FALSE,
  cat_happiness        INT  NOT NULL DEFAULT 60,
  cat_accessory        TEXT NOT NULL DEFAULT 'none',
  sudoku_solved        INT  NOT NULL DEFAULT 0,
  focus_score          INT  NOT NULL DEFAULT 0,
  achievements         TEXT[] NOT NULL DEFAULT '{}',
  unlocked_accessories TEXT[] NOT NULL DEFAULT '{none}'
);

-- ── Focus Sessions ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sessions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mode        TEXT        NOT NULL CHECK (mode IN ('focus','shortBreak','longBreak')),
  duration    INT         NOT NULL,   -- minutes
  completed   BOOL        NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Daily Activity (1 row per user per day) ───────────────────
CREATE TABLE IF NOT EXISTS daily_activity (
  user_id  UUID  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day      DATE  NOT NULL,
  sessions INT   NOT NULL DEFAULT 0,
  minutes  INT   NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, day)
);

-- ── Todos ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS todos (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text       TEXT        NOT NULL,
  done       BOOL        NOT NULL DEFAULT FALSE,
  priority   TEXT        NOT NULL DEFAULT 'medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_sessions_user   ON sessions      (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_user_day  ON daily_activity(user_id, day        DESC);
CREATE INDEX IF NOT EXISTS idx_todos_user      ON todos         (user_id, created_at DESC);

-- Leaderboard covering indexes
CREATE INDEX IF NOT EXISTS idx_lb_sessions ON users (total_sessions DESC);
CREATE INDEX IF NOT EXISTS idx_lb_minutes  ON users (total_minutes  DESC);
CREATE INDEX IF NOT EXISTS idx_lb_streak   ON users (streak         DESC);
CREATE INDEX IF NOT EXISTS idx_lb_score    ON users (focus_score    DESC);
