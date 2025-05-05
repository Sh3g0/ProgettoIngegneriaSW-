import express from 'express';
import passport from 'passport';

import { getUserRole, createClient, creazioneAgenzia } from '../controllers/postsController.js';

const router = express.Router();
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { getUserInfo } from '../controllers/postsController.js';

router.get('/user', authenticateToken, getUserInfo);


// Resto delle rotte
router.post('/login', getUserRole);
router.post('/signup', createClient);
router.post('/creazioneAzienda', creazioneAgenzia);

// Avvio login con Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// Callback che Google chiama dopo il login
router.get('/google/callback', passport.authenticate('google', {
  successRedirect: 'http://localhost:3000/homeCliente',
  failureRedirect: '/login',
}));

// Avvio login con Facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Callback che Facebook chiama dopo il login
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: 'http://localhost:3000/homeCliente',
  failureRedirect: '/login',
}));

export default router;
