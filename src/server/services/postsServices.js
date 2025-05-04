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

//Funzione per inserire un nuovo cliente
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

//Se l'id è -1, effettua una ricerca con i parametri
//Se l'id è -2, effettua una ricerca solo con latitudine e longitudine
async function getImmobili(id, lat, lng, prezzo_min=0, prezzo_max=2000000, dimensione=0, piano=0, stanze=0, ascensore=false, classe_energetica='q', portineria=false, tipo_annuncio='vendita', climatizzazione=false) {
  try {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    // Verifica validità dei numeri
    if (isNaN(latNum) || isNaN(lngNum)) {
      throw new Error('Coordinate non valide');
    }

    let query = '';
    let values = [];

    if(id === -1) {

      query = `
      SELECT * FROM immobile
      WHERE latitudine BETWEEN $1 AND $2
      AND longitudine BETWEEN $3 AND $4`;

      values = [
        latNum - 0.1,
        latNum + 0.1,
        lngNum - 0.1,
        lngNum + 0.1,
      ];
      console.log('Query eseguita con questi parametri con id -1:', values);


    }else if(id === -2) {

      query = `
      SELECT * FROM immobile
      WHERE latitudine BETWEEN $1 AND $2
        AND longitudine BETWEEN $3 AND $4
        AND prezzo BETWEEN $5 AND $6
        AND dimensione_mq >= $7
        AND piano >= $8
        AND stanze >= $9
        AND ascensore = $10
        AND classe_energetica = ANY($11::text[])
        AND portineria = $12
        AND tipo_annuncio = $13
        AND climatizzazione = $14
      `;
      
      classe_energetica = classe_energetica === 'q' ? ['A', 'B', 'C', 'D', 'E'] : [classe_energetica];

      values = [
        latNum - 0.1, //$1
        latNum + 0.1, //$2
        lngNum - 0.1, //$3
        lngNum + 0.1, //$4
        prezzo_min, //$5
        prezzo_max, //$6
        dimensione, //$7
        piano, //$8
        stanze, //$9
        ascensore, //$10
        classe_energetica, //$11
        portineria, //$12
        tipo_annuncio, //$13
        climatizzazione //$14
      ];

      console.log('Query eseguita con questi parametri con id -2:', values);

    }else{
      query = 'SELECT * FROM immobile WHERE id = $1';

      values = [id];
    }

    const result = await queryDB(query, values);

    console.log('Risultato della query:', result);

    return result;

  } catch (error) {
    console.error('Errore in getImmobiliByCoords:', error);
    throw error;
  }
}


module.exports = {
    getRoleByUsernameAndPassword,
    addClient,
    getImmobili
};

