import { queryDB } from '../db/database.js';

// Funzione per ottenere il ruolo di un utente
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
    return result[0].ruolo;  // Restituisce il ruolo se trovato
  } else {
    return "";  // Restituisce una stringa vuota se non trovato
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
    return result[0].id;  // Restituisce l'ID del nuovo cliente
  } else {
    throw new Error("Errore nell'inserimento del cliente");
  }
}

async function getImmobiliByAdvancedFilters(lat=0, lng=0, prezzo_min=0, prezzo_max=2000000, dimensione=0, piano=0, stanze=0, ascensore=false, classe_energetica='all', portineria=false, tipo_annuncio='qualsiasi', climatizzazione=false) {
  try {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    // Verifica validità dei numeri
    if (isNaN(latNum) || isNaN(lngNum)) {
      throw new Error('Coordinate non valide');
    }

    query = `
    SELECT * FROM immobile
    WHERE latitudine BETWEEN $1 AND $2
      AND longitudine BETWEEN $3 AND $4
      AND prezzo BETWEEN $5 AND $6
      AND piano BETWEEN $7 AND $8
      AND stanze BETWEEN $9 AND $10
      AND ascensore = $11
      AND classe_energetica = ANY($12::text[])
      AND portineria = $13
      AND tipo_annuncio = ANY($14::text[])
      AND climatizzazione = $15
    `;

    if(dimensione != null){
      query = query + 'AND dimensione_mq BETWEEN $16 AND 17';
      values = [
        latNum - 0.1, //$1
        latNum + 0.1, //$2
        lngNum - 0.1, //$3
        lngNum + 0.1, //$4
        prezzo_min, //$5
        prezzo_max, //$6
        piano - 1, //$7
        piano + 1, //8$
        stanze - 1, //$9
        stanze + 1, //$10
        ascensore, //$11
        classe_energetica, //$12
        portineria, //$13
        tipo_annuncio, //$14
        climatizzazione ,//$15
        dimensione - 10, //$16
        dimensione + 10, //$17
      ];  
    }else{
      values = [
        latNum - 0.1, //$1
        latNum + 0.1, //$2
        lngNum - 0.1, //$3
        lngNum + 0.1, //$4
        prezzo_min, //$5
        prezzo_max, //$6
        piano - 1, //$7
        piano + 1, //8$
        stanze - 1, //$9
        stanze + 1, //$10
        ascensore, //$11
        classe_energetica, //$12
        portineria, //$13
        tipo_annuncio, //$14
        climatizzazione ,//$15
      ]; 
    }  

    const result = await queryDB(query, values);
    return result;

  } catch (error) {
    console.error('Errore in getImmobiliByCoords:', error);
    throw error;
  }
}

async function getImmobiliById(id) {
  try {
    const query = 'SELECT * FROM immobile WHERE id = $1';
    const values = [id];
    const result = await queryDB(query, values);
    return result;
  } catch (error) {
    console.error('Errore in getImmobiliByCoords:', error);
    throw error;
  }
}

async function getImmobiliByFilter(lat=0, lng=0, prezzo_min=0, prezzo_max=2000000, dimensione=null, tipo_annuncio='qualsiasi') {
  try {
    query = 'SELECT * FROM immobile WHERE latitudine BETWEEN $1 AND $2 AND longitudine BETWEEN $3 AND $4 AND prezzo BETWEEN $5 AND $6 AND tipo_annuncio = ANY($7::text[])'

    if(dimensione != null){
      query = query + 'AND dimensione_mq BETWEEN $8 AND $9';
      values = [
        lat - 0.1, //$1
        lat + 0.1, //$2
        lng - 0.1, //$3
        lng + 0.1, //$4
        prezzo_min, //$5
        prezzo_max, //$6
        tipo_annuncio, //$7
        dimensione - 10,
        dimensione + 10
      ];   
    }else{
      values = [
        lat - 0.1, //$1
        lat + 0.1, //$2
        lng - 0.1, //$3
        lng + 0.1, //$4
        prezzo_min, //$5
        prezzo_max, //$6
        tipo_annuncio, //$7
      ];   
    }  
    
    const result = await queryDB(query, values);
    return result;
  } catch (error) {
    console.error('Errore in getImmobiliByCoords:', error);
    throw error;
  }
}

async function getImmobiliByCoords(lat, lng) {
  try {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    // Verifica validità dei numeri
    if (isNaN(latNum) || isNaN(lngNum)) {
      throw new Error('Coordinate non valide');
    }

    const query = `
    SELECT * FROM immobile
    WHERE latitudine BETWEEN $1 AND $2
    AND longitudine BETWEEN $3 AND $4`;

    const values = [
      latNum - 0.1,
      latNum + 0.1,
      lngNum - 0.1,
      lngNum + 0.1,
    ];
    const result = await queryDB(query, values);
    return result;

  } catch (error) {
    console.error('Errore in getImmobiliByCoords:', error);
    throw error;
  }
}


module.exports = {
    getRoleByUsernameAndPassword,
    addClient,
    getImmobiliByCoords,
    getImmobiliByFilter,
    getImmobiliByAdvancedFilters,
    getImmobiliById
};

