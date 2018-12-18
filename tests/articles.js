// /* eslint-disable no-undef */
// process.env.NODE_ENV = 'test';

// const request = require('supertest');
// const app = require('../server/app');
// const connection = require('../db/connection');

// beforeEach(() => connection.migrate
//   .rollback()
//   .then(() => connection.migrate.latest())
//   .then(() => connection.seed.run()));

// afterAll(() => connection.destroy());

// describe('/api/articles', () => {
//   test('GET responds with status 200 and array of articles', async () => {
//     const response = await request(app).get('/api/articles');
//     expect(response.status).toEqual(200);
//     expect(response.body).toHaveLength(12);
//     expect(response.type).toEqual('application/json');
//   });
// });
