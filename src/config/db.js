import dotenv from 'dotenv';
import {Sequelize} from 'sequelize';

dotenv.config();

const user = process.env.POSTGRES_USERNAME;
const host = process.env.POSTGRES_HOST;
const database = process.env.POSTGRES_DB;
const password = process.env.POSTGRES_PASSWORD;
const port = Number(process.env.POSTGRES_PORT);

const db = new Sequelize(database, user, password, {
	host,
	dialect: 'postgres',
	port,
	pool: {
		max: 5,
		min: 0,
		idle: 10000,
		acquire: 30000,
	},
});

export default db;
