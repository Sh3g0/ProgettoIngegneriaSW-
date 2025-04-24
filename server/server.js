const express = require('express');
const app = express();
const coseRoutes = require('./Router/postsRoute.js');  // Importato come coseRoutes

app.use('/api/cose', coseRoutes);  // Usato come coseRoutes (non coseRoute)

app.listen(3001, () => {
  console.log('Server attivo');
});