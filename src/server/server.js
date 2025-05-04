const express = require('express');
const cors = require('cors');  // <--- AGGIUNGI QUESTO
const app = express();

const postsRoute = require('./Router/postsRoute.js');

//Middleware
app.use(cors({
  origin: '*'
}));
app.use(express.json());

//Configura le rotte
app.use('/api', postsRoute);

//Avvia il server sulla porta 3001
app.listen(3001, () => {
  console.log('Database in ascolto sulla porta 3001');
});
