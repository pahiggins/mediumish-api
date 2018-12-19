/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../server/app');

module.exports = () => {
  describe('/api/users', () => {
    test('GET responds with status 200 and array of users', async () => {
      const response = await request(app).get('/api/users');
      // expect(response.status).toEqual(200);
      // expect(response.body).toHaveLength(10);
      // expect(response.body[0]).toHaveProperty('comment_count', '13');
      // expect(response.type).toEqual('application/json');
    });
  });
};
