import passport from 'passport';
import bcrypt from 'bcryptjs';

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { pool } from '../db/database.js'; // Nota il `.js` alla fine se il file è un modulo ES


// Strategia per Google
passport.use(new GoogleStrategy({
  clientID: '1051339038030-hlckjvqci6o30gir84e5apq7omgp2191.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:3001/auth/google/callback',
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      const result = await pool.query('SELECT * FROM utente WHERE email = $1', [profile.emails[0].value]);

      if (result.rows.length > 0) {
        return done(null, result.rows[0]);
      } else {
        const newUser = {
          email: profile.emails[0].value,
          username: profile.displayName,
          google_id: profile.id,
          ruolo: 'cliente'
        };

        const insertQuery = `
        INSERT INTO utente (email, username, google_id, ruolo)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
        const insertResult = await pool.query(insertQuery, [newUser.email, newUser.username, newUser.google_id, newUser.ruolo]);

        return done(null, insertResult.rows[0]);
      }
    } catch (error) {
      console.error('Errore durante la registrazione o il login con Google:', error);
      return done(error, false);
    }
  }));

// Strategia per Facebook
passport.use(new FacebookStrategy({
  clientID: '1612809316101930',
  clientSecret: 'cd944e162f0658a7e1808be36fe6acce',
  callbackURL: 'http://localhost:3001/auth/facebook/callback',
  profileFields: ['id', 'emails', 'displayName'],
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const result = await pool.query('SELECT * FROM utente WHERE email = $1', [email]);

      if (result.rows.length > 0) {
        return done(null, result.rows[0]);
      } else {
        const newUser = {
          email: email,
          username: profile.displayName,
          facebook_id: profile.id,
          ruolo: 'cliente'
        };

        const insertQuery = `
      INSERT INTO utente (email, username, google_id, ruolo)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
        const insertResult = await pool.query(insertQuery, [newUser.email, newUser.username, newUser.facebook_id, newUser.ruolo]);

        return done(null, insertResult.rows[0]);
      }
    } catch (error) {
      console.error('Errore durante la registrazione o il login con Facebook:', error);
      return done(error, false);
    }
  }));

// Serializzazione dell'utente
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializzazione dell'utente
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM utente WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});
