import express from 'express';
import { verificaToken } from '../middlewares/verificaToken.js';


import {
  login,
  getImmobiliByAdvancedFilterController,
  getImmobiliByCoordsController,
  registrazioneUtente,
  getImmobiliByIdController,
  registrazioneAgenzia,
  prenotaVisitaController,
  getImmobiliByFilterController,
  rispondiPrenotazione,
  getNotifichePrenotazioni,
  getPrenotazioniConfermate,
  getPrenotazioniAccettateCliente,
  getDateBloccaVisita,

} from '../controllers/postsController.js';

const router = express.Router();

// Autenticazione standard
router.post('/login', login);
router.post('/registrazione', registrazioneUtente);
router.post('/registrazioneAgenzia', registrazioneAgenzia);

router.post('/getImmobiliById', getImmobiliByIdController);
router.post('/getImmobiliByCoords', getImmobiliByCoordsController);
router.post('/getImmobiliByAdvancedFilter', getImmobiliByAdvancedFilterController);
router.post('/getImmobiliByFilter', getImmobiliByFilterController);

router.post('/prenotazioneVisita', verificaToken, prenotaVisitaController);
router.get('/notificaAppuntamento/:agenteId', verificaToken, getNotifichePrenotazioni);
router.get('/dateOccupate/:id_immobile', getDateBloccaVisita);

router.post('/notifiche/rispondi', verificaToken, rispondiPrenotazione);
router.get('/prenotazioni/confermate/:idAgente', getPrenotazioniConfermate);
router.get('/prenotazioniConfermateCliente/:idCliente', getPrenotazioniAccettateCliente);





//Rotta protetta
//router.post('/prenotaVisita', authenticateJWT, prenotaVisitaController);

export default router;
