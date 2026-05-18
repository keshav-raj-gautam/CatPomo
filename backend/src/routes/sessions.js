const express = require("express");
const pool    = require("../db/pool");
const router  = express.Router();

// POST /api/sessions — record a completed session
router.post("/", async (req, res) => {
  const { user_id, mode = "focus", duration, completed = true } = req.body;
  if (!user_id || !duration)
    return res.status(400).json({ error: "user_id and duration required" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert session
    const s = await client.query(
      `INSERT INTO sessions (user_id,mode,duration,completed)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [user_id, mode, duration, completed]
    );

    if (mode === "focus" && completed) {
      const today = new Date().toISOString().slice(0, 10);

      // Upsert daily_activity
      await client.query(
        `INSERT INTO daily_activity (user_id, day, sessions, minutes)
         VALUES ($1,$2,1,$3)
         ON CONFLICT (user_id, day)
         DO UPDATE SET sessions=daily_activity.sessions+1, minutes=daily_activity.minutes+$3`,
        [user_id, today, duration]
      );

      // Update user aggregates
      await client.query(
        `UPDATE users
         SET total_sessions = total_sessions + 1,
             total_minutes  = total_minutes  + $2,
             today_sessions = CASE WHEN last_study_date=CURRENT_DATE THEN today_sessions+1 ELSE 1 END,
             streak         = CASE
                                WHEN last_study_date = CURRENT_DATE - INTERVAL '1 day' THEN streak + 1
                                WHEN last_study_date = CURRENT_DATE THEN streak
                                ELSE 1
                              END,
             best_streak    = GREATEST(best_streak,
                                CASE
                                  WHEN last_study_date = CURRENT_DATE - INTERVAL '1 day' THEN streak + 1
                                  WHEN last_study_date = CURRENT_DATE THEN streak
                                  ELSE 1
                                END),
             last_study_date = CURRENT_DATE,
             cat_happiness  = LEAST(100, cat_happiness + 8),
             focus_score    = LEAST(100,
                                GREATEST(0,
                                  ROUND((total_sessions+1)*4 + streak*8) / 3
                                )::INT),
             last_seen      = NOW()
         WHERE id=$1`,
        [user_id, duration]
      );
    }

    await client.query("COMMIT");
    res.status(201).json(s.rows[0]);
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
});

// GET /api/sessions/:userId — last 100 sessions
router.get("/:userId", async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT * FROM sessions WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100`,
      [req.params.userId]
    );
    res.json(r.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
