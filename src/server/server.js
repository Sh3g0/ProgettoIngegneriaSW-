import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import './auth/passport-config.js'; // config passport strategies

import postRoutes from './router/postsRoute.js';  // API routes
import authRoutes from './auth/auth.js';          // Auth routes (Google, Facebook)

const app = express();
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import path from 'path';
// Configurazione CORS
app.use(cors({
  origin: '*',  // frontend URL
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: 'broskiSecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,     // metti true in produzione con https
    httpOnly: true,
    sameSite: 'lax'    // per permettere cookie cross-site con frontend su porta differente
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', postRoutes);  // API REST
app.use('/auth', authRoutes); // Auth routes
app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads')));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server attivo sulla porta ${PORT}`));
