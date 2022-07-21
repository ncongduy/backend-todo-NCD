const express = require('express');

const {getAllUser, getUser, createUser, updateUser, deleteUser, authenticateUser} = require('./user.controller.js');

const router = express.Router();

router.get('/', getAllUser);
router.get('/:userId', getUser);
router.post('/', createUser);
router.post('/login', authenticateUser);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

module.exports = router;
