//File per la gestione dei controller relativi alle query

const { getRoleByUsernameAndPassword, addClient, getImmobiliByCoords, getImmobiliByFilter, getImmobiliById , getImmobiliByAdvancedFilters} = require('../services/postsServices');

//Controller per ottenere il ruolo di un utente dato username e password
async function getUserRoleController(req, res) {
  try {
    console.log('Corpo della richiesta:', req.body);
    const { username, password } = req.body;
    const role = await getRoleByUsernameAndPassword(username, password);
    res.json({ role });
  } catch (error) {
    console.error('Errore nel controller login');
    res.status(400).json({ message: error.message });
  }
}

//Controller per inserire un nuovo cliente
async function addClientController(req, res) {
  try {
    const { email, username, password, ruolo, idAgenzia } = req.body;

    if (!username || !email || !password || !ruolo) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori.' });
    }

    //Verifica se l'email o username esistono già
    const userExists = await pool.query('SELECT * FROM utente WHERE email = $1 OR username = $2', [email, username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Email o username già in uso.' });
    }

    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 10);

    const clientId = await addClient(email, username, hashedPassword, ruolo, idAgenzia);
    res.status(201).json({ clientId });
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
