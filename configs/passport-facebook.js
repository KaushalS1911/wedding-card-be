const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");
const {ROLES} = require("../constants");
const {generateToken} = require("../auth/jwt");
require("dotenv").config();

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
            profileFields: ["id", "emails", "name", "displayName", "picture"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const firstName = profile.name?.givenName || profile.displayName?.split(" ")[0] || "Facebook";
                const lastName = profile.name?.familyName || profile.displayName?.split(" ")[1] || "User";
                const email = profile.emails?.[0]?.value || `${profile.id}@facebook.com`;

                let user = await User.findOne({email});

                if (!user) {
                    user = new User({
                        firstName,
                        lastName,
                        email,
                        role: ROLES.USER,
                        isPremium: false,
                    });

                    await user.save();
                }

                const token = generateToken(user._id);

                return done(null, {user, token});
            } catch (error) {
                console.error("Facebook Auth Error:", error);
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((data, done) => {
    done(null, data);
});

passport.deserializeUser(async (data, done) => {
    try {
        done(null, {user: data.user, token: data.token});
    } catch (error) {
        done(error);
    }
});

module.exports = passport;
