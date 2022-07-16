const {DataTypes} = require('sequelize');

const db = require('../config/db.js');
const Task = require('../task/task.model.js');

const User = db.define('User', {
	firstName: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			isAlpha: true,
			notEmpty: true,
			notNull: true,
		},
	},
	lastName: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			isAlpha: true,
			notEmpty: true,
			notNull: true,
		},
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true,
			notEmpty: true,
			notNull: true,
		},
	},
	register: {
		type: DataTypes.STRING,
		defaultValue: 'app-system',
		validate: {
			isIn: [['app-system', 'google']],
		},
	},
	password: {
		type: DataTypes.STRING,
		validate: {
			len: [6, 20],
		},
	},
});

User.hasMany(Task, {
	foreignKey: 'userId',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

// Task.belongsTo(User);

User.sync({alter: true})
	.then(() => {
		console.log('Table User synchronize successfully.');
	})
	.catch((error) => console.error('Table User can not synchronize with error: ', error));

module.exports = User;
