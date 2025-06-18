import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

const generateTokenRedirect = (req, res) => {
  const user = req.user;
  const payload = {
    id: user.id,
    ruolo: user.ruolo,
    username: user.username
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  const redirectUrl = `http://localhost:3000/successoLogin?token=${token}&id=${user.id}&ruolo=${user.ruolo}&username=${user.username}`;
  res.redirect(redirectUrl);
};

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), generateTokenRedirect);

router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), generateTokenRedirect);



export default router;