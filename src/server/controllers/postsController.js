//File per la gestione dei controller relativi alle query

const { getRoleByUsernameAndPassword, addClient, getImmobili } = require('../services/postsServices');

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

async function showImmobiliController(req, res) {
  try {

    const params = req.body
    const { id, lat, lng, prezzo_min, prezzo_max, dimensione, piano, stanze, ascensore, classe_energetica, portineria, tipo_annuncio } = params;

    // Chiamata al servizio per ottenere gli immobili
    const immobili = await getImmobili(id, lat, lng, prezzo_min, prezzo_max, dimensione, piano, stanze, ascensore, classe_energetica, portineria, tipo_annuncio);

    // Restituisce gli immobili trovati
    return res.json(immobili);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Errore nel recupero degli immobili' });
  }
}

module.exports = {
  getUserRoleController,
  addClientController,
  showImmobiliController
};
