import express from 'express';

import {getAllUser, getUser, createUser, updateUser, deleteUser} from './user.controller.js';

const router = express.Router();

router.get('/', getAllUser);
router.get('/:userId', getUser);
router.post('/', createUser);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

export default router;
