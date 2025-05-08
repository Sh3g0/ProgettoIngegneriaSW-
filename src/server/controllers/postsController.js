import { queryDB } from '../db/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getRoleByUsernameAndPassword, addClient, creaAgenzia, getImmobili } from '../services/postsServices.js';

const { getRoleByUsernameAndPassword, addClient, getImmobiliByCoords, getImmobiliByFilter, getImmobiliById , getImmobiliByAdvancedFilters} = require('../services/postsServices');
const SECRET_KEY = 'dieti_secret_key25'; // In produzione, usa process.env

//Controller per ottenere il ruolo di un utente dato username e password
async function getUserRoleController(req, res) {
  try {
    const { username, password } = req.body;
    const query = `SELECT * FROM utente WHERE username = $1;`;
    const users = await queryDB(query, [username]);

    if (users.length === 0) return res.status(400).json({ message: "Utente non trovato" });

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ message: "Password errata" });

    const token = jwt.sign({ user: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, ruolo: user.ruolo });
  } catch (error) {
    console.error("Errore login:", error);
    res.status(500).json({ message: "Errore login" });
  }
}

// Recupero info utente loggato
export async function getUserInfo(req, res) {
  try {
    const userId = req.user.user;
    const result = await queryDB('SELECT * FROM utente WHERE id = $1', [userId]);

    if (result.length === 0) return res.status(404).json({ error: 'Utente non trovato' });

    res.json(result[0]);
  } catch (err) {
    console.error("Errore nel recupero delle informazioni dell'utente:", err);
    res.sendStatus(500);
  }
}

// Signup client
export async function createClient(req, res) {
  try {
    const { email, username, password, ruolo, idAgenzia } = req.body;

    if (!username || !email || !password || !ruolo) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori.' });
    }

    const existing = await queryDB(
      'SELECT * FROM utente WHERE email = $1 OR username = $2',
      [email, username]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email o username già in uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await addClient(email, username, hashedPassword, ruolo, idAgenzia);
    res.status(201).json({ clientId: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getImmobiliByAdvancedFilterController(req, res) {
  try {

    const params = req.body
    let { lat, lng, prezzo_min, prezzo_max, dimensione, piano, stanze, ascensore, classe_energetica, portineria, tipoAnnuncio, climatizzazione } = params;
    tipoAnnuncio = tipoAnnuncio === 'qualsiasi' ? ['affitto','vendita'] : [tipoAnnuncio];
    classe_energetica = classe_energetica === 'all' ? ['A', 'B', 'C', 'D', 'E'] : [classe_energetica];


    // Chiamata al servizio per ottenere gli immobili
    const immobili = await getImmobiliByAdvancedFilters(lat, lng, prezzo_min, prezzo_max, dimensione, piano, stanze, ascensore, classe_energetica, portineria, tipoAnnuncio, climatizzazione);

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

// Creazione agenzia
export async function creazioneAgenzia(req, res) {
  const { nomeAgenzia, sedeAgenzia, emailAgenzia, idAdmin } = req.body;

  if (!nomeAgenzia || !sedeAgenzia || !emailAgenzia || !idAdmin) {
    return res.status(400).json({ error: 'Tutti i campi sono obbligatori.' });
  }

  try {
    const result = await queryDB(
      'INSERT INTO agenzia (nome, sede, email, id_admin) VALUES ($1, $2, $3, $4) RETURNING id',
      [nomeAgenzia, sedeAgenzia, emailAgenzia, idAdmin]
    );

    const agenziaId = result.rows[0].id;
    res.status(201).json({ message: 'Agenzia creata con successo', agenziaId });
  } catch (error) {
    console.error("Errore nella creazione dell'agenzia:", error);
    res.status(500).json({ message: "Errore nella creazione dell'agenzia", error: error.message });
  }
}



//Funzione che data lat e lng, prezzo min e max, superficie e tipo di annuncio mi restituisca gli immobili che corrispondo a questi parametri
async function getImmobiliByFilterController(req, res) {
  try {

    let { lat, lng, tipoAnnuncio, prezzo_min, prezzo_max, superficie } = req.body;

    tipoAnnuncio = tipoAnnuncio === 'qualsiasi' ? ['affitto','vendita'] : [tipoAnnuncio];

    console.log('tipo annuncio', tipoAnnuncio);

    const immobili = await getImmobiliByFilter(lat, lng, prezzo_min, prezzo_max, superficie, tipoAnnuncio);

    return res.json(immobili);

  }catch(e){
    console.log("Errore: ", e);
    return res.status(500).json({ error: 'Errore nel recupero degli immobili' });
  }
}

module.exports = {
  getUserRoleController,
  addClientController,
  getImmobiliByCoordsController,
  getImmobiliByFilterController,
  getImmobiliByAdvancedFilterController,
  getImmobiliByIdController
};
