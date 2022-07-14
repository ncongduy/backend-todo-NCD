import UserService from './user.service.js';
import {BadRequestError} from '../middleware/errorHandler'; // need to fix later

const getAllUser = async (req, res) => {
	try {
		const allUser = await UserService.getAll();

		return res.status(200).json(allUser);
	} catch (error) {
		if (error instanceof Error && error.name == 'SequelizeValidationError') {
			next(new BadRequestError('Invalid Request', error));
		} else {
			next(error);
		}
	}
};

const getUser = async (req, res) => {
	try {
		const id = req.params.userId;
		const user = await UserService.getOne(id);

		return res.status(200).json(user);
	} catch (error) {
		if (error instanceof Error && error.name == 'SequelizeValidationError') {
			next(new BadRequestError('Invalid Request', error));
		} else {
			next(error);
		}
	}
};

const createUser = async (req, res) => {
	try {
		const newUser = await UserService.create(req.body);

		return res.status(200).json(newUser);
	} catch (error) {
		if (error instanceof Error && error.name == 'SequelizeValidationError') {
			next(new BadRequestError('Invalid Request', error));
		} else {
			next(error);
		}
	}
};

const updateUser = async (req, res) => {
	try {
		const userId = req.params.userId;
		const data = req.body;
		const updateUser = await UserService.update(data, userId);

		return res.status(200).json(updateUser);
	} catch (error) {
		if (error instanceof Error && error.name == 'SequelizeValidationError') {
			next(new BadRequestError('Invalid Request', error));
		} else {
			next(error);
		}
	}
};

const deleteUser = async (req, res) => {
	try {
		const userId = req.params.userId;
		await UserService.deleteOne(userId);

		res.status(204).end();
	} catch (error) {
		if (error instanceof Error && error.name == 'SequelizeValidationError') {
			next(new BadRequestError('Invalid Request', error));
		} else {
			next(error);
		}
	}
};

export {getAllUser, getUser, createUser, updateUser, deleteUser};
