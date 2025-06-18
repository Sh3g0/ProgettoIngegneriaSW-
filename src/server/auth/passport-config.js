import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';

dotenv.config();
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
    users.push(user);
  }
  return done(null, user);
}));

passport.use(new FacebookStrategy({
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