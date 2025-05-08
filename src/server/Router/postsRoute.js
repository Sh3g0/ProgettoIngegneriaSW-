const express = require('express');
const router = express.Router();
const { getUserRoleController, addClientController, getImmobiliByCoordsController, getImmobiliByFilterController, getImmobiliByIdController, getImmobiliByAdvancedFilterController } = require('../controllers/postsController');

router.get('/', (req, res) => {
  res.send('Pagina principale del server');
});

//Route per ottenere il ruolo dell'utente
router.post('/login', getUserRoleController);  // POST per login

//Route di registrazione
router.post('/signup', addClientController);  // POST per registrazione

//Route per mostrare gli immobili
router.post('/getImmobiliById', getImmobiliByIdController);

router.post('/getImmobiliByCoords', getImmobiliByCoordsController);

router.post('/getImmobiliByAdvancedFilter', getImmobiliByAdvancedFilterController);

router.post('/getImmobiliByFilter', getImmobiliByFilterController);

module.exports = router;