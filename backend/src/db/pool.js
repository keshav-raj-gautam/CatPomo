const { Pool } = require("pg");

const pool = new Pool({
  host:     process.env.DB_HOST || "localhost",
  port:     Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "catpomo",
  user:     process.env.DB_USER || "catpomo",
  password: process.env.DB_PASS || "catpomo_secret",
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => {
  console.error("Unexpected DB error", err);
});

module.exports = pool;
