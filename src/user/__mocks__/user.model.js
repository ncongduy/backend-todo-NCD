const {MockError} = require('../../middleware/errorHandler.js');

const UserModel = {
	users: [
		{
			id: 1,
			firstName: 'Bao',
			lastName: 'Tran',
			email: 'bao@gmail.com',
			register: 'google',
			password: null,
			createdAt: '2022-07-15T07:32:51.243Z',
			updatedAt: '2022-07-15T07:32:51.243Z',
		},
		{
			id: 2,
			firstName: 'Duy',
			lastName: 'Nguyen',
			email: 'duy@gmail.com',
			register: 'google',
			password: null,
			createdAt: '2022-07-15T07:27:12.058Z',
			updatedAt: '2022-07-15T14:53:40.493Z',
		},
	],
	async findAll() {
		return this.users;
	},
	async findOne(data) {
		const id = Number(data.where.id);
		const email = data.where.email;
		let result;

		if (id) {
			result = this.users.find((user) => user.id === id);
			if (!result) return null;
		}

		if (email) {
			result = this.users.find((user) => user.email === email);
			if (!result) return null;
		}

		return result;
	},
	async create(data) {
		const {firstName, lastName, email, password} = data;

		// check validation
		const checkUniqueEmail = this.users.some((user) => user.email === email);
		if (checkUniqueEmail) {
			throw new MockError('SequelizeUniqueConstraintError', 'testing');
		}

		const newData = {
			id: 3,
			firstName,
			lastName,
			email,
			register: 'app-system',
			password,
			createdAt: '2022-07-15T07:27:12.058Z',
			updatedAt: '2022-07-15T14:53:40.493Z',
		};

		this.users.push(newData);
		return newData;
	},
	async update(data, userId) {
		const id = Number(userId.where.id);
		const {firstName, lastName, email} = data;

		// check validation
		const checkUniqueEmail = this.users.some((user) => user.email === email);
		if (checkUniqueEmail) {
			throw new MockError('SequelizeUniqueConstraintError', 'testing');
		}

		const foundUser = this.users.find((user) => user.id === id);
		foundUser.firstName = firstName;
		foundUser.lastName = lastName;
		foundUser.email = email;
	},
	async destroy(userId) {
		const id = Number(userId.where.id);
		const userDelete = this.users.find((user) => user.id === id);
		const index = this.users.indexOf(userDelete);
		this.users.splice(index, 1);
	},
};

module.exports = UserModel;
