const { queryDB } = require('../db/database');

//Funzione per ottenere il ruolo di un utente
async function getRoleByUsernameAndPassword(username, password) {
  const query = `
    SELECT ruolo 
    FROM utente 
    WHERE username = $1 AND password_hash = $2;
  `;
  const params = [username, password];
  console.log('Query eseguita con questi parametri:', params);

  const result = await queryDB(query, params);

  if (result.length > 0) {
    return result[0].ruolo;  //Restituisce il ruolo se trovato
  } else {
    return "";  //Restituisce una stringa vuota se non trovato
  }
}

// Funzione per inserire un nuovo cliente
async function addClient(email, username, passwordHash, ruolo = "cliente", idAgenzia = null) {
    const query = `
      INSERT INTO utente (email, username, password_hash, ruolo, id_agenzia) 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `;
    const params = [email, username, passwordHash, ruolo, idAgenzia];
    const result = await queryDB(query, params);
  
    if (result.length > 0) {
      return result[0].id;  //Restituisce l'ID del nuovo cliente
    } else {
      throw new Error('Errore nell\'inserimento del cliente');
    }
}
  
module.exports = {
    getRoleByUsernameAndPassword,
    addClient
};

