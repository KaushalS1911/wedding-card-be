const passportGoogle = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const {ROLES} = require("../constants");
const {generateToken} = require("../auth/jwt");
require("dotenv").config();

passportGoogle.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
            return done(new Error("Google account does not have an email associated."));
        }

        let user = await User.findOne({email});

        if (!user) {
            user = new User({
                firstName: profile.name?.givenName || "Google",
                lastName: profile.name?.familyName || "User",
                email,
                role: ROLES.USER,
                isPremium: false,
                password: 12345678,
            });

            await user.save();
        }

        const token = generateToken(user.id);
        req.user = user;
        done(null, {user, token});
    } catch (error) {
        console.error("Google Auth Error:", error);
        done(error);
    }
}));

passportGoogle.serializeUser((data, done) => {
    done(null, data);
});

passportGoogle.deserializeUser(async (data, done) => {
    try {
        done(null, {user: data.user, token: data.token});
    } catch (error) {
        done(error);
    }
});
