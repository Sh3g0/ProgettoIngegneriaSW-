import express from 'express';
import { verificaToken } from '../middlewares/verificaToken.js';


import { 
  login,
  getImmobiliByAdvancedFilterController,
  getImmobiliByCoordsController,
  registrazioneUtente,
  getImmobiliByIdController,
  registrazioneAgenzia,
  getImmobiliByFilterController 
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

//Rotta protetta
//router.post('/prenotaVisita', authenticateJWT, prenotaVisitaController);

export default router;
