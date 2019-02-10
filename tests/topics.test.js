/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../server/app');

module.exports = () => {
  describe('/api/topics', () => {
    test('GET responds with an array of topics', async () => {
      const { status, body, type } = await request(app).get('/api/topics');
      expect(status).toEqual(200);
      expect(body.topics).toHaveLength(2);
      expect(body.topics[0]).toHaveProperty('slug', 'mitch');
      expect(type).toEqual('application/json');
    });

    test('GET responds with 405 for invalid methods', async () => {
      const { status, body } = await request(app).delete('/api/topics');
      expect(status).toEqual(405);
      expect(body.msg).toEqual('method not allowed');
    });

    test('POST responds with the added topic if valid', async () => {
      const topic = { description: 'This is a description...', slug: 'comedy' };
      const { status, body, type } = await request(app).post('/api/topics').send(topic);
      expect(status).toEqual(201);
      expect(body.topic).toHaveProperty('description', 'This is a description...');
      expect(body.topic).toHaveProperty('slug', 'comedy');
      expect(type).toEqual('application/json');
    });

    test('POST responds with 400 if topic is missing description', async () => {
      const topic = { slug: 'comedy' };
      const { status, body } = await request(app).post('/api/topics').send(topic);
      expect(status).toEqual(400);
      expect(body.msg).toEqual('description is required');
    });

    test('POST responds with 400 if topic is missing slug', async () => {
      const topic = { description: 'This is a description...' };
      const { status, body } = await request(app).post('/api/topics').send(topic);
      expect(status).toEqual(400);
      expect(body.msg).toEqual('slug is required');
    });

    test('POST responds with 422 if topic already exists', async () => {
      const topic = { description: 'This is a description...', slug: 'mitch' };
      const { status, body } = await request(app).post('/api/topics').send(topic);
      expect(status).toEqual(422);
      expect(body.msg).toEqual('duplicate key value violates unique constraint');
    });

    describe('/:topic/articles', () => {
      test('GET responds with an array of articles for an existing topic', async () => {
        const { status, body } = await request(app).get('/api/topics/cats/articles');
        expect(status).toEqual(200);
        expect(body.articles).toHaveLength(1);
        expect(body.articles[0]).toHaveProperty('title', 'UNCOVERED: catspiracy to bring down democracy');
        expect(body.articles[0]).toHaveProperty('comment_count', '2');
      });

      test('GET responds with 404 if topic does not exist', async () => {
        const { status, body } = await request(app).get('/api/topics/invalidTopic/articles');
        expect(status).toEqual(404);
        expect(body.msg).toEqual('article not found');
      });

      test('POST responds with the added article if valid', async () => {
        const article = { title: 'Sample title...', body: 'Sample body...', username: 'butter_bridge' };
        const { status, body, type } = await request(app).post('/api/topics/cats/articles').send(article);
        expect(status).toEqual(201);
        expect(body.article).toHaveProperty('title', 'Sample title...');
        expect(body.article).toHaveProperty('body', 'Sample body...');
        expect(body.article).toHaveProperty('username', 'butter_bridge');
        expect(type).toEqual('application/json');
      });

      test('POST responds with 400 if article is missing title', async () => {
        const article = { body: 'This is a body...', username: 'butter_bridge' };
        const { status, body } = await request(app).post('/api/topics/cats/articles').send(article);
        expect(status).toEqual(400);
        expect(body.msg).toEqual('title is required');
      });

      test('POST responds with 400 if article is missing body', async () => {
        const article = { title: 'Sample title...', username: 'butter_bridge' };
        const { status, body } = await request(app).post('/api/topics/cats/articles').send(article);
        expect(status).toEqual(400);
        expect(body.msg).toEqual('body is required');
      });

      test('POST responds with 400 if article is missing username', async () => {
        const article = { title: 'Sample title...', body: 'This is a body...' };
        const { status, body } = await request(app).post('/api/topics/cats/articles').send(article);
        expect(status).toEqual(400);
        expect(body.msg).toEqual('username is required');
      });

      test('POST responds with 404 if username does not exist', async () => {
        const article = { title: 'Sample title...', body: 'Sample body...', username: 'unknown' };
        const { status, body } = await request(app).post('/api/topics/cats/articles').send(article);
        expect(status).toEqual(404);
        expect(body.msg).toEqual('invalid input syntax');
      });

      test('POST responds with 404 if topic does not exist', async () => {
        const article = { title: 'Sample title...', body: 'Sample body...', username: 'butter_bridge' };
        const { status, body } = await request(app).post('/api/topics/unknown/articles').send(article);
        expect(status).toEqual(404);
        expect(body.msg).toEqual('invalid input syntax');
      });

      describe('?limit', () => {
        test('GET responds with array of articles for a topic using limit query', async () => {
          const { status, body } = await request(app).get('/api/topics/mitch/articles?limit=4');
          expect(status).toEqual(200);
          expect(body.articles).toHaveLength(4);
        });

        test('GET responds with array of all articles for a topic using invalid limit query', async () => {
          const { status, body } = await request(app).get('/api/topics/mitch/articles?limit=text');
          console.log(body);
          expect(status).toEqual(200);
          expect(body.articles).toHaveLength(11);
        });
      });

      describe('?sort_by', () => {
        test('GET responds with array of articles for a topic using sort_by query', async () => {
          const { status, body } = await request(app).get('/api/topics/mitch/articles?sort_by=article_id');
          expect(status).toEqual(200);
          expect(body.articles[0]).toHaveProperty('article_id', 12);
        });

        test('GET responds with 400 for a topic using invalid sort_by query', async () => {
          const { status, body } = await request(app).get('/api/topics/mitch/articles?sort_by=invalid');
          expect(status).toEqual(400);
          expect(body.msg).toEqual('column does not exist in table');
        });
      });

      describe('?p', () => {
        test('GET responds with array of articles for a topic using p query', async () => {
          const { status, body } = await request(app).get('/api/topics/mitch/articles?p=2');
          expect(status).toEqual(200);
          expect(body.articles).toHaveLength(1);
        });

        test('GET responds with array of all articles for a topic using invalid p query', async () => {
          const { status, body } = await request(app).get('/api/topics/mitch/articles?p=text');
          expect(status).toEqual(200);
          expect(body.articles).toHaveLength(10);
        });

        test('GET responds with 404 for a topic using unavailable p query', async () => {
          const { status, body } = await request(app).get('/api/topics/mitch/articles?p=10');
          expect(status).toEqual(404);
          expect(body.msg).toEqual('article not found');
        });
      });

      describe('?sort_ascending', () => {
        test('GET responds with array of articles for a topic using sort_ascending query', async () => {
          const { status, body } = await request(app).get('/api/topics/mitch/articles?sort_ascending=true');
          expect(status).toEqual(200);
          expect(body.articles[0]).toHaveProperty('article_id', 12);
        });

        test('GET responds with array of all articles for a topic using invalid sort_ascending query', async () => {
          const { status, body } = await request(app).get('/api/topics/mitch/articles?sort_ascending=text');
          expect(status).toEqual(200);
          expect(body.articles).toHaveLength(10);
        });
      });

      describe('?limit&&sort_by&&p&&sort_ascending', () => {
        test('GET responds with array of articles for a topic using multiple queries', async () => {
          const { status, body } = await request(app).get('/api/topics/mitch/articles?limit=3&&sort_by=article_id');
          expect(status).toEqual(200);
          expect(body.articles).toHaveLength(3);
          expect(body.articles[0]).toHaveProperty('title', 'Moustache');
        });
      });
    });
  });
};
