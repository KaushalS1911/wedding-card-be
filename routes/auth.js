const express = require('express');
const passport = require('passport');
const router = express.Router();

const {register, login, me} = require("../controllers/auth");
const auth = require("../middlewares/auth");

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);

// Google OAuth Login
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

// Google OAuth Callback
router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/api/auth/google/failure'}), (req, res) => {
    res.redirect("http://localhost:5173/dashboard");
});

// Success & Failure Routes
router.get('/google/success', (req, res) => {
    if (!req.user) return res.status(401).json({message: "Not Authenticated"});
    res.json({message: 'Google authentication successful', user: req.user});
});

router.get('/google/failure', (req, res) => {
    res.status(401).json({message: 'Google authentication failed'});
});

// Logout
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect("http://localhost:5173");
    });
});

module.exports = router;
