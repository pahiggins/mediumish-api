/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../server/app');

module.exports = () => {
  describe('/api/articles', () => {
    test('GET responds with an array of articles', async () => {
      const { status, body, type } = await request(app).get('/api/articles');
      expect(status).toEqual(200);
      expect(body).toHaveLength(10);
      expect(body[0]).toHaveProperty('comment_count', '13');
      expect(type).toEqual('application/json');
    });

    describe('/:article_id', () => {
      test('GET responds with an article object if valid and existing article_id', async () => {
        const { status, body } = await request(app).get('/api/articles/3');
        expect(status).toEqual(200);
        expect(body).toHaveProperty('article_id', 3);
        expect(body).toHaveProperty('author', 'icellusedkars');
        expect(body).toHaveProperty('title', 'Eight pug gifs that remind me of mitch');
        expect(body).toHaveProperty('votes', 0);
        expect(body).toHaveProperty('body', 'some gifs');
        expect(body).toHaveProperty('comment_count', '0');
        expect(body).toHaveProperty('topic', 'mitch');
      });

      test('GET responds with 404 if article_id does not exist', async () => {
        const { status, body } = await request(app).get('/api/articles/300');
        expect(status).toEqual(404);
        expect(body.msg).toEqual('article not found');
      });

      test('GET responds with 400 if article_id is not valid', async () => {
        const { status, body } = await request(app).get('/api/articles/text');
        expect(status).toEqual(400);
        expect(body.msg).toEqual('invalid input syntax for integer');
      });

      test('PATCH responds with status 200 and updated article object with increased votes', async () => {
        const { status, body } = await request(app).patch('/api/articles/1').send({ inc_votes: 2 });
        expect(status).toEqual(200);
        expect(body).toHaveProperty('article_id', 1);
        expect(body).toHaveProperty('votes', 102);
      });

      test('PATCH responds with status 200 and updated article object with decreased votes', async () => {
        const { status, body } = await request(app).patch('/api/articles/1').send({ inc_votes: -2 });
        expect(status).toEqual(200);
        expect(body).toHaveProperty('article_id', 1);
        expect(body).toHaveProperty('votes', 98);
      });

      test('DELETE responds with status 200 and empty article object', async () => {
        const { status, body } = await request(app).delete('/api/articles/1');
        expect(status).toEqual(200);
        expect(body).toEqual({});
      });

      describe('?limit', () => {
        test('GET responds with status 200 and array of articles for a topic using limit query', async () => {
          const { status, body } = await request(app).get('/api/articles?limit=3');
          expect(status).toEqual(200);
          expect(body).toHaveLength(3);
        });
      });

      describe('?sort_by', () => {
        test('GET responds with status 200 and array of articles for a topic using sort_by query', async () => {
          const { status, body } = await request(app).get('/api/articles?sort_by=article_id');
          expect(status).toEqual(200);
          expect(body[0]).toHaveProperty('article_id', 12);
        });
      });

      describe('?p', () => {
        test('GET responds with status 200 and array of articles for a topic using p query', async () => {
          const { status, body } = await request(app).get('/api/articles?p=1');
          expect(status).toEqual(200);
          expect(body).toHaveLength(2);
        });
      });

      describe('?sort_ascending', () => {
        test('GET responds with status 200 and array of articles for a topic using sort_ascending query', async () => {
          const { status, body } = await request(app).get('/api/articles?sort_ascending=true');
          expect(status).toEqual(200);
          expect(body[0]).toHaveProperty('article_id', 12);
        });
      });

      describe('?limit&&sort_by&&p&&sort_ascending', () => {
        test('GET responds with status 200 and array of articles for a topic using multiple queries', async () => {
          const { status, body } = await request(app).get('/api/articles?limit=3&&sort_by=article_id');
          expect(status).toEqual(200);
          expect(body).toHaveLength(3);
          expect(body[0]).toHaveProperty('title', 'Moustache');
        });
      });

      describe('/comments', () => {
        test('GET responds with status 200 and array of comments for article', async () => {
          const { status, body, type } = await request(app).get('/api/articles/1/comments');
          expect(status).toEqual(200);
          expect(body).toHaveLength(10);
          expect(body[0]).toHaveProperty('comment_id', 2);
          expect(type).toEqual('application/json');
        });

        test('POST responds with status 201 and added comment', async () => {
          const comment = { username: 'butter_bridge', body: 'Sample comment...' };
          const { status, body, type } = await request(app).post('/api/articles/1/comments').send(comment);
          expect(status).toEqual(201);
          expect(body).toHaveProperty('username', comment.username);
          expect(body).toHaveProperty('body', comment.body);
          expect(body).toHaveProperty('comment_id', 19);
          expect(type).toEqual('application/json');
        });

        describe('?limit', () => {
          test('GET responds with status 200 and array of comments for an article using limit query', async () => {
            const { status, body } = await request(app).get('/api/articles/1/comments?limit=3');
            expect(status).toEqual(200);
            expect(body).toHaveLength(3);
          });
        });

        describe('?sort_by', () => {
          test('GET responds with status 200 and array of comments for an article using sort_by query', async () => {
            const { status, body } = await request(app).get('/api/articles/1/comments?sort_by=comment_id');
            expect(status).toEqual(200);
            expect(body[0]).toHaveProperty('comment_id', 18);
          });
        });

        describe('?p', () => {
          test('GET responds with status 200 and array of comments for an article using p query', async () => {
            const { status, body } = await request(app).get('/api/articles/1/comments?p=1');
            expect(status).toEqual(200);
            expect(body).toHaveLength(3);
          });
        });

        describe('?sort_ascending', () => {
          test('GET responds with status 200 and array of comments for an article using sort_ascending query', async () => {
            const { status, body } = await request(app).get('/api/articles/1/comments?sort_ascending=true');
            expect(status).toEqual(200);
            expect(body[0]).toHaveProperty('comment_id', 18);
          });
        });

        describe('?limit&&sort_by&&p&&sort_ascending', () => {
          test('GET responds with status 200 and array of comments for an article using multiple queries', async () => {
            const { status, body } = await request(app).get('/api/articles?limit=3&&sort_by=article_id');
            expect(status).toEqual(200);
            expect(body).toHaveLength(3);
            expect(body[0]).toHaveProperty('title', 'Moustache');
          });
        });

        describe('/comment_id', () => {
          test('PATCH responds with status 200 and updated comment object with increased votes', async () => {
            const { status, body } = await request(app).patch('/api/articles/1/comments/3').send({ inc_votes: 2 });
            expect(status).toEqual(200);
            expect(body).toHaveProperty('comment_id', 3);
            expect(body).toHaveProperty('votes', 102);
          });

          test('PATCH responds with status 200 and updated comment object with decreased votes', async () => {
            const { status, body } = await request(app).patch('/api/articles/1/comments/3').send({ inc_votes: -2 });
            expect(status).toEqual(200);
            expect(body).toHaveProperty('comment_id', 3);
            expect(body).toHaveProperty('votes', 98);
          });

          test('DELETE responds with status 200 and empty comment object', async () => {
            const { status, body } = await request(app).delete('/api/articles/1/comments/3');
            expect(status).toEqual(200);
            expect(body).toEqual({});
          });
        });
      });
    });
  });
};
