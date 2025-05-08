import express from 'express';
import passport from 'passport';

import {
  getUserRole,
  createClient,
  creazioneAgenzia,
  getUserInfo,
  getImmobiliByAdvancedFilterController,
  getImmobiliByCoordsController,
  getImmobiliByIdController,
  getImmobiliByFilterController
} from '../controllers/postsController.js';

import { authenticateToken } from '../middlewares/authenticateToken.js';

const router = express.Router();

// Rotta protetta per recuperare info utente loggato
router.get('/user', authenticateToken, getUserInfo);

// Autenticazione standard
router.post('/login', getUserRole);
router.post('/signup', createClient);
router.post('/creazioneAzienda', creazioneAgenzia);
router.post('/getImmobiliById', getImmobiliByIdController);

router.post('/getImmobiliByCoords', getImmobiliByCoordsController);

router.post('/getImmobiliByAdvancedFilter', getImmobiliByAdvancedFilterController);

router.post('/getImmobiliByFilter', getImmobiliByFilterController);

// Login con Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

router.get('/google/callback', passport.authenticate('google', {
  successRedirect: 'http://localhost:3000/homeCliente',
  failureRedirect: '/login',
}));

// Login con Facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: 'http://localhost:3000/homeCliente',
  failureRedirect: '/login',
}));

export default router;
