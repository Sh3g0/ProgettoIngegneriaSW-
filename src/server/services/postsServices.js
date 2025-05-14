import { queryDB } from '../db/database.js';

// Funzione per ottenere il ruolo di un utente
async function getUser(username, password) {
    const query = `     SELECT * 
        FROM utente 
        WHERE username = $1 AND password_hash = $2;
    `;
    const params = [username, password];
    console.log('Query eseguita con questi parametri:', params);

    const result = await queryDB(query, params);

    if (result.length > 0) {
        return result[0];  // Restituisce il ruolo se trovato
    } else {
        return "";  // Restituisce una stringa vuota se non trovato
    }
}

async function getImmobiliByAdvancedFilters(lat=0, lng=0, prezzo_min=0, prezzo_max=2000000, dimensione=null, piano=0, stanze=0, ascensore=false, classe_energetica='all', portineria=false, tipo_annuncio='qualsiasi', climatizzazione=false) {
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
        `;

        let values = [];

        if(dimensione != null){
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
            climatizzazione ,//$14
            dimensione - 10, //$15
            dimensione + 10, //$16
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
            stanze, //$9
            ascensore, //$10
            classe_energetica, //$11
            portineria, //$12
            tipo_annuncio, //$13
            climatizzazione ,//$14
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
        const query = 'SELECT \* FROM immobile WHERE id = \$1';
        const values = [id];
        const result = await queryDB(query, values);
        return result;
    } catch (error) {
        console.error('Errore in getImmobiliByCoords:', error);
        throw error;
    }
}

async function getImmobiliByFilter(lat=0, lng=0, prezzo_min, prezzo_max, dimensione=null, tipo_annuncio='qualsiasi') {
    try {
    let query = ` SELECT * FROM immobile 
                WHERE latitudine BETWEEN $1 AND $2 AND 
                longitudine BETWEEN $3 AND $4 AND 
                prezzo BETWEEN $5 AND $6 
                AND tipo_annuncio = ANY($7::text[])`

    let values = [];

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

export {
getUser,
getImmobiliByCoords,
getImmobiliByFilter,
getImmobiliByAdvancedFilters,
getImmobiliById
};
