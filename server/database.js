const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ingegneriaSW',
  password: 'claudia',
  port: 5432,
});

//ueue

module.exports = pool;
