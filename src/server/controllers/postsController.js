import jwt from 'jsonwebtoken';
const JWT_SECRET = 'supersegreto123';
import { queryDB } from '../db/database.js';


import {
  getUser,
  registrazione,
  registrazioneAgenziaDB,
  getImmobiliByCoords,
  getImmobiliByFilter,
  getImmobiliById,
  getImmobiliByAdvancedFilters
} from '../services/postsServices.js';

//Controller per ottenere il ruolo di un utente dato username e password
async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await getUser(username, password);

    if (!user || user === "") {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    const payload = {
      id: user.id,
      ruolo: user.ruolo,
      username: user.username
    };

    // Creazione del token (opzionale se vuoi usare autenticazione JWT)
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login riuscito',
      token: token,
      user: {
        id: user.id,
        ruolo: user.ruolo,
        username: user.username
      }
    });




  } catch (error) {
    console.error('Errore durante il login:', error);
    res.status(500).json({ message: 'Errore del server durante il login' });
  }
}

async function checkUserExists(email, username) {
  const query = `
        SELECT COUNT(*) FROM utente 
        WHERE email = $1 OR username = $2
    `;
  const params = [email, username];

  try {
    const result = await queryDB(query, params);

    // Converte direttamente il valore count in un numero
    const count = parseInt(result[0].count, 10);  // Assicurati che 'result' sia un array

    console.log('Count:', count);  // Log per verificare il valore numerico

    if (count > 0) {
      return true;  // Utente esistente
    } else {
      return false;  // Utente non esistente
    }
  } catch (error) {
    console.error('Errore durante il controllo dell\'utente esistente:', error);
    throw new Error('Errore durante il controllo dell\'utente esistente');
  }
}

async function registrazioneUtente(req, res) {
  const { email, username, password, ruolo, idAgenzia } = req.body;

  // Controllo dei parametri in entrata
  if (!email || !username || !password || !ruolo) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori.' });
  }

  try {
    // Verifica se l'utente esiste già
    const userExists = await checkUserExists(email, username);
    if (userExists) {
      return res.status(400).json({ message: 'Utente con email o username già esistente.' });
    }

    // Registrazione dell'utente
    const user = await registrazione(email, username, password, ruolo, idAgenzia); // Chiamata alla funzione di registrazione

    if (!user) {
      throw new Error('Errore: utente non trovato o risultato della query non valido');
    }

    // Payload per il token JWT
    const payload = {
      id: user.id,
      ruolo: user.ruolo,
      username: user.username
    };

    // Creazione del token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Risposta con il token e i dati utente
    return res.status(201).json({
      message: 'Registrazione riuscita',
      token,
      ruolo: user.ruolo,
      id: user.id,
      username: user.username,
      id_agenzia: user.id_agenzia || null
    });

  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    return res.status(500).json({ message: `Errore del server durante la registrazione: ${error.message}` });
  }
}

async function registrazioneAgenzia(req, res) {
  try {
    const nuovaAgenzia = await registrazioneAgenziaDB(
      req.body.nome,
      req.body.sede,
      req.body.email
    );

    return res.status(201).json({ success: true, data: nuovaAgenzia });

  } catch (error) {
    console.error('Errore durante la creazione agenzia:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}




async function checkAgenziaExists(emailAgenzia) {
  const query = `
    SELECT COUNT(*) as count FROM agenzia WHERE email = $1
  `;
  const params = [emailAgenzia];

  try {
    const result = await queryDB(query, params);
    console.log('checkAgenziaExists result:', result);

    // Qui cambiato:
    const count = parseInt(result[0].count, 10);

    return count > 0;

  } catch (error) {
    console.error('Errore durante il controllo dell\'agenzia esistente:', error);
    throw error;
  }
}






async function getImmobiliByAdvancedFilterController(req, res) {
  try {

    const params = req.body
    let { lat, lng, prezzoMin, prezzoMax, dimensione, piano, stanze, ascensore, classe_energetica, portineria, tipoAnnuncio, climatizzazione } = params;
    tipoAnnuncio = tipoAnnuncio === 'qualsiasi' ? ['affitto', 'vendita'] : [tipoAnnuncio];
    classe_energetica = classe_energetica === 'all' ? ['A', 'B', 'C', 'D', 'E'] : [classe_energetica];

    // Chiamata al servizio per ottenere gli immobili
    const immobili = await getImmobiliByAdvancedFilters(lat, lng, prezzoMin, prezzoMax, dimensione, piano, stanze, ascensore, classe_energetica, portineria, tipoAnnuncio, climatizzazione);

    // Restituisce gli immobili trovati
    return res.json(immobili);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Errore nel recupero degli immobili' });
  }
}

async function getImmobiliByCoordsController(req, res) {
  try {

    const params = req.body
    const { lat, lng } = params;

    // Chiamata al servizio per ottenere gli immobili
    const immobili = await getImmobiliByCoords(lat, lng);

    // Restituisce gli immobili trovati
    return res.json(immobili);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Errore nel recupero degli immobili' });
  }
}

async function getImmobiliByIdController(req, res) {
  try {

    const params = req.body
    const { id } = params;

    // Chiamata al servizio per ottenere gli immobili
    const immobili = await getImmobiliById(id);

    // Restituisce gli immobili trovati
    return res.json(immobili);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Errore nel recupero degli immobili' });
  }
}

//Funzione che data lat e lng, prezzo min e max, superficie e tipo di annuncio mi restituisca gli immobili che corrispondo a questi parametri
async function getImmobiliByFilterController(req, res) {
  try {

    let { lat, lng, tipoAnnuncio, prezzoMin, prezzoMax, superficie } = req.body;

    tipoAnnuncio = tipoAnnuncio === 'qualsiasi' ? ['affitto', 'vendita'] : [tipoAnnuncio];

    const immobili = await getImmobiliByFilter(lat, lng, prezzoMin, prezzoMax, superficie, tipoAnnuncio);

    return res.json(immobili);

  } catch (e) {
    console.log("Errore: ", e);
    return res.status(500).json({ error: 'Errore nel recupero degli immobili' });
  }
}

export {
  login,
  getImmobiliByCoordsController,
  registrazioneUtente,
  getImmobiliByFilterController,
  getImmobiliByAdvancedFilterController,
  getImmobiliByIdController,
  registrazioneAgenzia,

};

