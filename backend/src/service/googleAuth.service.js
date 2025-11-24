const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const User = require("../models/user.model");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (!user) {
          // first time Google login → create user
          const fullName = profile.displayName.split(" ");
          const firstName = fullName[0];
          const lastName = fullName.length > 1 ? fullName.slice(1).join(" ") : "";

          user = await User.create({
            email,
            fullName: { 
              firstName,
              lastName,
            },
            googleId: profile.id,
            avatar: profile.photos[0].value,
            language: "en", // default language for Google signup
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
