const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');
const ROLES = require("../constants");
require("dotenv").config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({email: profile.emails[0].value});

        if (!user) {
            user = await User.create({
                firstName: profile.name?.givenName || "",
                lastName: profile.name?.familyName || "",
                email: profile.emails[0].value,
                password: 12345678,
                role: ROLES.USER,
                isPremium: false,
            });
        }

        done(null, user);
    } catch (error) {
        done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
