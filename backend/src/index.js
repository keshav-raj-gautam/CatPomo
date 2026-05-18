const express = require("express");
const cors    = require("cors");
const helmet  = require("helmet");
const morgan  = require("morgan");

const usersRouter    = require("./routes/users");
const sessionsRouter = require("./routes/sessions");
const todosRouter    = require("./routes/todos");
const leaderRouter   = require("./routes/leaderboard");
const statsRouter    = require("./routes/stats");

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
app.use(morgan("dev"));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ ok: true, ts: new Date() }));

app.use("/api/users",       usersRouter);
app.use("/api/sessions",    sessionsRouter);
app.use("/api/todos",       todosRouter);
app.use("/api/leaderboard", leaderRouter);
app.use("/api/stats",       statsRouter);

// ── 404 ───────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: "Not found" }));

// ── Error handler ─────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () =>
  console.log(`\n🐱 CatPomo API → http://localhost:${PORT}\n`)
);
