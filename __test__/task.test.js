const request = require('supertest');

const app = require('../src/app.js');
jest.mock('../src/task/task.model.js');
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

describe('GET /api/task', () => {
  test('get all task', async () => {
    const response = await requestFunc('GET', '/api/task');

    expect(response.statusCode).toBe(200);
    expect(response['_body'].length).toBe(5);
  });
});

describe('GET /api/task/user/:userId', () => {
  test('can not get all task with non exist userId', async () => {
    const response1 = await requestFunc('GET', '/api/task/user/9');
    expect(response1.statusCode).toBe(404);
    expect(response1['_body'].status).toBe('error');
    expect(response1['_body'].message).toBe('User does not exist');

    const response2 = await requestFunc('GET', '/api/task/user/abc');
    expect(response2.statusCode).toBe(404);
    expect(response2['_body'].status).toBe('error');
    expect(response2['_body'].message).toBe('User does not exist');

    const response3 = await requestFunc('GET', '/api/task/user');
    expect(response3.statusCode).toBe(404);
    expect(response3['_body'].status).toBe('error');
    expect(response3['_body'].message).toBe('User does not exist');
  });

  test('get all task of one valid user', async () => {
    const response = await requestFunc('GET', '/api/task/user/1');

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
  test('can not get one task with wrong id', async () => {
    const response = await requestFunc('GET', '/api/task/9');

    expect(response.statusCode).toBe(404);
    expect(response['_body'].status).toBe('error');
    expect(response['_body'].message).toBe('Task does not exist.');
  });

  test('get one task with correct id', async () => {
    const response = await requestFunc('GET', '/api/task/1');

    expect(response.statusCode).toBe(200);
    expect(response['_body'].description).toBe('wash clothes');
    expect(response['_body'].isCompleted).toBe(false);
    expect(response['_body'].userId).toBe(1);
  });
});

describe('POST /api/task', () => {
  test('can not create task with non exist user', async () => {
    const response = await requestFunc('POST', '/api/task', {
      description: 'learn Finnish',
      isCompleted: false,
      userId: 9,
    });

    expect(response.statusCode).toBe(404);
    expect(response['_body'].status).toBe('error');
    expect(response['_body'].message).toBe('User does not exist');
  });

  test('cant not create one task without JSON type', async () => {
    const response = await requestFunc(
      'POST',
      '/api/task',
      `description: 'learn English', isCompleted: false, userId: 2,`
    );

    expect(response.statusCode).toBe(400);
    expect(response['_body'].status).toBe('error');
    expect(response['_body'].message).toBe('Request body must be of type json');
  });

  test('create one task with exist user', async () => {
    const response = await requestFunc('POST', '/api/task', {
      description: 'learn English',
      isCompleted: false,
      userId: 2,
    });

    expect(response.statusCode).toBe(200);
    expect(response['_body'].description).toBe('learn English');
    expect(response['_body'].isCompleted).toBe(false);
    expect(response['_body'].userId).toBe(2);
  });
});

describe('PUT /api/task/:taskId', () => {
  test('can not update task with non exist taskId', async () => {
    const response = await requestFunc('PUT', '/api/task/9', {
      description: 'learn programming',
      isCompleted: true,
    });

    expect(response.statusCode).toBe(404);
    expect(response['_body'].status).toBe('error');
    expect(response['_body'].message).toBe('Task does not exist.');
  });

  test('update task with exist taskId', async () => {
    const response = await requestFunc('PUT', '/api/task/2', {
      description: 'learn programming',
      isCompleted: true,
    });

    expect(response.statusCode).toBe(200);
    expect(response['_body'].description).toBe('learn programming');
    expect(response['_body'].isCompleted).toBe(true);
    expect(response['_body'].userId).toBe(1);
    expect(response['_body'].id).toBe(2);
  });
});

describe('DELETE /api/task/:taskId', () => {
  test('delete a task with correct id', async () => {
    const response1 = await requestFunc('DELETE', '/api/task/2');
    expect(response1.statusCode).toBe(204);

    const response2 = await requestFunc('GET', '/api/task/2');
    expect(response2.statusCode).toBe(404);
    expect(response2['_body'].status).toBe('error');
    expect(response2['_body'].message).toBe('Task does not exist.');
  });
});
