const express = require('express');
const cors = require('cors'); 
const app = express();

const postsRoute = require('./Router/postsRoute.js');

//Middleware
app.use(cors({
  origin: '*'
}));
app.use(express.json());

//Per le immagini
app.use('/uploads', express.static('public/uploads'));

//Configura le rotte
app.use('/api', postsRoute);

//Avvia il server sulla porta 3001
app.listen(3001, () => {
  console.log('Database in ascolto sulla porta 3001');
});
