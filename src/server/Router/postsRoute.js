const express = require('express');
const router = express.Router();
const { getUserRole, createClient } = require('../controllers/postsController');

router.get('/', (req, res) => {
  res.send('Pagina principale del server');
});

//Route per ottenere il ruolo dell'utente
router.post('/login', getUserRole);  // POST per login

//Route di registrazione
router.post('/registrazione', createClient);  // POST per registrazione

module.exports = router;