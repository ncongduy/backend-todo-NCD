const express = require('express');
const passport = require('passport');

const {
  getAllTaskAllUser,
  getAllTaskOneUser,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('./task.controller.js');

const router = express.Router();

router.get('/', getAllTaskAllUser);
router.get('/user/:userId', passport.authenticate('jwt', {session: false}), getAllTaskOneUser);
router.get('/user', getAllTaskOneUser);
router.get('/:taskId', getTask);
router.post('/', createTask);
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

module.exports = router;
