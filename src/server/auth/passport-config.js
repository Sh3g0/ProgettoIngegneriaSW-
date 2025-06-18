import passport from 'passport';
import dotenv from 'dotenv';
<<<<<<< HEAD

import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
dotenv.config();

// Simuliamo un DB utenti (in realtà usa DB vero)
=======
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';

dotenv.config();
>>>>>>> origin/lavoro6
const users = [];

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  done(null, user || null);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  let user = users.find(u => u.id === profile.id);
  if (!user) {
<<<<<<< HEAD
    user = { id: profile.id, name: profile.displayName, provider: 'google' };
=======
    const email = profile.emails?.[0]?.value || '';
    const username = email.split('@')[0]; // tipo "claudiacoppola"
    const ruolo = 'cliente'; // default

    user = {
      id: profile.id,
      name: profile.displayName,
      provider: 'google',
      username,
      ruolo,
      email
    };
>>>>>>> origin/lavoro6
    users.push(user);
  }
  return done(null, user);
}));

passport.use(new FacebookStrategy({
<<<<<<< HEAD
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'emails']
}, (accessToken, refreshToken, profile, done) => {
  let user = users.find(u => u.id === profile.id);
  if (!user) {
    user = { id: profile.id, name: profile.displayName, provider: 'facebook' };
    users.push(user);
  }
  return done(null, user);
}));
=======
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: "http://localhost:3001/auth/facebook/callback",
  profileFields: ['id', 'emails', 'name', 'displayName']
},
  async (accessToken, refreshToken, profile, done) => {
    console.log('FACEBOOK PROFILE:', profile);

    const user = {
      id: profile.id,
      username: profile.displayName || `${profile.name.givenName}_${profile.id.slice(-4)}` || 'utenteFB',
      ruolo: 'cliente',
      email: profile.emails?.[0]?.value || `noemail_${profile.id}@facebook.com`
    };

    done(null, user);
  }
));
>>>>>>> origin/lavoro6
