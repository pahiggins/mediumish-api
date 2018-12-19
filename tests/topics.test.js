/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../server/app');

module.exports = () => {
  describe('/api/topics', () => {
    test('GET responds with an array of topics', async () => {
      const { status, body, type } = await request(app).get('/api/topics');
      expect(status).toEqual(200);
      expect(body).toHaveLength(2);
      expect(body[0]).toHaveProperty('slug', 'mitch');
      expect(type).toEqual('application/json');
    });

    test('POST responds with the added topic if valid', async () => {
      const topic = { description: 'This is a description...', slug: 'comedy' };
      const { status, body, type } = await request(app).post('/api/topics').send(topic);
      expect(status).toEqual(201);
      expect(body).toHaveProperty('description', 'This is a description...');
      expect(body).toHaveProperty('slug', 'comedy');
      expect(type).toEqual('application/json');
    });

    test('POST responds with 400 if topic is invalid', async () => {
      const topic = { description: 'This is a description...' };
      const { status, body } = await request(app).post('/api/topics').send(topic);
      expect(status).toEqual(400);
      expect(body.msg).toEqual('slug is required');
    });

    describe('/:topic/articles', () => {
      test('GET responds with status 200 and array of articles for a topic', async () => {
        const { status, body } = await request(app).get('/api/topics/cats/articles');
        expect(status).toEqual(200);
        expect(body).toHaveLength(1);
        expect(body[0]).toHaveProperty('title', 'UNCOVERED: catspiracy to bring down democracy');
        expect(body[0]).toHaveProperty('comment_count', '2');
      });

      test('POST responds with status 201 and added article', async () => {
        const article = { title: 'Sample title...', body: 'Sample body...', username: 'butter_bridge' };
        const { status, body, type } = await request(app).post('/api/topics/cats/articles').send(article);
        expect(status).toEqual(201);
        expect(body[0]).toHaveProperty('title', 'Sample title...');
        expect(body[0]).toHaveProperty('body', 'Sample body...');
        expect(body[0]).toHaveProperty('username', 'butter_bridge');
        expect(type).toEqual('application/json');
      });

      describe('?limit', () => {
        test('GET responds with status 200 and array of articles for a topic using limit query', async () => {
          const { status, body } = await request(app).get('/api/topics/mitch/articles?limit=3');
          expect(status).toEqual(200);
          expect(body).toHaveLength(3);
        });
      });

      describe('?sort_by', () => {
        test('GET responds with status 200 and array of articles for a topic using sort_by query', async () => {
          const { status, body } = await request(app).get('/api/topics/mitch/articles?sort_by=article_id');
          expect(status).toEqual(200);
          expect(body[0]).toHaveProperty('article_id', 12);
        });
      });

      describe('?p', () => {
        test('GET responds with status 200 and array of articles for a topic using p query', async () => {
          const { status, body } = await request(app).get('/api/topics/mitch/articles?p=1');
          expect(status).toEqual(200);
          expect(body).toHaveLength(1);
        });
      });

      describe('?sort_ascending', () => {
        test('GET responds with status 200 and array of articles for a topic using sort_ascending query', async () => {
          const { status, body } = await request(app).get('/api/topics/mitch/articles?sort_ascending=true');
          expect(status).toEqual(200);
          expect(body[0]).toHaveProperty('article_id', 12);
        });
      });

      describe('?limit&&sort_by&&p&&sort_ascending', () => {
        test('GET responds with status 200 and array of articles for a topic using multiple queries', async () => {
          const { status, body } = await request(app).get('/api/topics/mitch/articles?limit=3&&sort_by=article_id');
          expect(status).toEqual(200);
          expect(body).toHaveLength(3);
          expect(body[0]).toHaveProperty('title', 'Moustache');
        });
      });
    });
  });
};
