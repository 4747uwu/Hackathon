import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/userModel.js"; // Import your User model

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback", // Ensure this matches the URI in Google Developer Console
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google profile:", profile);
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          console.log("Creating new user");
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });
          await user.save();
        } else {
          console.log("User found:", user);
        }

        return done(null, user);
      } catch (err) {
        console.error("Error in GoogleStrategy:", err);
        return done(err, null);
      }
    }
  )
);

// Serialize & Deserialize user
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  console.log("Deserializing user with id:", id);
  const user = await User.findById(id);
  done(null, user);
});

export default passport;