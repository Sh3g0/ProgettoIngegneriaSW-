import express from 'express';
import cors from 'cors';

import postRoutes from './Router/postsRoute.js'; // Rotte generali

const app = express();

// Configurazione CORS
app.use(cors({
  origin: '*'
}));

// Middleware
app.use(express.json());


app.use('/api', postRoutes); // Rotte generali

// Avvio del server
app.listen(3001, () => console.log('Database attivo sulla porta 3001'));
