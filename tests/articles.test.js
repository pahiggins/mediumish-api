/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../server/app');

module.exports = () => {
  describe('/api/articles', () => {
    test('GET responds with status 200 and array of articles', async () => {
      const response = await request(app).get('/api/articles');
      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(10);
      expect(response.body[0]).toHaveProperty('comment_count', '13');
      expect(response.type).toEqual('application/json');
    });

    describe('/:article_id', () => {
      test('GET responds with status 200 and article object', async () => {
        const response = await request(app).get('/api/articles/3');
        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty('article_id', 3);
        expect(response.body).toHaveProperty('author', 'icellusedkars');
        expect(response.body).toHaveProperty('title', 'Eight pug gifs that remind me of mitch');
        expect(response.body).toHaveProperty('votes', 0);
        expect(response.body).toHaveProperty('body', 'some gifs');
        expect(response.body).toHaveProperty('comment_count', '0');
        expect(response.body).toHaveProperty('topic', 'mitch');
      });

      test('PATCH responds with status 200 and updated article object with increased votes', async () => {
        const response = await request(app).patch('/api/articles/1').send({ inc_votes: 2 });
        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty('article_id', 1);
        expect(response.body).toHaveProperty('votes', 102);
      });

      test('PATCH responds with status 200 and updated article object with decreased votes', async () => {
        const response = await request(app).patch('/api/articles/1').send({ inc_votes: -2 });
        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty('article_id', 1);
        expect(response.body).toHaveProperty('votes', 98);
      });

      xtest('DELETE responds with status 200 and empty article object', async () => {
        const response = await request(app).delete('/api/articles/1');
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({});
      });
    });

    describe('?limit', () => {
      test('GET responds with status 200 and array of articles for a topic using limit query', async () => {
        const response = await request(app).get('/api/articles?limit=3');
        expect(response.status).toEqual(200);
        expect(response.body).toHaveLength(3);
      });
    });

    describe('?sort_by', () => {
      test('GET responds with status 200 and array of articles for a topic using sort_by query', async () => {
        const response = await request(app).get('/api/articles?sort_by=article_id');
        expect(response.status).toEqual(200);
        expect(response.body[0]).toHaveProperty('article_id', 12);
      });
    });

    describe('?p', () => {
      test('GET responds with status 200 and array of articles for a topic using p query', async () => {
        const response = await request(app).get('/api/articles?p=1');
        expect(response.status).toEqual(200);
        expect(response.body).toHaveLength(2);
      });
    });

    describe('?sort_ascending', () => {
      test('GET responds with status 200 and array of articles for a topic using sort_ascending query', async () => {
        const response = await request(app).get('/api/articles?sort_ascending=true');
        expect(response.status).toEqual(200);
        expect(response.body[0]).toHaveProperty('article_id', 12);
      });
    });

    describe('?limit&&sort_by&&p&&sort_ascending', () => {
      test('GET responds with status 200 and array of articles for a topic using multiple queries', async () => {
        const response = await request(app).get('/api/articles?limit=3&&sort_by=article_id');
        expect(response.status).toEqual(200);
        expect(response.body).toHaveLength(3);
        expect(response.body[0]).toHaveProperty('title', 'Moustache');
      });
    });
  });
};
