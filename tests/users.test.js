/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../server/app');

module.exports = () => {
  describe('/api/users', () => {
    test('GET responds with status 200 and array of users', async () => {
      const { status, body, type } = await request(app).get('/api/users');
      expect(status).toEqual(200);
      expect(body).toHaveLength(3);
      expect(body[0]).toHaveProperty('username', 'butter_bridge');
      expect(type).toEqual('application/json');
    });

    describe('/:username', () => {
      test('GET responds with status 200 and user object', async () => {
        const { status, body, type } = await request(app).get('/api/users/butter_bridge');
        expect(status).toEqual(200);
        expect(body).toHaveProperty('username', 'butter_bridge');
        expect(body).toHaveProperty('name', 'jonny');
        expect(body).toHaveProperty('avatar_url', 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg');
        expect(type).toEqual('application/json');
      });
    });
  });
};
