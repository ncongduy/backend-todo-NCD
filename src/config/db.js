import dotenv from 'dotenv';
import {Sequelize} from 'sequelize';

dotenv.config();

const database = process.env.POSTGRES_DB;
const user = process.env.POSTGRES_USERNAME;
const password = process.env.POSTGRES_PASSWORD;
const host = process.env.POSTGRES_HOST;
const port = Number(process.env.POSTGRES_PORT);

const db = new Sequelize(database, user, password, {
	host,
	port,
	dialect: 'postgres',
});

export default db;
