const bcrypt = require('bcrypt');

const UserModel = require('./user.model.js');
const {NotFoundError} = require('../middleware/errorHandler.js');

const getAll = async () => {
  const allUser = await UserModel.findAll();

  return allUser;
};

const getOne = async (id) => {
  const foundUser = await UserModel.findOne({where: {id: id}});
  if (!foundUser) throw new NotFoundError('User does not exist.');

  return foundUser;
};

const create = async (data) => {
  const {password, register} = data;

  if (!password && register !== 'app-system') {
    const newUser = await UserModel.create(data);

    return newUser;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newData = {...data, password: hashedPassword};
  const newUser = await UserModel.create(newData);

  return newUser;
};

const update = async (data, id) => {
  await getOne(id);
  await UserModel.update(data, {where: {id: id}});
  const newUpdateUser = await getOne(id);

  return newUpdateUser;
};

const deleteOne = async (id) => {
  await getOne(id);
  await UserModel.destroy({where: {id: id}});
};

module.exports = {getAll, getOne, create, update, deleteOne};
