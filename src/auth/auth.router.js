const express = require('express');
const passport = require('passport');

const {githubAuthenticate, passwordAuthenticate} = require('./auth.controller.js');

const router = express.Router();

// github authentication
router.get('/github', passport.authenticate('github', {scope: ['user:email'], session: false}));
router.get('/github/callback', passport.authenticate('github', {session: false}), githubAuthenticate);

// password authentication
router.post('/password', passwordAuthenticate);

module.exports = router;
