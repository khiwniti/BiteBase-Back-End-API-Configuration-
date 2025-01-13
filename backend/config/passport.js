const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const pool = require('./db');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://www.example.com/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const query = `
          INSERT INTO users (username, email)
          VALUES ($1, $2)
          ON CONFLICT (email) DO NOTHING
        `;
        await pool.query(query, [profile.displayName, profile.emails[0].value]);
        return done(null, profile);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'displayName', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const query = `
          INSERT INTO users (username, email)
          VALUES ($1, $2)
          ON CONFLICT (email) DO NOTHING
        `;
        await pool.query(query, [profile.displayName, profile.emails[0].value]);
        return done(null, profile);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;