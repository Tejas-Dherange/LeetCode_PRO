import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import db from "./db.js";
import dotenv from "dotenv";
dotenv.config();
// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract user data from Google profile
        const googleId = profile.id;
        const email = profile.emails[0].value;
        const emailVerified = profile.emails[0].verified;
        const name = profile.displayName;
        const image = profile.photos?.[0]?.value || null;

        // Try to find existing user by googleId first
        let user = await db.user.findFirst({
          where: {
            googleId: googleId,
          },
        });

        // If not found by googleId, try to find by email
        if (!user) {
          user = await db.user.findUnique({
            where: {
              email: email,
            },
          });

          // If user exists with this email, link Google account
          if (user) {
            user = await db.user.update({
              where: { id: user.id },
              data: {
                googleId: googleId,
                emailVerified: emailVerified,
                image: user.image  ||  image  , // Keep existing image if no Google image
              },
            });
          }
        } else {
          // Update existing Google user's verified status
          user = await db.user.update({
            where: { id: user.id },
            data: {
              emailVerified: emailVerified,
              image: user.image  ||  image  ,
            },
          });
        }

        // If user still doesn't exist, create new user
        if (!user) {
          user = await db.user.create({
            data: {
              name: name,
              email: email,
              password: null, // No password for OAuth users
              googleId: googleId,
              emailVerified: emailVerified,
              image: image,
              role: "USER",
            },
          });
        }

        // Return user to callback
        return done(null, user);
      } catch (error) {
        console.error("Error in Google OAuth strategy:", error);
        return done(error, null);
      }
    }
  )
);

// Serialize user for session (not used with JWT, but required by Passport)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session (not used with JWT, but required by Passport)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
