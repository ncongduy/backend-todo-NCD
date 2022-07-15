import UserService from './user.service.js';
import {BadRequestError} from '../middleware/errorHandler.js';

const getAllUser = async (req, res, next) => {
	try {
		const allUser = await UserService.getAll();

		return res.status(200).json(allUser);
	} catch (error) {
		if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
			next(new BadRequestError('Invalid Request', error));
		} else {
			next(error);
		}
	}
};

const getUser = async (req, res, next) => {
	try {
		const id = req.params.userId;
		const user = await UserService.getOne(id);

		return res.status(200).json(user);
	} catch (error) {
		if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
			next(new BadRequestError('Invalid Request', error));
		} else {
			next(error);
		}
	}
};

const createUser = async (req, res, next) => {
	try {
		const newUser = await UserService.create(req.body);

		return res.status(200).json(newUser);
	} catch (error) {
		if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
			next(new BadRequestError('Invalid Request', error));
		} else {
			next(error);
		}
	}
};

const updateUser = async (req, res, next) => {
	try {
		const userId = req.params.userId;
		const data = req.body;
		const updateUser = await UserService.update(data, userId);

		return res.status(200).json(updateUser);
	} catch (error) {
		if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
			next(new BadRequestError('Invalid Request', error));
		} else {
			next(error);
		}
	}
};

const deleteUser = async (req, res, next) => {
	try {
		const userId = req.params.userId;
		await UserService.deleteOne(userId);

		return res.status(204).end();
	} catch (error) {
		if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
			next(new BadRequestError('Invalid Request', error));
		} else {
			next(error);
		}
	}
};

export {getAllUser, getUser, createUser, updateUser, deleteUser};
