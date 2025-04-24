const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Lista delle cose');
});

module.exports = router;
