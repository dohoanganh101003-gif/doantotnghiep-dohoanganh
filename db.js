const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "quanly_nhamay_dien",
  password: "123456",
  port: 5432,
});

module.exports = pool;
