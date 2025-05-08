import express from 'express';

import { 
  getUserRoleController,
  getImmobiliByAdvancedFilterController,
  getImmobiliByCoordsController,
  getImmobiliByIdController,
  getImmobiliByFilterController 
} from '../controllers/postsController.js';

const router = express.Router();

// Autenticazione standard
router.post('/login', getUserRoleController);
router.post('/getImmobiliById', getImmobiliByIdController);

router.post('/getImmobiliByCoords', getImmobiliByCoordsController);

router.post('/getImmobiliByAdvancedFilter', getImmobiliByAdvancedFilterController);

router.post('/getImmobiliByFilter', getImmobiliByFilterController);

export default router;
