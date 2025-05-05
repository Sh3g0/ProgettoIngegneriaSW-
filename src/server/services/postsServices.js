import { queryDB } from '../db/database.js';

// Funzione per ottenere il ruolo di un utente
export async function getRoleByUsernameAndPassword(username, password) {
  const query = `
    SELECT ruolo 
    FROM utente 
    WHERE username = $1 AND password_hash = $2;
  `;
  const params = [username, password];
  console.log('Query eseguita con questi parametri:', params);

  const result = await queryDB(query, params); 

  if (result.length > 0) {
    return result[0].ruolo;  // Restituisce il ruolo se trovato
  } else {
    return "";  // Restituisce una stringa vuota se non trovato
  }
}

// Funzione per inserire un nuovo cliente
export async function addClient(email, username, passwordHash, ruolo = "cliente", idAgenzia = null) {
  const query = `
    INSERT INTO utente (email, username, password_hash, ruolo, id_agenzia) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
  `;
  const params = [email, username, passwordHash, ruolo, idAgenzia];
  const result = await queryDB(query, params);

  if (result.length > 0) {
    return result[0].id;  // Restituisce l'ID del nuovo cliente
  } else {
    throw new Error("Errore nell'inserimento del cliente");
  }
}

// Funzione per creare un'agenzia
export async function creaAgenzia(nomeAgenzia, sedeAgenzia, emailAgenzia, idAdmin) {
  const query = `
    INSERT INTO agenzia (nome, sede, email, id_admin)
    VALUES ($1, $2, $3, $4)
    RETURNING id;
  `;
  const params = [nomeAgenzia, sedeAgenzia, emailAgenzia, idAdmin];
  const result = await queryDB(query, params);
  
  return result[0].id;
}
