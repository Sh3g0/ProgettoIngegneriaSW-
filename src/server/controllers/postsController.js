import jwt from 'jsonwebtoken';
const JWT_SECRET = 'chiave_super_segreta';
import { pool, queryDB } from '../db/database.js';


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
    const token = jwt.sign(payload, 'chiave_super_segreta', { expiresIn: '1h' });

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
  console.log('Dati ricevuti per registrazione:', req.body);
  const { email, username, password, ruolo, idAgenzia } = req.body;

  if (!email || !username || !password || !ruolo) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori.' });
  }

  if (ruolo === 'agente' && !idAgenzia) {
    return res.status(400).json({ message: 'idAgenzia è obbligatorio per il ruolo agente.' });
  }

  try {
    const userExists = await checkUserExists(email, username);
    if (userExists) {
      return res.status(400).json({ message: 'Utente con email o username già esistente.' });
    }

    const user = await registrazione(email, username, password, ruolo, idAgenzia);

    if (!user) {
      throw new Error('Errore: utente non trovato o risultato della query non valido');
    }

    const payload = {
      id: user.id,
      ruolo: user.ruolo,
      username: user.username
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

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


async function prenotaVisitaController(req, res) {
  console.log('✅ Controller prenotaVisita chiamato');

  try {
    const { id_immobile, data_visita } = req.body;
    const id_cliente = req.user.id;

    if (!id_immobile || !data_visita) {
      return res.status(400).json({ message: 'Dati incompleti per la prenotazione' });
    }

    console.log('Data ricevuta:', data_visita);

    const checkQuery = `
  SELECT * FROM prenotazione_visite 
  WHERE id_immobile = $1 
    AND data_visita = $2 
    AND stato = 'confermata';
`;
    const checkResult = await queryDB(checkQuery, [id_immobile, data_visita]);

    if (checkResult.length > 0) {
      return res.status(400).json({ message: 'Orario già prenotato per questo immobile.' });
    }


    const query = `
      INSERT INTO prenotazione_visite (id_immobile, id_cliente, data_visita, stato, data_creazione)
      VALUES ($1, $2, $3, 'in_attesa', NOW())
      RETURNING *;
    `;
    const params = [id_immobile, id_cliente, data_visita];

    // 🔥 Qui definiamo result fuori dal try interno
    const result = await queryDB(query, params);
    console.log('Query result:', result);

    if (result.length === 0) {
      return res.status(500).json({ message: 'Errore nella prenotazione visita' });
    }

    res.status(201).json({ message: 'Visita prenotata con successo', prenotazione: result[0] });

  } catch (error) {
    console.error('Errore prenotazione visita:', error);
    res.status(500).json({ message: 'Errore server durante la prenotazione visita' });
  }
}



async function getDateBloccaVisita(req, res) {
  try {
    const { id_immobile } = req.params;

    const query = `
      SELECT data_visita FROM prenotazione_visite 
      WHERE id_immobile = $1 AND stato = 'confermata';
    `;
    const result = await queryDB(query, [id_immobile]);

    const dateList = result.map(r => r.data_visita);
    res.status(200).json({ dateList });
  } catch (error) {
    res.status(500).json({ message: 'Errore recupero date occupate' });
  }
}



async function getNotifichePrenotazioni(req, res) {


  const agenteId = req.user.id; // ← Preso dal middleware verificaToken
  console.log('ID Agente:', agenteId);

  if (!agenteId) {
    return res.status(400).json({ error: 'Missing agenteId' });
  }
  try {
    const result = await pool.query(`
  SELECT 
  p.id,
  u.username AS nome_cliente,
  i.titolo AS titolo_immobile,
  p.data_visita,
  p.stato
FROM prenotazione_visite p
JOIN utente u ON p.id_cliente = u.id
JOIN immobile i ON p.id_immobile = i.id
WHERE i.id_agente = $1
ORDER BY p.data_visita DESC;
    `, [agenteId]);

    res.json(result.rows);
  } catch (err) {
    console.error('Errore nella query delle notifiche:', err);
    res.status(500).json({ error: 'Errore durante il recupero delle notifiche' });
  }
};


async function rispondiPrenotazione(req, res) {

  const { idPrenotazione, azione } = req.body;
  if (!idPrenotazione || !azione) {
    return res.status(400).json({ error: 'Dati mancanti' });

  }

  const nuovoStato = azione === 'confermata' ? 'confermata' : 'rifiutata';

  try {
    await pool.query(
      `UPDATE prenotazione_visite SET stato = $1 WHERE id = $2`,
      [nuovoStato, idPrenotazione]
    );

    res.json({ message: 'Stato aggiornato con successo' });
  } catch (err) {
    console.error('Errore aggiornamento stato prenotazione:', err);
    res.status(500).json({ error: 'Errore nel database' });
  }
}

async function getPrenotazioniConfermate(req, res) {
  const idAgente = req.params.idAgente;

  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        u.username AS nome_cliente,
        i.titolo AS titolo_immobile,
        p.data_visita
      FROM prenotazione_visite p
      JOIN utente u ON p.id_cliente = u.id
      JOIN immobile i ON p.id_immobile = i.id
      WHERE i.id_agente = $1 AND p.stato = 'confermata'
      ORDER BY p.data_visita ASC
    `, [idAgente]);

    res.json(result.rows);
  } catch (err) {
    console.error('Errore nel recupero prenotazioni confermate:', err);
    res.status(500).json({ error: 'Errore nel database' });
  }
}



async function getPrenotazioniAccettateCliente(req, res) {
  const idCliente = req.params.idCliente;

  try {
    const result = await pool.query(`
   SELECT p.id, i.titolo AS titolo_immobile, p.data_visita, i.comune, i.indirizzo
FROM prenotazione_visite p
JOIN immobile i ON p.id_immobile = i.id
WHERE p.id_cliente = $1 AND p.stato = 'confermata';`, [idCliente]);

    res.json(result.rows);
  } catch (err) {
    console.error('Errore nel recupero prenotazioni confermate:', err);
    res.status(500).json({ error: 'Errore nel database' });
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
  getNotifichePrenotazioni,
  rispondiPrenotazione,
  getDateBloccaVisita,
  getPrenotazioniConfermate,
  getPrenotazioniAccettateCliente,
  prenotaVisitaController,

};

