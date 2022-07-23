const request = require('supertest');

const app = require('../src/app.js');
jest.mock('../src/task/task.model.js');
jest.mock('../src/user/user.model.js');
jest.mock('../src/utils/logError.js');

const createValidToken = async () => {
  await request(app).post('/api/user').send({
    firstName: 'Tu',
    lastName: 'Nguyen',
    email: 'tu@gmail.com',
    password: 'tu123',
  });

  const response = await request(app).post('/api/user/login').send({
    email: 'tu@gmail.com',
    password: 'tu123',
  });

  return response['_body'].token;
};

let token;
const tokenNonExist =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5jb25nZHV5QGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY1MzAzMDIxNH0.oCXfl1lGdnCnywB8D-LSTh8wFYICVLK2OZbFb8YBJo4';

describe('GET /api/task', () => {
  test('can not get all task without authentication', async () => {
    const response = await request(app).get('/api/task');

    expect(response.statusCode).toBe(401);
    expect(response.error.text).toBe('Unauthorized');
  });

  test('can not get all task with invalid token', async () => {
    const response = await request(app)
      .get('/api/task')
      .set({Authorization: `Bearer ${tokenNonExist}`});

    expect(response.statusCode).toBe(401);
    expect(response.error.text).toBe('Unauthorized');
  });

  test('get all task with valid token from password authentication', async () => {
    token = await createValidToken();
    const response = await request(app)
      .get('/api/task')
      .set({Authorization: `Bearer ${token}`});

    expect(response.statusCode).toBe(200);
    expect(response['_body'].length).toBe(4);
  });
});

describe('GET /api/task/user/:userId', () => {
  test('can not get all task of one user without authentication', async () => {
    const response = await request(app).get('/api/task/user/1');

    expect(response.statusCode).toBe(401);
    expect(response.error.text).toBe('Unauthorized');
  });

  test('can not get all task of one user with invalid token', async () => {
    const response = await request(app)
      .get('/api/task/user/1')
      .set({Authorization: `Bearer ${tokenNonExist}`});

    expect(response.statusCode).toBe(401);
    expect(response.error.text).toBe('Unauthorized');
  });

  test('can not get all task with non exist userId', async () => {
    const response1 = await request(app)
      .get('/api/task/user/9')
      .set({Authorization: `Bearer ${token}`});
    expect(response1.statusCode).toBe(404);
    expect(response1['_body'].status).toBe('error');
    expect(response1['_body'].message).toBe('User does not exist');

    const response2 = await request(app)
      .get('/api/task/user/abc')
      .set({Authorization: `Bearer ${token}`});
    expect(response2.statusCode).toBe(404);
    expect(response2['_body'].status).toBe('error');
    expect(response2['_body'].message).toBe('User does not exist');

    const response3 = await request(app)
      .get('/api/task/user')
      .set({Authorization: `Bearer ${token}`});
    expect(response3.statusCode).toBe(404);
    expect(response3['_body'].status).toBe('error');
    expect(response3['_body'].message).toBe('User does not exist');
  });

  test('get all task of one user with valid token from password authentication', async () => {
    const response = await request(app)
      .get('/api/task/user/1')
      .set({Authorization: `Bearer ${token}`});

    expect(response.statusCode).toBe(200);
    expect(response['_body'].length).toBe(2);
    expect(response['_body'][0].description).toBe('wash clothes');
    expect(response['_body'][1].description).toBe('learn coding');
    expect(response['_body'][0].isCompleted).toBe(false);
    expect(response['_body'][1].isCompleted).toBe(false);
    expect(response['_body'][0].userId).toBe(1);
    expect(response['_body'][1].userId).toBe(1);
  });
});

describe('GET /api/task/:taskId', () => {
  test('can not get one task without authentication', async () => {
    const response = await request(app).get('/api/task/1');

    expect(response.statusCode).toBe(401);
    expect(response.error.text).toBe('Unauthorized');
  });

  test('can not get one task with invalid token', async () => {
    const response = await request(app)
      .get('/api/task/1')
      .set({Authorization: `Bearer ${tokenNonExist}`});

    expect(response.statusCode).toBe(401);
    expect(response.error.text).toBe('Unauthorized');
  });

  test('can not get one task with wrong id', async () => {
    const response = await request(app)
      .get('/api/task/9')
      .set({Authorization: `Bearer ${token}`});

    expect(response.statusCode).toBe(404);
    expect(response['_body'].status).toBe('error');
    expect(response['_body'].message).toBe('Task does not exist.');
  });

  test('get one task with correct id and valid token', async () => {
    const response = await request(app)
      .get('/api/task/1')
      .set({Authorization: `Bearer ${token}`});

    expect(response.statusCode).toBe(200);
    expect(response['_body'].description).toBe('wash clothes');
    expect(response['_body'].isCompleted).toBe(false);
    expect(response['_body'].userId).toBe(1);
  });
});

describe('POST /api/task', () => {
  test('can not create one task without authentication', async () => {
    const response = await request(app).post('/api/task').send({
      description: 'learn English',
      isCompleted: false,
      userId: 2,
    });

    expect(response.statusCode).toBe(401);
    expect(response.error.text).toBe('Unauthorized');
  });

  test('can not create one task with invalid token', async () => {
    const response = await request(app)
      .post('/api/task')
      .send({
        description: 'learn English',
        isCompleted: false,
        userId: 2,
      })
      .set({Authorization: `Bearer ${tokenNonExist}`});

    expect(response.statusCode).toBe(401);
    expect(response.error.text).toBe('Unauthorized');
  });

  test('can not create task with non exist user and valid token', async () => {
    const response = await request(app)
      .post('/api/task')
      .send({
        description: 'learn Finnish',
        isCompleted: false,
        userId: 9,
      })
      .set({Authorization: `Bearer ${token}`});

    expect(response.statusCode).toBe(404);
    expect(response['_body'].status).toBe('error');
    expect(response['_body'].message).toBe('User does not exist');
  });

  test('cant not create one task without JSON type', async () => {
    const response = await request(app)
      .post('/api/task')
      .send(`description: 'learn English', isCompleted: false, userId: 2,`)
      .set({Authorization: `Bearer ${token}`});

    expect(response.statusCode).toBe(400);
    expect(response['_body'].status).toBe('error');
    expect(response['_body'].message).toBe('Request body must be of type json');
  });

  test('create one task with exist user and valid token', async () => {
    const response = await request(app)
      .post('/api/task')
      .send({
        description: 'learn English',
        isCompleted: false,
        userId: 2,
      })
      .set({Authorization: `Bearer ${token}`});

    expect(response.statusCode).toBe(200);
    expect(response['_body'].description).toBe('learn English');
    expect(response['_body'].isCompleted).toBe(false);
    expect(response['_body'].userId).toBe(2);
  });
});

describe('PUT /api/task/:taskId', () => {
  test('can not update one task without authentication', async () => {
    const response = await request(app).put('/api/task/2').send({
      description: 'learn English',
      isCompleted: false,
      userId: 2,
    });

    expect(response.statusCode).toBe(401);
    expect(response.error.text).toBe('Unauthorized');
  });

  test('can not update one task with invalid token', async () => {
    const response = await request(app)
      .put('/api/task/2')
      .send({
        description: 'learn English',
        isCompleted: false,
        userId: 2,
      })
      .set({Authorization: `Bearer ${tokenNonExist}`});

    expect(response.statusCode).toBe(401);
    expect(response.error.text).toBe('Unauthorized');
  });

  test('can not update task with non exist taskId', async () => {
    const response = await request(app)
      .put('/api/task/9')
      .send({
        description: 'learn programming',
        isCompleted: true,
      })
      .set({Authorization: `Bearer ${token}`});

    expect(response.statusCode).toBe(404);
    expect(response['_body'].status).toBe('error');
    expect(response['_body'].message).toBe('Task does not exist.');
  });

  test('update task with exist taskId and valid token', async () => {
    const response = await request(app)
      .put('/api/task/2')
      .send({
        description: 'learn programming',
        isCompleted: true,
      })
      .set({Authorization: `Bearer ${token}`});

    expect(response.statusCode).toBe(200);
    expect(response['_body'].description).toBe('learn programming');
    expect(response['_body'].isCompleted).toBe(true);
    expect(response['_body'].userId).toBe(1);
    expect(response['_body'].id).toBe(2);
  });
});

describe('DELETE /api/task/:taskId', () => {
  test('can not delete one task without authentication', async () => {
    const response = await request(app).delete('/api/task/2');

    expect(response.statusCode).toBe(401);
    expect(response.error.text).toBe('Unauthorized');
  });

  test('can not delete one task with invalid token', async () => {
    const response = await request(app)
      .delete('/api/task/2')
      .set({Authorization: `Bearer ${tokenNonExist}`});

    expect(response.statusCode).toBe(401);
    expect(response.error.text).toBe('Unauthorized');
  });

  test('delete a task with correct id and valid token', async () => {
    const response1 = await request(app)
      .delete('/api/task/2')
      .set({Authorization: `Bearer ${token}`});
    expect(response1.statusCode).toBe(204);

    const response2 = await request(app)
      .get('/api/task/2')
      .set({Authorization: `Bearer ${token}`});
    expect(response2.statusCode).toBe(404);
    expect(response2['_body'].status).toBe('error');
    expect(response2['_body'].message).toBe('Task does not exist.');
  });
});
