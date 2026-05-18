const express = require("express");
const pool    = require("../db/pool");
const router  = express.Router();

// GET /api/leaderboard?category=sessions&limit=20
// category: sessions | minutes | streak | score
router.get("/", async (req, res) => {
  const { category = "sessions", limit = 20 } = req.query;

  const ORDER_MAP = {
    sessions: "total_sessions DESC",
    hours:    "total_minutes  DESC",
    streak:   "streak         DESC",
    score:    "focus_score    DESC",
  };

  const orderBy = ORDER_MAP[category] || ORDER_MAP.sessions;
  const safeLimit = Math.min(50, Math.max(1, parseInt(limit) || 20));

  try {
    const r = await pool.query(
      `SELECT
         id, name,
         total_sessions,
         ROUND(total_minutes::numeric / 60, 1) AS total_hours,
         streak,
         best_streak,
         focus_score,
         cat_accessory,
         achievements,
         ROW_NUMBER() OVER (ORDER BY ${orderBy}) AS rank
       FROM users
       WHERE total_sessions > 0
       ORDER BY ${orderBy}
       LIMIT $1`,
      [safeLimit]
    );
    res.json(r.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
