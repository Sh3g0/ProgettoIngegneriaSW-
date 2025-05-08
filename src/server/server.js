import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';

import './config/passport.js'; // Inizializza le strategie di Passport
import postRoutes from './Router/postsRoute.js'; // Rotte per post, login, signup, OAuth

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true

}));
app.use(express.json());
app.use(session({ secret: 'secretbro', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', postRoutes); // Rotte generali
app.use('/auth', postRoutes); // Rotte OAuth

// Avvio del server
app.listen(3001, () => console.log('Database attivo sulla porta 3001'));