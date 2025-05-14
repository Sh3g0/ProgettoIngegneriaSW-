import express from 'express';

import { 
  login,
  getImmobiliByAdvancedFilterController,
  getImmobiliByCoordsController,
  getImmobiliByIdController,
  getImmobiliByFilterController 
} from '../controllers/postsController.js';

const router = express.Router();

// Autenticazione standard
router.post('/login', login);
router.post('/getImmobiliById', getImmobiliByIdController);
router.post('/getImmobiliByCoords', getImmobiliByCoordsController);
router.post('/getImmobiliByAdvancedFilter', getImmobiliByAdvancedFilterController);
router.post('/getImmobiliByFilter', getImmobiliByFilterController);

//Rotta protetta
//router.post('/prenotaVisita', authenticateJWT, prenotaVisitaController);

export default router;
