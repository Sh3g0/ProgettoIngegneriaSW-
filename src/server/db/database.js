import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ING',
  password: 'sonsycomb',
  port: 5432,
});

async function queryDB(query, params = []) {
  try {
    const { rows } = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error('Errore eseguendo la query:', error);
    throw error;
  }
}

export { pool, queryDB };  // Aggiungi 'pool' all'esportazione
