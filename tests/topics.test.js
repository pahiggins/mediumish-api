/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../server/app');

module.exports = () => {
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

      test('POST responds with status 201 and added article', async () => {
        const article = { title: 'Sample title...', body: 'Sample body...', username: 'butter_bridge' };
        const response = await request(app).post('/api/topics/cats/articles').send(article);
        expect(response.status).toEqual(201);
        expect(response.body[0]).toHaveProperty('title', 'Sample title...');
        expect(response.body[0]).toHaveProperty('body', 'Sample body...');
        expect(response.body[0]).toHaveProperty('username', 'butter_bridge');
        expect(response.type).toEqual('application/json');
      });

      describe('?limit', () => {
        test('GET responds with status 200 and array of articles for a topic using limit query', async () => {
          const response = await request(app).get('/api/topics/mitch/articles?limit=3');
          expect(response.status).toEqual(200);
          expect(response.body).toHaveLength(3);
        });
      });

      describe('?sort_by', () => {
        test('GET responds with status 200 and array of articles for a topic using sort_by query', async () => {
          const response = await request(app).get('/api/topics/mitch/articles?sort_by=article_id');
          expect(response.status).toEqual(200);
          expect(response.body[0]).toHaveProperty('article_id', 12);
        });
      });

      describe('?p', () => {
        test('GET responds with status 200 and array of articles for a topic using p query', async () => {
          const response = await request(app).get('/api/topics/mitch/articles?p=1');
          expect(response.status).toEqual(200);
          expect(response.body).toHaveLength(1);
        });
      });

      describe('?sort_ascending', () => {
        test('GET responds with status 200 and array of articles for a topic using sort_ascending query', async () => {
          const response = await request(app).get('/api/topics/mitch/articles?sort_ascending=true');
          expect(response.status).toEqual(200);
          expect(response.body[0]).toHaveProperty('article_id', 12);
        });
      });

      describe('?limit&&sort_by&&p&&sort_ascending', () => {
        test('GET responds with status 200 and array of articles for a topic using multiple queries', async () => {
          const response = await request(app).get('/api/topics/mitch/articles?limit=3&&sort_by=article_id');
          expect(response.status).toEqual(200);
          expect(response.body).toHaveLength(3);
          expect(response.body[0]).toHaveProperty('title', 'Moustache');
        });
      });
    });
  });
};
