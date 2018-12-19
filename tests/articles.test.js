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

      test('DELETE responds with status 200 and empty article object', async () => {
        const response = await request(app).delete('/api/articles/1');
        expect(response.status).toEqual(200);
        expect(response.body).toEqual({});
      });

      describe('/comments', () => {
        test('GET responds with status 200 and array of comments for article', async () => {
          const response = await request(app).get('/api/articles/1/comments');
          expect(response.status).toEqual(200);
          expect(response.body).toHaveLength(10);
          expect(response.body[0]).toHaveProperty('comment_id', 2);
          expect(response.type).toEqual('application/json');
        });

        test('POST responds with status 201 and added comment', async () => {
          const comment = { username: 'butter_bridge', body: 'Sample comment...' };
          const response = await request(app).post('/api/articles/1/comments').send(comment);
          expect(response.status).toEqual(201);
          expect(response.body).toHaveProperty('username', comment.username);
          expect(response.body).toHaveProperty('body', comment.body);
          expect(response.body).toHaveProperty('comment_id', 19);
          expect(response.type).toEqual('application/json');
        });

        describe('?limit', () => {
          test('GET responds with status 200 and array of comments for an article using limit query', async () => {
            const response = await request(app).get('/api/articles/1/comments?limit=3');
            expect(response.status).toEqual(200);
            expect(response.body).toHaveLength(3);
          });
        });

        describe('?sort_by', () => {
          test('GET responds with status 200 and array of comments for an article using sort_by query', async () => {
            const response = await request(app).get('/api/articles/1/comments?sort_by=comment_id');
            expect(response.status).toEqual(200);
            expect(response.body[0]).toHaveProperty('comment_id', 18);
          });
        });

        describe('?p', () => {
          test('GET responds with status 200 and array of comments for an article using p query', async () => {
            const response = await request(app).get('/api/articles/1/comments?p=1');
            expect(response.status).toEqual(200);
            expect(response.body).toHaveLength(3);
          });
        });

        describe('?sort_ascending', () => {
          test('GET responds with status 200 and array of comments for an article using sort_ascending query', async () => {
            const response = await request(app).get('/api/articles/1/comments?sort_ascending=true');
            expect(response.status).toEqual(200);
            expect(response.body[0]).toHaveProperty('comment_id', 18);
          });
        });

        describe('?limit&&sort_by&&p&&sort_ascending', () => {
          test('GET responds with status 200 and array of comments for an article using multiple queries', async () => {
            const response = await request(app).get('/api/articles?limit=3&&sort_by=article_id');
            expect(response.status).toEqual(200);
            expect(response.body).toHaveLength(3);
            expect(response.body[0]).toHaveProperty('title', 'Moustache');
          });
        });
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
