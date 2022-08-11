const request = require('supertest');

const app = require('../src/app.js');
jest.mock('../src/user/user.model.js');
jest.mock('../src/utils/logError.js');

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5jb25nZHV5QGdpdGh1Yi5jb20iLCJyZWdpc3RlciI6ImdpdGh1YiIsInVzZXJJZCI6NSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjYwMDQ0MDQzfQ.llC6z92agjpm-8gyznBdYaUjk7DYQSgXMii6uyIJlTY';

const requestFunc = async (method, url, data) => {
  switch (method) {
    case 'GET':
      return await request(app)
        .get(url)
        .set({
          Authorization: `Bearer ${token}`,
        });
    case 'POST':
      return await request(app)
        .post(url)
        .send(data)
        .set({
          Authorization: `Bearer ${token}`,
        });
    case 'PUT':
      return await request(app)
        .put(url)
        .send(data)
        .set({
          Authorization: `Bearer ${token}`,
        });
    case 'DELETE':
      return await request(app)
        .delete(url)
        .set({
          Authorization: `Bearer ${token}`,
        });
    default:
      return null;
  }
};

describe('test user api with authentication simulation', () => {
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
      expect(response['_body'].role).toBe('user');
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

  describe('GET /api/user', () => {
    test('get all user', async () => {
      const response = await requestFunc('GET', '/api/user');

      expect(response.statusCode).toBe(200);
      expect(response['_body'].length).toBe(4);
      expect(response['_body'][0].id).toBe(1);
      expect(response['_body'][0].firstName).toBe('Bao');
      expect(response['_body'][0].email).toBe('bao@gmail.com');
      expect(response['_body'][1].id).toBe(2);
      expect(response['_body'][1].firstName).toBe('Duy');
      expect(response['_body'][1].email).toBe('duy@gmail.com');
      expect(response['_body'][2].id).toBe(5);
      expect(response['_body'][2].firstName).toBe('Duy Nguyen Cong');
      expect(response['_body'][2].email).toBe('ncongduy@github.com');
      expect(response['_body'][3].id).toBe(3);
      expect(response['_body'][3].firstName).toBe('Tu');
      expect(response['_body'][3].email).toBe('tu@gmail.com');
    });
  });

  describe('GET /api/user/:userId', () => {
    test('get one user with correct id', async () => {
      const response = await requestFunc('GET', '/api/user/1');

      expect(response.statusCode).toBe(200);
      expect(response['_body'].firstName).toBe('Bao');
      expect(response['_body'].lastName).toBe('Tran');
      expect(response['_body'].email).toBe('bao@gmail.com');
    });

    test('can not get one user with wrong id', async () => {
      const response = await requestFunc('GET', '/api/user/9');

      expect(response.statusCode).toBe(404);
      expect(response['_body'].status).toBe('error');
      expect(response['_body'].message).toBe('User does not exist.');
    });
  });

  describe('PUT /api/user/:userId', () => {
    test('update user with correct validation', async () => {
      const response = await requestFunc('PUT', '/api/user/2', {
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
      const response = await requestFunc('PUT', '/api/user/2', {
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
      const response1 = await requestFunc('DELETE', '/api/user/2');
      expect(response1.statusCode).toBe(204);

      const response2 = await requestFunc('GET', '/api/user/2');
      expect(response2.statusCode).toBe(404);
      expect(response2['_body'].status).toBe('error');
      expect(response2['_body'].message).toBe('User does not exist.');
    });
  });
});
