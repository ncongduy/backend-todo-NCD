const TaskModel = require('./task.model.js');
const UserModel = require('../user/user.model.js');
const {NotFoundError} = require('../middleware/errorHandler.js');

const getAllTaskAllUser = async () => {
  const allTask = await TaskModel.findAll();

  return allTask;
};

const getAllTaskOneUser = async (userId) => {
  if (!userId) throw new NotFoundError('User does not exist');

  const foundUser = await UserModel.findOne({where: {id: userId}});
  if (!foundUser) throw new NotFoundError('User does not exist');

  const foundTask = await TaskModel.findAll({where: {userId}});
  if (!foundTask) throw new NotFoundError('Task does not exist');

  return foundTask;
};

const getOne = async (id) => {
  const foundTask = await TaskModel.findOne({where: {id: id}});
  if (!foundTask) throw new NotFoundError('Task does not exist.');

  return foundTask;
};

const create = async (data) => {
  const newTask = await TaskModel.create(data);

  return newTask;
};

const update = async (data, id) => {
  await getOne(id);
  await TaskModel.update(data, {where: {id: id}});
  const newUpdateTask = await getOne(id);

  return newUpdateTask;
};

const deleteOne = async (id) => {
  await getOne(id);
  await TaskModel.destroy({where: {id: id}});
};

module.exports = {getAllTaskAllUser, getAllTaskOneUser, getOne, create, update, deleteOne};
