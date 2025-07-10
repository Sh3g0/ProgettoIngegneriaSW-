import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import './auth/passport-config.js'; 

import postRoutes from './router/postsRoute.js'; 
import authRoutes from './auth/auth.js';          

const app = express();
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import path from 'path';
// Configurazione CORS
app.use(cors({
  origin: 'http://localhost:3000',  
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: 'broskiSecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,     
    httpOnly: true,
    sameSite: 'lax'    
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', postRoutes);  
app.use('/auth', authRoutes); 

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server attivo sulla porta ${PORT}`));
