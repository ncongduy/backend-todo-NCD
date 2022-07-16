const TaskService = require('./task.service.js');
const {BadRequestError} = require('../middleware/errorHandler.js');

const getAllTaskAllUser = async (req, res, next) => {
  try {
    const allTaskAllUser = await TaskService.getAllTaskAllUser();

    return res.status(200).json(allTaskAllUser);
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      next(new BadRequestError('Invalid Request', error));
    } else {
      next(error);
    }
  }
};

const getAllTaskOneUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const allTaskOneUser = await TaskService.getAllTaskOneUser(userId);

    return res.status(200).json(allTaskOneUser);
  } catch (error) {
    console.log('controller catching error: ', error);

    if (
      error.name === 'SequelizeValidationError' ||
      error.name === 'SequelizeUniqueConstraintError' ||
      error.name === 'SequelizeDatabaseError'
    ) {
      next(new BadRequestError('Invalid Request', error));
    } else {
      next(error);
    }
  }
};

const getTask = async (req, res, next) => {
  try {
    const id = req.params.taskId;
    const task = await TaskService.getOne(id);

    return res.status(200).json(task);
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      next(new BadRequestError('Invalid Request', error));
    } else {
      next(error);
    }
  }
};

const createTask = async (req, res, next) => {
  try {
    const newTask = await TaskService.create(req.body);

    return res.status(200).json(newTask);
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      next(new BadRequestError('Invalid Request', error));
    } else {
      next(error);
    }
  }
};

const updateTask = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    const data = req.body;
    const updateTask = await TaskService.update(data, taskId);

    return res.status(200).json(updateTask);
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      next(new BadRequestError('Invalid Request', error));
    } else {
      next(error);
    }
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    await TaskService.deleteOne(taskId);

    return res.status(204).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      next(new BadRequestError('Invalid Request', error));
    } else {
      next(error);
    }
  }
};

module.exports = {getAllTaskAllUser, getAllTaskOneUser, getTask, createTask, updateTask, deleteTask};
