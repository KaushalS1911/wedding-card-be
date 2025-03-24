const express = require('express');
const passport = require('passport');
const {
    register,
    login,
    me
} = require("../controllers/auth");

const router = express.Router();

// Standard Auth Routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', me);

// Google OAuth Routes
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/api/auth/google/success',
    failureRedirect: '/api/auth/google/failure'
}));

router.get('/google/success', (req, res) => {
    res.json({message: 'Google authentication successful', user: req.user});
});

router.get('/google/failure', (req, res) => {
    res.status(401).json({message: 'Google authentication failed'});
});

module.exports = router;
