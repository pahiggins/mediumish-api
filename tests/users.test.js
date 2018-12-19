/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../server/app');

module.exports = () => {
  describe('/api/users', () => {
    test('GET responds with status 200 and array of users', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(3);
      expect(response.body[0]).toHaveProperty('username', 'butter_bridge');
      expect(response.type).toEqual('application/json');
    });

    describe('/:username', () => {
      test('GET responds with status 200 and user object', async () => {
        const response = await request(app).get('/api/users/butter_bridge');
        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty('username', 'butter_bridge');
        expect(response.body).toHaveProperty('name', 'jonny');
        expect(response.body).toHaveProperty('avatar_url', 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg');
        expect(response.type).toEqual('application/json');
      });
    });
  });
};
