const { Pool } = require("pg");

const ENV = require("../services/constants.service.js");

const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
});

pool.on("error", (err, client) => {
  console.error("Unexpected idle PostgreSQL client error:", err);
});

module.exports = { conn: pool };
