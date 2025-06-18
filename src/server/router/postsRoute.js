import express from 'express';
import { verificaToken } from '../middlewares/verificaToken.js';
import multer from "multer";
import * as controller from '../controllers/postsController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Le rotte API vere e proprie
router.post('/login', controller.login);
router.post('/loginAgenzia', controller.loginAgenzia);
router.post('/registrazione', controller.registrazioneUtente);
router.post('/registrazioneAgenzia', controller.registrazioneAgenzia);
router.post('/cambiaPasswordAgenzia', controller.cambiaPasswordAgenzia);

router.post('/getImmobiliById', controller.getImmobiliByIdController);
router.post('/getImmobiliByCoords', controller.getImmobiliByCoordsController);
router.post('/getImmobiliByAdvancedFilter', controller.getImmobiliByAdvancedFilterController);
router.post('/getImmobiliByFilter', controller.getImmobiliByFilterController);
router.get('/getImmobiliByAgente/:id', controller.getImmobiliByAgenteController);


router.post('/prenotazioneVisita', verificaToken, controller.prenotaVisitaController);
router.get('/notificaAppuntamento', verificaToken, controller.getNotifichePrenotazioni);
router.get('/dateOccupate/:id_immobile', controller.getDateBloccaVisita);

router.post('/notifiche/rispondi', verificaToken, controller.rispondiPrenotazione);
router.get('/prenotazioni/confermate/:idAgente', controller.getPrenotazioniConfermate);
router.get('/prenotazioniConfermateCliente', verificaToken, controller.getPrenotazioniAccettateCliente);
router.post('/inviaOfferta', verificaToken, controller.inviaOfferta);
router.get('/offerteRicevuteAgente', verificaToken, controller.offerteRicevuteAgente);

router.post('/rispondi', verificaToken, controller.rispondi);
router.post('/controproponi', verificaToken, controller.controproponi);
router.post('/inviaContropropostaCliente', verificaToken, controller.inviaContropropostaCliente);

router.get('/getOfferteCliente', verificaToken, controller.getOfferteCliente);

router.post('/getUserBooks', verificaToken, controller.getUserBooksController);
router.post('/getUserStorico', verificaToken, controller.getUserStoricoController);

router.post('/caricaImmobile', verificaToken, upload.array("immagini"), controller.caricaImmobileController);
router.get('/getImmagini/:id_immobile', controller.getImmaginiController)
//router.post('/prenotaVisita', verificaToken, prenotaVisitaController);

router.get('/getAgenziaByAgenteId/:id', controller.getAgenziaByAgenteId);

router.get('/getAgentiByAgenzia/:idAgenzia', controller.getAgentiByAgenziaIdController);
router.get('/getAgenziaByAgenteId/:id', controller.getAgenziaByAgenteId);

router.get('/getAgentiByAgenzia/:idAgenzia', controller.getAgentiByAgenziaIdController);
router.get('/getAgenziaByAgenteId/:id', controller.getAgenziaByAgenteId);

router.get('/getAgentiByAgenzia/:idAgenzia', controller.getAgentiByAgenziaIdController);
router.delete('/eliminaAgente/:id', controller.eliminaAgenteController);

router.post('/switchPrimoAccesso', controller.switchPrimoAccessoController);

export default router;
