/* eslint-disable no-undef */
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../server/app');
const connection = require('../db/connection');

beforeEach(() => connection.migrate
  .rollback()
  .then(() => connection.migrate.latest())
  .then(() => connection.seed.run()));

afterAll(() => connection.destroy());

describe('/api/topics', () => {
  test('GET responds with status 200 and array of topics', async () => {
    const response = await request(app).get('/api/topics');
    expect(response.status).toEqual(200);
    expect(response.body).toHaveLength(2);
    expect(response.type).toEqual('application/json');
  });

  test('POST responds with status 201 and added topic', async () => {
    const topic = { description: 'This is a description...', slug: 'comedy' };
    const response = await request(app).post('/api/topics').send(topic);
    expect(response.status).toEqual(201);
    expect(response.body[0]).toHaveProperty('description', 'This is a description...');
    expect(response.body[0]).toHaveProperty('slug', 'comedy');
    expect(response.type).toEqual('application/json');
  });

  describe('/:topic/articles', () => {
    test('GET responds with status 200 and array of articles for a topic', async () => {
      const response = await request(app).get('/api/topics/cats/articles');
      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('title', 'UNCOVERED: catspiracy to bring down democracy');
      expect(response.body[0]).toHaveProperty('comment_count', '2');
    });
  });
});
