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

//Rotta protetta
router.post('/getUserBooks', verificaToken, controller.getUserBooksController);
router.post('/getUserStorico', verificaToken, controller.getUserStoricoController);
router.post('/caricaImmobile', verificaToken, upload.array("immagini"), controller.caricaImmobileController);
//router.post('/prenotaVisita', verificaToken, prenotaVisitaController);

export default router;
