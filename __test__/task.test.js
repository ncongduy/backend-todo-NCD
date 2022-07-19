const request = require('supertest');

const app = require('../src/app.js');
jest.mock('../src/task/task.model.js');
jest.mock('../src/user/user.model.js');
jest.mock('../src/utils/logError.js');

describe('GET /api/task', () => {
  test('get all task', async () => {
    const response = await request(app).get('/api/task');

    expect(response.statusCode).toBe(200);
    expect(response['_body'].length).toBe(4);
  });
});

describe('GET /api/task/user/:userId', () => {
  test('get all task of one user', async () => {
    const response = await request(app).get('/api/task/user/1');

    expect(response.statusCode).toBe(200);
    expect(response['_body'].length).toBe(2);
    expect(response['_body'][0].description).toBe('wash clothes');
    expect(response['_body'][1].description).toBe('learn coding');
    expect(response['_body'][0].isCompleted).toBe(false);
    expect(response['_body'][1].isCompleted).toBe(false);
    expect(response['_body'][0].userId).toBe(1);
    expect(response['_body'][1].userId).toBe(1);
  });

  test('can not get all task with non exist userId', async () => {
    const response1 = await request(app).get('/api/task/user/9');
    expect(response1.statusCode).toBe(404);
    expect(response1['_body'].status).toBe('error');
    expect(response1['_body'].message).toBe('User does not exist');

    const response2 = await request(app).get('/api/task/user/abc');
    expect(response2.statusCode).toBe(404);
    expect(response2['_body'].status).toBe('error');
    expect(response2['_body'].message).toBe('User does not exist');

    const response3 = await request(app).get('/api/task/user');
    expect(response3.statusCode).toBe(404);
    expect(response3['_body'].status).toBe('error');
    expect(response3['_body'].message).toBe('User does not exist');
  });
});

describe('GET /api/task/:taskId', () => {
  test('get one task with correct id', async () => {
    const response = await request(app).get('/api/task/1');

    expect(response.statusCode).toBe(200);
    expect(response['_body'].description).toBe('wash clothes');
    expect(response['_body'].isCompleted).toBe(false);
    expect(response['_body'].userId).toBe(1);
  });

  test('can not get one task with wrong id', async () => {
    const response = await request(app).get('/api/task/9');

    expect(response.statusCode).toBe(404);
    expect(response['_body'].status).toBe('error');
    expect(response['_body'].message).toBe('Task does not exist.');
  });
});

describe('POST /api/task', () => {
  test('create one task with exist user', async () => {
    const response = await request(app).post('/api/task').send({
      description: 'learn English',
      isCompleted: false,
      userId: 2,
    });

    expect(response.statusCode).toBe(200);
    expect(response['_body'].description).toBe('learn English');
    expect(response['_body'].isCompleted).toBe(false);
    expect(response['_body'].userId).toBe(2);
  });

  test('can not create task with non exist user', async () => {
    const response = await request(app).post('/api/task').send({
      description: 'learn Finnish',
      isCompleted: false,
      userId: 9,
    });

    expect(response.statusCode).toBe(404);
    expect(response['_body'].status).toBe('error');
    expect(response['_body'].message).toBe('User does not exist');
  });
});

describe('PUT /api/task/:taskId', () => {
  test('update task with exist taskId', async () => {
    const response = await request(app).put('/api/task/2').send({
      description: 'learn programming',
      isCompleted: true,
    });

    expect(response.statusCode).toBe(200);
    expect(response['_body'].description).toBe('learn programming');
    expect(response['_body'].isCompleted).toBe(true);
    expect(response['_body'].userId).toBe(1);
    expect(response['_body'].id).toBe(2);
  });

  test('can not update task with non exist taskId', async () => {
    const response = await request(app).put('/api/task/9').send({
      description: 'learn programming',
      isCompleted: true,
    });

    expect(response.statusCode).toBe(404);
    expect(response['_body'].status).toBe('error');
    expect(response['_body'].message).toBe('Task does not exist.');
  });
});

describe('DELETE /api/task/:taskId', () => {
  test('delete a task with correct id', async () => {
    const response1 = await request(app).delete('/api/task/2');
    expect(response1.statusCode).toBe(204);

    const response2 = await request(app).get('/api/task/2');
    expect(response2.statusCode).toBe(404);
    expect(response2['_body'].status).toBe('error');
    expect(response2['_body'].message).toBe('Task does not exist.');
  });
});
