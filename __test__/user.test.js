const request = require('supertest');

const app = require('../src/app.js');
jest.mock('../src/user/user.model.js');
jest.mock('../src/utils/logError.js');

describe('GET /api/user', () => {
  test('get all user', async () => {
    const response = await request(app).get('/api/user');

    expect(response.statusCode).toBe(200);
    expect(response['_body'].length).toBe(2);
    expect(response['_body'][0].id).toBe(1);
    expect(response['_body'][0].firstName).toBe('Bao');
    expect(response['_body'][0].email).toBe('bao@gmail.com');
    expect(response['_body'][1].id).toBe(2);
    expect(response['_body'][1].firstName).toBe('Duy');
    expect(response['_body'][1].email).toBe('duy@gmail.com');
  });
});

describe('GET /api/user/:userId', () => {
  test('get one user with correct id', async () => {
    const response = await request(app).get('/api/user/1');

    expect(response.statusCode).toBe(200);
    expect(response['_body'].firstName).toBe('Bao');
    expect(response['_body'].lastName).toBe('Tran');
    expect(response['_body'].email).toBe('bao@gmail.com');
  });

  test('can not get one user with wrong id', async () => {
    const response = await request(app).get('/api/user/9');

    expect(response.statusCode).toBe(404);
    expect(response['_body'].status).toBe('error');
    expect(response['_body'].message).toBe('User does not exist.');
  });
});

describe('POST /api/user', () => {
  test('create one user with correct validation', async () => {
    const response = await request(app).post('/api/user').send({
      firstName: 'Tu',
      lastName: 'Nguyen',
      email: 'tu@gmail.com',
      password: 'tu123',
    });

    expect(response.statusCode).toBe(200);
    expect(response['_body'].id).toBe(3);
    expect(response['_body'].firstName).toBe('Tu');
    expect(response['_body'].lastName).toBe('Nguyen');
    expect(response['_body'].email).toBe('tu@gmail.com');
    expect(response['_body'].password).not.toBeNull();
  });

  test('can not create a new user with exist email of other user', async () => {
    const response = await request(app).post('/api/user').send({
      firstName: 'Testing',
      lastName: 'Error',
      email: 'duy@gmail.com',
    });

    expect(response.statusCode).toBe(400);
    expect(response['_body'].status).toBe('error');
    expect(response['_body'].message).toBe('Invalid Request');
  });
});

describe('POST /api/user/login', () => {
  test('user login successful', async () => {
    const response = await request(app).post('/api/user/login').send({
      email: 'tu@gmail.com',
      password: 'tu123',
    });

    expect(response['_body']).toHaveProperty('token');
    expect(response['_body'].token).not.toBeNull();
    expect(response['_body'].userId).toBe(3);
  });

  test('user login failure with non exist email', async () => {
    const response = await request(app).post('/api/user/login').send({
      email: 'abc@gmail.com',
      password: 'abc123',
    });

    expect(response['_body'].status).toBe('error');
    expect(response['_body'].statusCode).toBe(404);
    expect(response['_body'].message).toBe('User does not exist.');
  });

  test('user login failure with wrong password', async () => {
    const response = await request(app).post('/api/user/login').send({
      email: 'tu@gmail.com',
      password: 'abc123',
    });

    expect(response['_body'].status).toBe('error');
    expect(response['_body'].statusCode).toBe(403);
    expect(response['_body'].message).toBe('Password is not correct.');
  });
});

describe('PUT /api/user/:userId', () => {
  test('update user with correct validation', async () => {
    const response = await request(app).put('/api/user/2').send({
      firstName: 'Pauli',
      lastName: 'Nguyen',
      email: 'pauli@gmail.com',
    });

    expect(response.statusCode).toBe(200);
    expect(response['_body'].firstName).toBe('Pauli');
    expect(response['_body'].lastName).toBe('Nguyen');
    expect(response['_body'].email).toBe('pauli@gmail.com');
  });

  test('can not update user with an exist email already', async () => {
    const response = await request(app).put('/api/user/2').send({
      firstName: 'Testing',
      lastName: 'Error',
      email: 'bao@gmail.com',
    });

    expect(response.statusCode).toBe(400);
    expect(response['_body'].status).toBe('error');
    expect(response['_body'].message).toBe('Invalid Request');
  });
});

describe('DELETE /api/user/:userId', () => {
  test('delete a user with correct id', async () => {
    const response1 = await request(app).delete('/api/user/2');
    expect(response1.statusCode).toBe(204);

    const response2 = await request(app).get('/api/user/2');
    expect(response2.statusCode).toBe(404);
    expect(response2['_body'].status).toBe('error');
    expect(response2['_body'].message).toBe('User does not exist.');
  });
});
