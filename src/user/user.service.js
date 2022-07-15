import UserModel from './user.model.js';

import {NotFoundError} from '../middleware/errorHandler.js';

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
	const newUser = await UserModel.create(data);

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

export default {getAll, getOne, create, update, deleteOne};
