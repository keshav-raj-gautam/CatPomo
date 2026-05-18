const express = require("express");
const pool    = require("../db/pool");
const router  = express.Router();

// POST /api/users  — onboard: create or fetch user by name
router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== "string" || !name.trim())
    return res.status(400).json({ error: "name is required" });

  const clean = name.trim().slice(0, 40);
  try {
    // Return existing user if same name exists, else create
    const existing = await pool.query(
      "SELECT * FROM users WHERE lower(name) = lower($1) LIMIT 1",
      [clean]
    );
    if (existing.rows.length) {
      // update last_seen
      await pool.query("UPDATE users SET last_seen=NOW() WHERE id=$1", [existing.rows[0].id]);
      return res.json(existing.rows[0]);
    }
    const result = await pool.query(
      "INSERT INTO users (name) VALUES ($1) RETURNING *",
      [clean]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// GET /api/users/:id
router.get("/:id", async (req, res) => {
  try {
    const r = await pool.query("SELECT * FROM users WHERE id=$1", [req.params.id]);
    if (!r.rows.length) return res.status(404).json({ error: "User not found" });
    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/users/:id  — update aggregated stats
router.patch("/:id", async (req, res) => {
  const allowed = [
    "total_sessions","total_minutes","streak","best_streak","last_study_date",
    "today_sessions","night_study","morning_study","cat_happiness","cat_accessory",
    "sudoku_solved","focus_score","achievements","unlocked_accessories",
  ];
  const fields = [], vals = [], idx = [];
  let i = 1;
  for (const k of allowed) {
    if (req.body[k] !== undefined) { fields.push(k); vals.push(req.body[k]); idx.push(`${k}=$${i++}`); }
  }
  if (!fields.length) return res.status(400).json({ error: "Nothing to update" });
  vals.push(req.params.id);
  try {
    const r = await pool.query(
      `UPDATE users SET ${idx.join(",")},last_seen=NOW() WHERE id=$${i} RETURNING *`,
      vals
    );
    if (!r.rows.length) return res.status(404).json({ error: "User not found" });
    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
