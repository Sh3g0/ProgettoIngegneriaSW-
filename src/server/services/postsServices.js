import { error } from 'console';
import { queryDB } from '../db/database.js';
import bcrypt from 'bcryptjs';   //a me funziona solo con bcryptjs a causa del sistema operativo 

// Funzione per ottenere il ruolo di un utente
async function getUser(username, password) {
    const query = `
      SELECT * 
      FROM utente 
      WHERE username = $1;
    `;

    const params = [username];
    const result = await queryDB(query, params);

    if (!result || result.length === 0) {
        console.log('Utente non trovato');
        return "";
    }

    const user = result[0];
    const hashedPasswordFromDb = user.password_hash;

    console.log('Password inserita:', password);
    console.log('Hash dal DB:', hashedPasswordFromDb);

    const isMatch = await bcrypt.compare(password, hashedPasswordFromDb);

    if (isMatch) {
        console.log("Login riuscito");
        return user;
    } else {
        console.log("Password errata");
        return "";
    }
}


async function registrazione(email, username, password, ruolo, idAgenzia) {
    console.log('Dati ricevuti per la registrazione:', email, username, password, ruolo, idAgenzia);

    const query = `
      INSERT INTO utente (email, username, password_hash, ruolo, id_agenzia)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, username, ruolo, id_agenzia
    `;

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashata:', hashedPassword);

    const params = [email, username, hashedPassword, ruolo, ruolo === 'agente' ? idAgenzia : null];
    console.log('Query eseguita con questi parametri:', params);

    try {
        const result = await queryDB(query, params);
       console.log('JWT_SECRET:', process.env.JWT_SECRET);

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET non è definita nelle variabili d’ambiente');
        }
        if (!result || result.length === 0) {
            // Gestisci l'errore, magari con un messaggio che indica che l'utente non è stato trovato
            throw new Error('Errore durante la registrazione');
        }

        const user = result[0]; // Restituisci l'utente creato
        return user;  // Restituisci i dati dell'utente per l'uso nel controller

    } catch (error) {
        console.error('Errore nella registrazione dell\'utente:', error);
        throw new Error('Errore durante la registrazione');
    }
};




async function getImmobiliByAdvancedFilters(lat = 0, lng = 0, prezzo_min = 0, prezzo_max = 2000000, dimensione = null, piano = 0, stanze = 0, ascensore = false, classe_energetica = 'all', portineria = false, tipo_annuncio = 'qualsiasi', climatizzazione = false, status) {
    try {
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);


        // Verifica validità dei numeri
        if (isNaN(latNum) || isNaN(lngNum)) {
            throw new Error('Coordinate non valide');
        }

        let query = `
        SELECT * FROM immobile
        WHERE latitudine BETWEEN $1 AND $2
        AND longitudine BETWEEN $3 AND $4
        AND prezzo BETWEEN $5 AND $6
        AND piano BETWEEN $7 AND $8
        AND stanze >= $9 
        AND ascensore = $10
        AND classe_energetica = ANY($11::text[])
        AND portineria = $12
        AND tipo_annuncio = ANY($13::text[])
        AND climatizzazione = $14
        AND stato = $15
        `;

        let values = [];

        if (dimensione != null) {
            query = query + 'AND dimensione_mq BETWEEN $15 AND $16';
            values = [
                latNum - 0.1, //$1
                latNum + 0.1, //$2
                lngNum - 0.1, //$3
                lngNum + 0.1, //$4
                prezzo_min, //$5
                prezzo_max, //$6
                piano - 1, //$7
                piano + 1, //8$
                stanze, //$9
                ascensore, //$10
                classe_energetica, //$11
                portineria, //$12
                tipo_annuncio, //$13
                climatizzazione,//$14
                status,
                dimensione - 10, //$16
                dimensione + 10, //$17
            ];
        } else {
            values = [
                latNum - 0.1, //$1
                latNum + 0.1, //$2
                lngNum - 0.1, //$3
                lngNum + 0.1, //$4
                prezzo_min, //$5
                prezzo_max, //$6
                piano - 1, //$7
                piano + 1, //8$
                stanze, //$9
                ascensore, //$10
                classe_energetica, //$11
                portineria, //$12
                tipo_annuncio, //$13
                climatizzazione,//$14
                status
            ];
        }

        const result = await queryDB(query, values);
        return result;

    } catch (error) {
        console.error('Errore in getImmobiliByCoords:', error);
        throw error;
    }
}

async function registrazioneAgenziaDB(nomeAgenzia, sedeAgenzia, emailAgenzia) {
    try {
        const result = await queryDB(
            `
      INSERT INTO agenzia (nome, sede, email)
      VALUES ($1, $2, $3)
      RETURNING id, nome, sede, email
      `,
            [nomeAgenzia, sedeAgenzia, emailAgenzia]
        );

        console.log('Risultato della query:', result);

        if (!result || result.length === 0) {
            throw new Error('Errore nella registrazione dell\'agenzia');
        }

        return result[0]; // restituisci la prima riga

    } catch (error) {
        console.error('Errore nella registrazione dell\'agenzia:', error);
        throw new Error('Errore nella registrazione dell\'agenzia');
    }
}




async function getImmobiliById(id, status) {
    try {
        const query = 'SELECT * FROM immobile WHERE id = $1 AND stato = $2';
        const values = [id, status];
        const result = await queryDB(query, values);
        return result;
    } catch (error) {
        console.error('Errore in getImmobiliByCoords:', error);
        throw error;
    }
}

async function getImmobiliByFilter(lat = 0, lng = 0, prezzo_min, prezzo_max, dimensione = null, tipo_annuncio = 'qualsiasi', status) {
    try {
        let query = ` SELECT * FROM immobile 
                WHERE latitudine BETWEEN $1 AND $2 AND 
                longitudine BETWEEN $3 AND $4 AND 
                prezzo BETWEEN $5 AND $6 
                AND tipo_annuncio = ANY($7::text[])
                AND stato = $8`

        let values = [];

        if (dimensione != null) {
            query = query + 'AND dimensione_mq BETWEEN $8 AND $9';
            values = [
                lat - 0.1, //$1
                lat + 0.1, //$2
                lng - 0.1, //$3
                lng + 0.1, //$4
                prezzo_min, //$5
                prezzo_max, //$6
                tipo_annuncio, //$7
                status,
                dimensione - 10,
                dimensione + 10
            ];
        } else {
            values = [
                lat - 0.1, //$1
                lat + 0.1, //$2
                lng - 0.1, //$3
                lng + 0.1, //$4
                prezzo_min, //$5
                prezzo_max, //$6
                tipo_annuncio, //$7
                status
            ];
        }

        console.log(query, values);

        const result = await queryDB(query, values);
        return result;


    } catch (error) {
        console.error('Errore in getImmobiliByCoords:', error);
        throw error;
    }
}

async function getImmobiliByCoords(lat, lng, status) {
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
    AND longitudine BETWEEN $3 AND $4
    AND stato = $5`;

        const values = [
            latNum - 0.1,
            latNum + 0.1,
            lngNum - 0.1,
            lngNum + 0.1,
            status,
        ];
        const result = await queryDB(query, values);
        return result;


    } catch (error) {
        console.error('Errore in getImmobiliByCoords:', error);
        throw error;
    }
}

async function getUserBooks(id) {
    try{
        const query = `
        SELECT *
        FROM prenotazione_visite
        WHERE id_cliente = $1;
        `;

        const result = await queryDB(query,[id]);
        return result;
    }catch(error){
        console.log(error);
        throw error;
    }
}

async function getUserStorico(id) {
    try{
        const query = `
        SELECT *
        FROM storico_cliente
        WHERE id_utente = $1;
        `;

        const result = await queryDB(query,[id]);
        return result;
    }catch(error){
        console.log(error);
        throw error;
    }
}

async function caricaImmobile(data) {
  try {
    await queryDB('BEGIN');

    console.log('in begin.................');

    const immobileQuery = `
      INSERT INTO immobile (
        id_agente, titolo, descrizione, prezzo, dimensione_mq, piano, stanze,
        ascensore, classe_energetica, portineria, climatizzazione,
        tipo_annuncio, vicino_scuole, vicino_parchi, vicino_trasporti,
        indirizzo, citta, comune, latitudine, longitudine
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
      RETURNING id
    `;

    const immobileValues = [
      data.id, data.titolo, data.descrizione, data.prezzo, data.dimensione_mq,
      data.piano, data.stanze, data.ascensore, data.classe_energetica,
      data.portineria, data.climatizzazione, data.tipo_annuncio,
      data.vicino_scuole, data.vicino_parchi, data.vicino_trasporti,
      data.indirizzo.streetAddress, data.indirizzo.city,
      data.indirizzo.province, data.indirizzo.lat, data.indirizzo.lng
    ];

    const result = await queryDB(immobileQuery, immobileValues);
    const immobileId = result[0].id; //Prendo l'id dell'immobile a cui ho inserito i dati

    for (const path of data.immagini) {
      await queryDB(
        `INSERT INTO immagini_immobile (immobile_id, path) VALUES ($1, $2)`,
        [immobileId, path]
      );
    }

    await queryDB('COMMIT');
  } catch (err) {
    await queryDB('ROLLBACK');
    console.error("Errore nel salvataggio immobile:", err);
    throw err;
  }
}

async function getUserBooks(id) {
    try{
        const query = `
        SELECT *
        FROM prenotazione_visite
        WHERE id_cliente = $1;
        `;

        const result = await queryDB(query,[id]);
        return result;
    }catch(error){
        console.log(error);
        throw error;
    }
}

async function getUserStorico(id) {
    try{
        const query = `
        SELECT *
        FROM storico_cliente
        WHERE id_utente = $1;
        `;

        const result = await queryDB(query,[id]);
        return result;
    }catch(error){
        console.log(error);
        throw error;
    }
}

async function caricaImmobile(data) {
  try {
    await queryDB('BEGIN');

    console.log('in begin.................');

    const immobileQuery = `
      INSERT INTO immobile (
        id_agente, titolo, descrizione, prezzo, dimensione_mq, piano, stanze,
        ascensore, classe_energetica, portineria, climatizzazione,
        tipo_annuncio, vicino_scuole, vicino_parchi, vicino_trasporti,
        indirizzo, citta, comune, latitudine, longitudine
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
      RETURNING id
    `;

    const immobileValues = [
      data.id, data.titolo, data.descrizione, data.prezzo, data.dimensione_mq,
      data.piano, data.stanze, data.ascensore, data.classe_energetica,
      data.portineria, data.climatizzazione, data.tipo_annuncio,
      data.vicino_scuole, data.vicino_parchi, data.vicino_trasporti,
      data.indirizzo.streetAddress, data.indirizzo.city,
      data.indirizzo.province, data.indirizzo.lat, data.indirizzo.lng
    ];

    const result = await queryDB(immobileQuery, immobileValues);
    const immobileId = result[0].id; //Prendo l'id dell'immobile a cui ho inserito i dati

    for (const path of data.immagini) {
      await queryDB(
        `INSERT INTO immagini_immobile (immobile_id, path) VALUES ($1, $2)`,
        [immobileId, path]
      );
    }

    await queryDB('COMMIT');
  } catch (err) {
    await queryDB('ROLLBACK');
    console.error("Errore nel salvataggio immobile:", err);
    throw err;
  }
}

async function getAgenzia(email, password) {
    try{
        const query = `
            SELECT * FROM agenzia
            WHERE email = $1 AND password = $2`
        ;
        
        const result = await queryDB(query, [email, password]);
        return result;
    }catch(e){
        console.log(error);
        throw e;
    }
}

async function getAgenzia(email, password) {
    try{
        const query = `
            SELECT * FROM agenzia
            WHERE email = $1 AND password = $2`
        ;
        
        const result = await queryDB(query, [email, password]);
        return result;
    }catch(e){
        console.log(error);
        throw e;
    }
}

async function getAgenzia(email, password) {
    try{
        const query = `
            SELECT * FROM agenzia
            WHERE email = $1 AND password = $2`
        ;
        
        const result = await queryDB(query, [email, password]);
        return result;
    }catch(e){
        console.log(error);
        throw e;
    }
}

export {
    getUser,
    registrazione,
    registrazioneAgenziaDB,
    getImmobiliByCoords,
    getImmobiliByFilter,
    getImmobiliByAdvancedFilters,
    getImmobiliById,
    getUserBooks,
    getUserStorico,
    caricaImmobile,
    updateStorico,
    cleanStorico,
    removeStorico,
    getAgenzia,
};
