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
  console.log('Controller req.utente:', req.utente);

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

async function loginAgenzia(req, res) {
  const { email, password } = req.body;

  try {
    const risultato = await service.getAgenzia(email, password);
    const agenzia = risultato[0];

    console.log('Agenzia trovata:', agenzia);

    if (!agenzia || agenzia === "") {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    console.log('id:', agenzia.id);
    const payload = {
      id: agenzia.id,
      ruolo: 'agenzia', // Ruolo fisso per agenzia
      username: agenzia.nome,
    };

    // Creazione del token (opzionale se vuoi usare autenticazione JWT)
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login riuscito',
      token: token,
      agenzia: {
        id: agenzia.id,
        nome: agenzia.nome,
        sede: agenzia.sede,
        email: agenzia.email,
        primo_accesso: agenzia.primo_accesso
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

    return res.status(201).json({ success: true });;

  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    return res.status(500).json({ message: `Errore del server durante la registrazione: ${error.message}` });
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
    return res.status(500).json({ error: 'Errore nel recupero dello storico' });
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

async function getAgentiByAgenziaIdController(req, res) {
  const idAgenzia = req.params.idAgenzia;

  try {
    const result = await queryDB(`
      SELECT ag.id, ag.email, ag.username, ag.password_hash, ag.email
      FROM utente ag
      INNER JOIN agenzia a ON ag.id_agenzia = a.id
      WHERE ag.id_agenzia = $1;
    `, [idAgenzia]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Nessun agente trovato per questa agenzia' });
    }

    res.json(result);
  } catch (error) {
    console.error('Errore nel recupero agenti:', error);
    res.status(500).json({ message: 'Errore del server durante il recupero degli agenti' });
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
  try {
    // Check autorizzazione agente
    if (!req.utente || req.utente.ruolo !== 'agente') {
      return res.status(403).json({ message: 'Accesso negato: solo agenti' });
    }

    const agenteId = req.utente.id;

    // Query per prendere tutte le prenotazioni di questo agente
    const result = await queryDB(
      `SELECT *
   FROM prenotazione_visite 
   WHERE idagente = $1 AND stato = 'in_attesa' 
   ORDER BY data_creazione DESC`,
      [agenteId]
    );


    return res.json(result);

  } catch (err) {
    console.error('❌ Errore nella query delle notifiche:', err);
    return res.status(500).json({ error: 'Errore durante il recupero delle notifiche' });
  }
}

async function rispondiPrenotazione(req, res) {
  const { idPrenotazione, azione } = req.body;

  if (!idPrenotazione || !azione) {
    return res.status(400).json({ error: 'Dati mancanti' });
  }

  const nuovoStato = azione === 'confermata' ? 'confermata' : 'rifiutata';
  try {
    await queryDB(
      `UPDATE prenotazione_visite SET stato = $1 WHERE id = $2`,
      [nuovoStato, idPrenotazione]
    );

    res.json({ message: 'Stato aggiornato con successo' });
  } catch (err) {
    console.error('Errore aggiornamento stato prenotazione:', err);
    res.status(500).json({ error: 'Errore nel database' });
  }
}

async function cambiaPasswordAgenzia(req, res){
  const { idAgenzia, passwordAgenzia } = req.body;

  try{
    await queryDB(
      `UPDATE agenzia set password = $1 WHERE id = $2`,
      [passwordAgenzia, idAgenzia]
    );

    res.json({ message: 'Password aggiornato con successo' });

  }catch(err){
    console.error("Errore con l'UPDATE della password agenzia: ", err);
    res.status(500).json({ error: 'Errore nel database'});
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
  console.log("Controller req.utente:", req.utente);

  const idCliente = req.utente.id;

  try {
    const result = await queryDB(`
      SELECT p.id, i.titolo AS titolo_immobile, p.data_visita, i.comune, i.indirizzo
      FROM prenotazione_visite p
      JOIN immobile i ON p.id_immobile = i.id
      WHERE p.id_cliente = $1 AND p.stato = 'confermata';
    `, [idCliente]);

    console.log("Prenotazioni trovate:", result);

    // Protezione contro result o rows undefined
    const prenotazioni = (Array.isArray(result)) ? result : [];

    res.json(prenotazioni);



  } catch (err) {
    console.error('Errore nel recupero prenotazioni confermate:', err);
    res.status(500).json({ error: 'Errore nel database' });
  }
}

async function updateStoricoController(req, res) {
  const params = req.body;
  let { id_utente, id_immobile, tipo_attivita } = params;

  console.log("Dati ricevuti per l'aggiornamento dello storico:", params);

  try{
    const result = await service.updateStorico(id_utente, id_immobile, tipo_attivita);
    return res.status(200).json({ success: true });
  }catch(err){
    console.error("Errore nell'aggiornamento dello storico:", err);
    res.status(500).json({ error: 'Errore nel database' });
  }
}

async function getImmaginiController(req, res) {
  const id_immobile = req.params.id_immobile;

  try {
    const result = await queryDB(
      `SELECT path FROM immagini_immobile WHERE immobile_id = $1`,
      [id_immobile]
    );

    // Restituisci i percorsi completi
    const immagini = result.map(r => `/uploads/${r.path}`);

    res.json({ immagini });
  } catch (err) {
    console.error("Errore nel recupero immagini:", err);
    res.status(500).json({ error: "Errore nel recupero immagini" });
  }
}

async function cleanStoricoController(req, res) {
  const id_utente = req.params.id_utente;

  try {
    await service.cleanStorico(id_utente);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Errore nella pulizia dello storico:", err);
    res.status(500).json({ error: 'Errore nel database' });
  }
}

async function removeStoricoController(req, res) {
  const id = req.params.id;

  try {
    await service.removeStorico(id);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Errore nella rimozione dello storico:", err);
    res.status(500).json({ error: 'Errore nel database' });
  }
}

async function inviaOfferta(req, res) {
  try {
    const id_cliente = req.utente?.id || req.session?.userId; // fallback doppio

    const { id_immobile, prezzo_offerto, tipo_offerta, provenienza } = req.body;
    console.log("BODY RICEVUTO:", req.body);

    const idParsed = parseInt(id_immobile);
    if (isNaN(idParsed)) return res.status(400).json({ message: "ID immobile non valido" });

    const immobile = await service.getImmobiliById(idParsed);

    if (!immobile || immobile.length === 0) {
      console.log("DEBUG - immobile non trovato per ID:", idParsed);
      return res.status(404).json({ message: "Immobile non trovato" });
    }

    const id_agente = immobile[0].id_agente;

    const query = `
      INSERT INTO offerte (id_immobile, id_cliente, id_agente, prezzo_offerto, tipo_offerta, stato, provenienza)
      VALUES ($1, $2, $3, $4, $5, 'in_attesa', $6)
      RETURNING *
    `;
    const values = [idParsed, id_cliente, id_agente, prezzo_offerto, tipo_offerta, provenienza];
    const result = await queryDB(query, values);

    await queryDB(`
      INSERT INTO notifiche (id_utente, messaggio)
      VALUES ($1, $2)
    `, [id_agente, `Hai ricevuto una nuova offerta per l'immobile "${immobile[0].titolo}"`]);

    console.log("Offerta salvata:", result[0]);

    res.status(201).json({ message: "Offerta inviata con successo", offerta: result[0] });

  } catch (error) {
    console.error("Errore in inviaOfferta:", error);
    res.status(500).json({ message: "Errore interno del server" });
  }
}


async function offerteRicevuteAgente(req, res) {
  try {
    const id_agente = req.utente.id;

    const query = `
 SELECT offerte.*, immobile.titolo AS titolo_immobile
  FROM offerte
  JOIN immobile ON offerte.id_immobile = immobile.id
  WHERE offerte.id_agente = $1 AND offerte.stato = 'in_attesa'
`;
    const result = await queryDB(query, [id_agente]);

    res.json(result);
  } catch (err) {
    console.error("Errore nel recupero offerte:", err);
    res.status(500).json({ message: "Errore nel recupero delle offerte" });
  }
};



async function rispondi(req, res) {
  try {
    const { id_offerta, stato } = req.body;
    if (!["accettata", "rifiutata"].includes(stato)) {
      return res.status(400).json({ message: "Stato non valido" });
    }

    const query = `UPDATE offerte SET stato = $1 WHERE id = $2 RETURNING *`;
    const result = await queryDB(query, [stato, id_offerta]);

    if (result.length === 0) return res.status(404).json({ message: "Offerta non trovata" });

    res.json({ message: `Offerta ${stato}`, offerta: result[0] });
  } catch (err) {
    console.error("Errore nel rispondere all'offerta:", err);
    res.status(500).json({ message: "Errore nel rispondere all'offerta" });
  }
};


async function controproponi(req, res) {
  const { id_offerta, nuovo_prezzo } = req.body;

  try {
    const result = await queryDB(`
      UPDATE offerte
      SET prezzo_offerto = $1,
          tipo_offerta = 'controfferta',
          stato = 'in_attesa'
      WHERE id = $2
      RETURNING *;
    `, [nuovo_prezzo, id_offerta]);

    res.json({ message: "Controproposta inviata", data: result[0] });
  } catch (err) {
    console.error("Errore nella controproposta:", err);
    res.status(500).json({ error: "Errore nella controproposta" });
  }
};


 async function getOfferteCliente(req, res) {
  const idCliente = req.utente.id; // Assicurati che req.user venga settato dal middleware auth
  const sql = `
    SELECT o.id, o.prezzo_offerto, o.tipo_offerta, o.stato, i.titolo AS titolo_immobile
    FROM offerte o
    JOIN immobile i ON o.id_immobile = i.id
    WHERE o.id_cliente = $1
  `;

  try {
    const result = await queryDB(sql, [idCliente]);
    console.log("Offerte trovate:", result);
    return res.json(result);
  } catch (error) {
    console.error("Errore nel recupero offerte:", error);
    return res.status(500).json({ error: "Errore server" });
  }
}


async function inviaContropropostaCliente(req, res) {
  const { id_offerta, nuovo_prezzo } = req.body;

  try {
    const result = await queryDB(`
      UPDATE offerte
      SET prezzo_offerto = $1,
          tipo_offerta = 'controfferta',
          stato = 'in_attesa'
      WHERE id = $2
      RETURNING *;
    `, [nuovo_prezzo, id_offerta]);

    res.json({ message: "Controproposta inviata dal cliente", data: result[0] });
  } catch (err) {
    console.error("Errore durante l'invio della controproposta cliente:", err);
    res.status(500).json({ error: "Errore nella controproposta del cliente" });
  }
}

async function registrazioneAgenzia(req, res) {
  try {
    const { nomeAgenzia, sedeAgenzia, emailAgenzia, descrizioneAgenzia } = req.body;

    const agenziaExist = await checkAgenziaExists(emailAgenzia);
    if (agenziaExist) {
      return res.status(400).json({ message: 'Agenzia con email già esistente.' });
    }

    const result = await queryDB(`
      INSERT INTO agenzia (nome, sede, email, descrizione)
      VALUES ($1, $2, $3, $4)`,
      [nomeAgenzia, sedeAgenzia, emailAgenzia, descrizioneAgenzia]);

    return res.status(201).json({ success: true });

  } catch (error) {
    console.error('Errore durante la creazione agenzia:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function getAgenziaByAgenteId(req, res) {
  const id = req.params.id;

  try {
    const result = await queryDB(`
      SELECT a.nome, a.sede, a.email, a.descrizione
      FROM agente ag
      JOIN agenzia a ON ag.id_agenzia = a.id
      WHERE ag.id = $1;
    `, [id]);

    if (result.length === 0) {
      return res.status(404).json({ message: 'Agenzia non trovata' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Errore nel recupero agenzia:', error);
    res.status(500).json({ message: 'Errore del server durante il recupero dell\'agenzia' });
  }
}

async function eliminaAgenteController(req, res){
  const id = req.params.id;
  try {
    await queryDB('DELETE FROM utente WHERE id = $1', [id]);
    res.status(200).json({ message: 'Agente eliminato con successo' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore durante l\'eliminazione dell\'agente' });
  }
};

async function switchPrimoAccessoController(req, res) {
  const idAgenzia = req.body.idAgenzia;
  const primoAccesso = req.body.primoAccesso;

  try {
    await queryDB('UPDATE agenzia SET primo_accesso = $1 WHERE id = $2', [primoAccesso, idAgenzia]);
    res.status(200).json({ message: 'Primo accesso completato con successo' });
  } catch (err) {
    console.error('Errore durante l\'aggiornamento del primo accesso:', err);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento del primo accesso' });
  }
}


export {
  login,
  loginAgenzia,
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
  getUserBooksController,
  getUserStoricoController,
  caricaImmobileController,
  prenotaVisitaController,
  updateStoricoController,
  getImmaginiController,
  cleanStoricoController,
  removeStoricoController,
  inviaOfferta,
  offerteRicevuteAgente,
  rispondi,
  controproponi,
  getOfferteCliente,
  getAgentiByAgenziaIdController,
  inviaContropropostaCliente,
  getAgenziaByAgenteId,
  cambiaPasswordAgenzia,
  eliminaAgenteController,
  switchPrimoAccessoController,
};

