const express = require('express');
const passport = require('passport');
const router = express.Router();
require('dotenv').config();

const {register, login, me} = require("../controllers/auth");
const auth = require("../middlewares/auth");

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);

// 🔹 Google OAuth Login
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

// 🔹 Google OAuth Callback
router.get('/google/callback',
    passport.authenticate('google', {failureRedirect: '/api/auth/google/failure'}),
    (req, res) => {
        const {token} = req.user;
        const redirectUrl = `${process.env.FRONTEND_URL}/oauth-success?token=${token}`;
        res.redirect(redirectUrl);
    }
);

// 🔹 Google Success & Failure Routes
router.get('/google/success', (req, res) => {
    if (!req.user) return res.status(401).json({message: "Not Authenticated"});
    res.json({message: 'Google authentication successful', user: req.user});
});

router.get('/google/failure', (req, res) => {
    res.status(401).json({message: 'Google authentication failed'});
});

// 🔹 Facebook OAuth Login
router.get('/facebook', passport.authenticate('facebook', {scope: ['email']}));

// 🔹 Facebook OAuth Callback
router.get('/facebook/callback',
    passport.authenticate('facebook', {failureRedirect: '/api/auth/facebook/failure'}),
    (req, res) => {
        const token = req.user?.token;
        res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}}`);
    }
);

// 🔹 Facebook Success & Failure Routes
router.get('/facebook/success', (req, res) => {
    if (!req.user) return res.status(401).json({message: "Not Authenticated"});
    res.json({message: 'Facebook authentication successful', user: req.user});
});

router.get('/facebook/failure', (req, res) => {
    res.status(401).json({message: 'Facebook authentication failed'});
});

// 🔹 Logout Route
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect(process.env.FRONTEND_URL);
    });
});

module.exports = router;
