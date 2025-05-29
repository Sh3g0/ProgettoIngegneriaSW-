import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
import { queryDB } from '../db/database.js';
import path from "path";
import fs from "fs/promises";
import * as service from '../services/postsServices.js';

const UPLOAD_DIR = path.resolve("uploads");

//Controller per ottenere il ruolo di un utente dato username e password
async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await service.getUser(username, password);

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

    const user = await service.registrazione(email, username, password, ruolo, idAgenzia);

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
    const nuovaAgenzia = await service.registrazioneAgenziaDB(
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
    let { lat, lng, prezzoMin, prezzoMax, dimensione, piano, stanze, ascensore, classe_energetica, portineria, tipoAnnuncio, climatizzazione, status } = params;
    tipoAnnuncio = tipoAnnuncio === 'qualsiasi' ? ['affitto', 'vendita'] : [tipoAnnuncio];
    classe_energetica = classe_energetica === 'all' ? ['A', 'B', 'C', 'D', 'E'] : [classe_energetica];

    // Chiamata al servizio per ottenere gli immobili
    const immobili = await service.getImmobiliByAdvancedFilters(lat, lng, prezzoMin, prezzoMax, dimensione, piano, stanze, ascensore, classe_energetica, portineria, tipoAnnuncio, climatizzazione, status);

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
    const { lat, lng, status } = params;

    // Chiamata al servizio per ottenere gli immobili
    const immobili = await service.getImmobiliByCoords(lat, lng, status);

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
    const { id, status } = params;

    // Chiamata al servizio per ottenere gli immobili
    const immobili = await service.getImmobiliById(id, status);

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

    let { lat, lng, tipoAnnuncio, prezzoMin, prezzoMax, superficie, status } = req.body;

    tipoAnnuncio = tipoAnnuncio === 'qualsiasi' ? ['affitto', 'vendita'] : [tipoAnnuncio];

    const immobili = await service.getImmobiliByFilter(lat, lng, prezzoMin, prezzoMax, superficie, tipoAnnuncio, status);

    return res.json(immobili);

  } catch (e) {
    console.log("Errore: ", e);
    return res.status(500).json({ error: 'Errore nel recupero degli immobili' });
  }
}

async function getUserBooksController(req, res) {
  try {

    let { id } = req.body;

    const books = await service.getUserBooks(id);

    return res.json(books);

  } catch (e) {
    console.log("Errore: ", e);
    return res.status(500).json({ error: 'Errore nel recupero degli immobili' });
  }
}

async function getUserStoricoController(req, res) {
  try {

    let { id } = req.body;

    const storico = await service.getUserStorico(id);

    return res.json(storico);

  } catch (e) {
    console.log("Errore: ", e);
    return res.status(500).json({ error: 'Errore nel recupero degli immobili' });
  }
}

async function caricaImmobileController(req, res) {
  const files = req.files; // array di file
  const jsonData = JSON.parse(req.body.data); // stringa -> oggetto

  console.log("JSON ricevuto:", jsonData);
  console.log("Immagini ricevute:", files);

  let { id, titolo, descrizione, prezzo, dimensione_mq, piano, stanze, ascensore, classe_energetica, portineria, climatizzazione, tipo_annuncio, vicino_scuole, vicino_parchi, vicino_trasporti, indirizzo } = jsonData;
  let { streetAddress, houseNumber, city, province, lat, lng } = indirizzo;

  streetAddress = streetAddress + ` ${houseNumber}`

  const imagePaths = []; //Percorso immagini da salvare sul db

  for (const file of files) {
    const filename = `${Date.now()}-${file.originalname}`; //Identificatore univoco per l'immagine
    const filePath = path.join(UPLOAD_DIR, filename); //Crea il percorso unendo path e nome file (uploads/"nomefile")
    await fs.writeFile(filePath, file.buffer); //Scrive fisicamente il file nel percorso
    imagePaths.push(filename); //Salvo solo il nome del file perchè a prescindere cercherò in /uploads
  }

  await service.caricaImmobile({
    id,
    titolo,
    descrizione,
    prezzo,
    dimensione_mq,
    piano,
    stanze,
    ascensore,
    classe_energetica,
    portineria,
    climatizzazione,
    tipo_annuncio: tipo_annuncio.toLowerCase(),
    vicino_scuole,
    vicino_parchi,
    vicino_trasporti,
    indirizzo: { streetAddress, city, province, lat, lng },
    immagini: imagePaths,
  });

  //Cancellare le img da uploads se il caricamento non va a buon fine

  return res.status(200).json({ success: true });
}

async function getUserBooksController(req, res) {
  try {

    let { id } = req.body;

    const books = await service.getUserBooks(id);

    return res.json(books);

  } catch (e) {
    console.log("Errore: ", e);
    return res.status(500).json({ error: 'Errore nel recupero degli immobili' });
  }
}

async function getUserStoricoController(req, res) {
  try {

    let { id } = req.body;

    const storico = await service.getUserStorico(id);

    return res.json(storico);

  } catch (e) {
    console.log("Errore: ", e);
    return res.status(500).json({ error: 'Errore nel recupero degli immobili' });
  }
}

async function caricaImmobileController(req, res) {
  const files = req.files; // array di file
  const jsonData = JSON.parse(req.body.data); // stringa -> oggetto

  console.log("JSON ricevuto:", jsonData);
  console.log("Immagini ricevute:", files);

  let { id, titolo, descrizione, prezzo, dimensione_mq, piano, stanze, ascensore, classe_energetica, portineria, climatizzazione, tipo_annuncio, vicino_scuole, vicino_parchi, vicino_trasporti, indirizzo } = jsonData;
  let { streetAddress, houseNumber, city, province, lat, lng } = indirizzo;

  streetAddress = streetAddress + ` ${houseNumber}`

  const imagePaths = []; //Percorso immagini da salvare sul db

  for (const file of files) {
    const filename = `${Date.now()}-${file.originalname}`; //Identificatore univoco per l'immagine
    const filePath = path.join(UPLOAD_DIR, filename); //Crea il percorso unendo path e nome file (uploads/"nomefile")
    await fs.writeFile(filePath, file.buffer); //Scrive fisicamente il file nel percorso
    imagePaths.push(filename); //Salvo solo il nome del file perchè a prescindere cercherò in /uploads
  }

  await service.caricaImmobile({
    id,
    titolo,
    descrizione,
    prezzo,
    dimensione_mq,
    piano,
    stanze,
    ascensore,
    classe_energetica,
    portineria,
    climatizzazione,
    tipo_annuncio: tipo_annuncio.toLowerCase(),
    vicino_scuole,
    vicino_parchi,
    vicino_trasporti,
    indirizzo: { streetAddress, city, province, lat, lng },
    immagini: imagePaths,
  });

  //Cancellare le img da uploads se il caricamento non va a buon fine

  return res.status(200).json({ success: true });
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
    const result = await queryDB(`
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

    res.json(result);
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

    await queryDB(`
      UPDATE prenotazione_visite SET stato = $1 WHERE id = $2`,
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

    const result = await queryDB(`
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


    res.json(result);
  } catch (err) {
    console.error('Errore nel recupero prenotazioni confermate:', err);
    res.status(500).json({ error: 'Errore nel database' });
  }
}



async function getPrenotazioniAccettateCliente(req, res) {
  const idCliente = req.params.idCliente;

  try {

    const result = await queryDB(`
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
  getUserBooksController,
  getUserStoricoController,
  caricaImmobileController,
  prenotaVisitaController,
};

