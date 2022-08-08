const express = require('express');
const passport = require('passport');

const {getAllUser, getUser, createUser, updateUser, deleteUser, authenticateUser} = require('./user.controller.js');

const router = express.Router();

router.get('/', getAllUser);
router.get('/:userId', getUser);

router.get('/auth/github', passport.authenticate('github', {scope: ['user:email'], session: false}));
router.get('/auth/github/callback', passport.authenticate('github', {session: false}), authenticateUser);

router.post('/', createUser);
router.post('/login', authenticateUser);

router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

module.exports = router;
