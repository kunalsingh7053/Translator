const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
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
        let isNewUser = false;


        if (!user) {
          const nameParts = profile.displayName.split(" ");
          const firstName = nameParts[0];
          const lastName =
            nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

          user = await User.create({
            email,
            fullName: {
              firstName,
              lastName,
            },
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value || "",
            language: "en",
          });
                    isNewUser = true; // 👈 IMPORTANT

        }

                return done(null, { user, isNewUser });

      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
