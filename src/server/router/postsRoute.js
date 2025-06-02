import express from 'express';
import { verificaToken } from '../middlewares/verificaToken.js';
import multer from "multer";
import * as controller from '../controllers/postsController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Le rotte API vere e proprie
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
router.get('/notificaAppuntamento', verificaToken, controller.getNotifichePrenotazioni);
router.get('/dateOccupate/:id_immobile', verificaToken, controller.getDateBloccaVisita);

router.post('/notifiche/rispondi', verificaToken, controller.rispondiPrenotazione);
router.get('/prenotazioni/confermate/:idAgente', verificaToken, controller.getPrenotazioniConfermate);
router.get('/prenotazioniConfermateCliente', verificaToken, verificaToken, controller.getPrenotazioniAccettateCliente);

router.post('/inviaOfferta', verificaToken, controller.inviaOfferta);
router.get('/offerteRicevuteAgente', verificaToken, controller.offerteRicevuteAgente);

router.post('/rispondi', verificaToken, controller.rispondi);
router.post('/controproponi', verificaToken, controller.controproponi);
router.post('/inviaContropropostaCliente', verificaToken, controller.inviaContropropostaCliente);

router.get('/getOfferteCliente', verificaToken, controller.getOfferteCliente);

router.post('/getUserBooks', verificaToken, controller.getUserBooksController);
router.post('/getUserStorico', verificaToken, controller.getUserStoricoController);

router.post('/caricaImmobile', verificaToken, upload.array("immagini"), controller.caricaImmobileController);

router.post('/updateStorico', controller.updateStoricoController);
router.post('/cleanStorico/:id_utente', controller.cleanStoricoController);
router.post('/removeStorico/:id', controller.removeStoricoController);

export default router;
