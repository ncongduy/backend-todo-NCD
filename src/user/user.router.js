const express = require('express');
const passport = require('passport');

const {getAllUser, getUser, createUser, updateUser, deleteUser} = require('./user.controller.js');

const router = express.Router();

router.post('/', createUser);
router.use(['/', '/:userId'], passport.authenticate('jwt', {session: false}));
router.get('/', getAllUser);
router.get('/:userId', getUser);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

module.exports = router;
