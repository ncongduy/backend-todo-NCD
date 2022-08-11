const request = require('supertest');

const app = require('../src/app.js');
jest.mock('../src/user/user.model.js');
jest.mock('../src/task/task.model.js');
jest.mock('../src/utils/logError.js');

describe('Authenticate by github', () => {
  test('GET /auth/github', async () => {
    const response = await request(app).get('/auth/github');

    expect(response.statusCode).toBe(302);
  });

  test('GET /auth/github/callback', async () => {
    const response = await request(app).get('/auth/github/callback');

    expect(response.statusCode).toBe(302);
  });
});

describe('Authenticate by password', () => {
  test('POST /auth/password => user login successful', async () => {
    await request(app).post('/api/user').send({
      firstName: 'Tu',
      lastName: 'Nguyen',
      email: 'tu@gmail.com',
      password: 'tu123',
    });

    const response = await request(app).post('/auth/password').send({
      email: 'tu@gmail.com',
      password: 'tu123',
      register: 'app-system',
    });

    expect(response['_body']).toHaveProperty('token');
    expect(response['_body'].token).not.toBeNull();
    expect(response['_body'].userId).toBe(3);
    expect(response['_body'].role).toBe('user');
  });
  test('user login failure with non exist email', async () => {
    const response = await request(app).post('/auth/password').send({
      email: 'abc@gmail.com',
      password: 'abc123',
      register: 'app-system',
    });
    expect(response['_body'].status).toBe('error');
    expect(response['_body'].statusCode).toBe(404);
    expect(response['_body'].message).toBe('User does not exist.');
  });
  test('user login failure with wrong password', async () => {
    const response = await request(app).post('/auth/password').send({
      email: 'tu@gmail.com',
      password: 'abc123',
      register: 'app-system',
    });

    expect(response['_body'].status).toBe('error');
    expect(response['_body'].statusCode).toBe(403);
    expect(response['_body'].message).toBe('Password is not correct.');
  });
  test('user login failure when do not enter password', async () => {
    const response = await request(app).post('/auth/password').send({
      email: 'tu@gmail.com',
      password: '',
      register: 'app-system',
    });

    expect(response['_body'].status).toBe('error');
    expect(response['_body'].statusCode).toBe(403);
    expect(response['_body'].message).toBe('Password is not correct.');
  });
});
