const { Pool } = require("pg");

const ENV = require("../services/constants.service.js");

const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
});

module.exports = { conn: pool };
