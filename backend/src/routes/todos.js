const express = require("express");
const pool    = require("../db/pool");
const router  = express.Router();

// GET /api/todos/:userId
router.get("/:userId", async (req, res) => {
  try {
    const r = await pool.query(
      "SELECT * FROM todos WHERE user_id=$1 ORDER BY created_at ASC",
      [req.params.userId]
    );
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/todos
router.post("/", async (req, res) => {
  const { user_id, text, priority = "medium" } = req.body;
  if (!user_id || !text) return res.status(400).json({ error: "user_id and text required" });
  try {
    const r = await pool.query(
      "INSERT INTO todos (user_id,text,priority) VALUES ($1,$2,$3) RETURNING *",
      [user_id, text.trim().slice(0, 200), priority]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PATCH /api/todos/:id
router.patch("/:id", async (req, res) => {
  const { done, text } = req.body;
  const sets = [], vals = [];
  let i = 1;
  if (done !== undefined) { sets.push(`done=$${i++}`); vals.push(done); }
  if (text !== undefined) { sets.push(`text=$${i++}`); vals.push(text.trim().slice(0,200)); }
  if (!sets.length) return res.status(400).json({ error: "Nothing to update" });
  vals.push(req.params.id);
  try {
    const r = await pool.query(
      `UPDATE todos SET ${sets.join(",")} WHERE id=$${i} RETURNING *`, vals
    );
    res.json(r.rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/todos/:id
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM todos WHERE id=$1", [req.params.id]);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
