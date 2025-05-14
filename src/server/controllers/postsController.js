import jwt from 'jsonwebtoken';

import { getUser, 
        getImmobiliByCoords, 
        getImmobiliByFilter, 
        getImmobiliById, 
        getImmobiliByAdvancedFilters 
      } from '../services/postsServices.js';

//Controller per ottenere il ruolo di un utente dato username e password
async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await getUser(username, password);

    return res.json(user)
  } catch (error) {
    console.error("Errore login:", error);
    res.status(500).json({ message: "Errore login" });
  }
}

async function getImmobiliByAdvancedFilterController(req, res) {
  try {

    const params = req.body
    let { lat, lng, prezzoMin, prezzoMax, dimensione, piano, stanze, ascensore, classe_energetica, portineria, tipoAnnuncio, climatizzazione } = params;
    tipoAnnuncio = tipoAnnuncio === 'qualsiasi' ? ['affitto','vendita'] : [tipoAnnuncio];
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

    tipoAnnuncio = tipoAnnuncio === 'qualsiasi' ? ['affitto','vendita'] : [tipoAnnuncio];

    const immobili = await getImmobiliByFilter(lat, lng, prezzoMin, prezzoMax, superficie, tipoAnnuncio);

    return res.json(immobili);

  }catch(e){
    console.log("Errore: ", e);
    return res.status(500).json({ error: 'Errore nel recupero degli immobili' });
  }
}

export {
  login,
  getImmobiliByCoordsController,
  getImmobiliByFilterController,
  getImmobiliByAdvancedFilterController,
  getImmobiliByIdController
};

