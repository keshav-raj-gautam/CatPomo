const express = require("express");
const pool    = require("../db/pool");
const router  = express.Router();

// GET /api/stats/:userId
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    // Last 90 days of daily activity
    const daily = await pool.query(
      `SELECT day, sessions, minutes
       FROM daily_activity
       WHERE user_id=$1 AND day >= CURRENT_DATE - INTERVAL '90 days'
       ORDER BY day ASC`,
      [userId]
    );

    // Last 7 days
    const week = await pool.query(
      `SELECT day, sessions, minutes
       FROM daily_activity
       WHERE user_id=$1 AND day >= CURRENT_DATE - INTERVAL '6 days'
       ORDER BY day ASC`,
      [userId]
    );

    res.json({
      daily90: daily.rows,
      week:    week.rows,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/stats/:userId — update cat fields / achievements
router.patch("/:userId", async (req, res) => {
  const allowed = [
    "cat_happiness","cat_accessory","sudoku_solved",
    "achievements","unlocked_accessories","night_study","morning_study",
  ];
  const sets = [], vals = [];
  let i = 1;
  for (const k of allowed) {
    if (req.body[k] !== undefined) { sets.push(`${k}=$${i++}`); vals.push(req.body[k]); }
  }
  if (!sets.length) return res.status(400).json({ error: "Nothing to update" });
  vals.push(req.params.userId);
  try {
    const r = await pool.query(
      `UPDATE users SET ${sets.join(",")},last_seen=NOW() WHERE id=$${i} RETURNING *`, vals
    );
    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
