import dotenv from 'dotenv';
dotenv.config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);
import cors from 'cors';
import express from 'express';

import postRoutes from './router/postsRoute.js'; // Rotte generali

const app = express();
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import path from 'path';
// Configurazione CORS
app.use(cors({
  origin: '*'
}));


// Middleware
app.use(express.json());


app.use('/api', postRoutes); // Rotte generali
app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads')));

const PORT = process.env.DB_PORT || 3001;
app.listen(PORT, () => console.log(`Server attivo sulla porta ${PORT}`));

