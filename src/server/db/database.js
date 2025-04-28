const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ING',
  password: 'giuseppe',
  port: 5432,
});

//Funzione GENERICA per eseguire qualsiasi query
async function queryDB(query, params = []) {
  try {
    const { rows } = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error('Errore eseguendo la query:', error);
    throw error;
  }
}

module.exports = {
  pool,
  queryDB
};
