const express = require('express');
const router = express.Router();
const { getUserRoleController, addClientController, showImmobiliController } = require('../controllers/postsController');

router.get('/', (req, res) => {
  res.send('Pagina principale del server');
});

//Route per ottenere il ruolo dell'utente
router.post('/login', getUserRoleController);  // POST per login

//Route di registrazione
router.post('/signup', addClientController);  // POST per registrazione

//Route per mostrare gli immobili
router.post('/showImmobili', showImmobiliController);

module.exports = router;