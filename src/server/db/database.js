import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ingegneriaSW',
  password: 'claudia',
  port: 5432,
});

async function queryDB(query, params = []) {
  console.log("Eseguendo query:", query);
  console.log("Con parametri:", params);
  try {
    const res = await pool.query(query, params);
    console.log("Risultato query:", res.rows);
    return res.rows;
  } catch (err) {
    console.error("Errore nella query:", err);
    throw err;
  }
}

export { pool, queryDB };  // Aggiungi 'pool' all'esportazione
