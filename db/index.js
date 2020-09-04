const { Pool } = require("pg");

const pool = new Pool(); // look at the local variables in .env

module.exports = {
  query: (text, params) => pool.query(text, params),
};
