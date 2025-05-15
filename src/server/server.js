import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import postRoutes from './router/postsRoute.js'; // Rotte generali

const app = express();

// Configurazione CORS
app.use(cors({
  origin: '*'
}));


// Middleware
app.use(express.json());


app.use('/api', postRoutes); // Rotte generali

// Avvio del server
app.listen(process.env.DB_PORT, () => console.log(`Database attivo sulla porta ${process.env.DB_PORT}`));
