const request = require('supertest');

const app = require('../app.js');

describe('GET /api/user', () => {
	test('responds with status 200', async () => {
		const response = await request(app).get('/api/user');

		expect(response.statusCode).toBe(200);
	});
});
