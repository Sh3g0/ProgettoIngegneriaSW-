import express from 'express';
import { verificaToken } from '../middlewares/verificaToken.js';
import multer from "multer";
import * as controller from '../controllers/postsController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Autenticazione standard
router.post('/login', controller.login);
router.post('/registrazione', controller.registrazioneUtente);
router.post('/registrazioneAgenzia', controller.registrazioneAgenzia);

router.post('/getImmobiliById', controller.getImmobiliByIdController);
router.post('/getImmobiliByCoords', controller.getImmobiliByCoordsController);
router.post('/getImmobiliByAdvancedFilter', controller.getImmobiliByAdvancedFilterController);
router.post('/getImmobiliByFilter', controller.getImmobiliByFilterController);

router.get('/getImmagini/:id_immobile', controller.getImmaginiController);

//Rotte protette
router.post('/prenotazioneVisita', verificaToken, controller.prenotaVisitaController);
router.get('/notificaAppuntamento/:agenteId', verificaToken, controller.getNotifichePrenotazioni);
router.get('/dateOccupate/:id_immobile', verificaToken, controller.getDateBloccaVisita);

router.post('/notifiche/rispondi', verificaToken, controller.rispondiPrenotazione);
router.get('/prenotazioni/confermate/:idAgente', verificaToken, controller.getPrenotazioniConfermate);
router.get('/prenotazioniConfermateCliente/:idCliente', verificaToken, controller.getPrenotazioniAccettateCliente);

router.post('/getUserBooks', verificaToken, controller.getUserBooksController);
router.post('/getUserStorico', verificaToken, controller.getUserStoricoController);
router.post('/caricaImmobile', verificaToken, upload.array("immagini"), controller.caricaImmobileController);

router.post('/updateStorico', controller.updateStoricoController);
router.post('/cleanStorico/:id_utente', controller.cleanStoricoController);
router.post('/removeStorico/:id', controller.removeStoricoController);

export default router;
