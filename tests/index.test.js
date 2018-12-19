/* eslint-disable no-undef */
process.env.NODE_ENV = 'test';

const connection = require('../db/connection');

const articlesTests = require('./articles.test');
const topicsTests = require('./topics.test');
// const usersTests = require('./users.test');

beforeEach(() => connection.migrate.rollback()
  .then(() => connection.migrate.latest())
  .then(() => connection.seed.run()));

afterAll(() => connection.destroy());

describe('Topics', () => {
  topicsTests();
});

describe('Articles', () => {
  articlesTests();
});

// describe('Users', () => {
//   usersTests();
// });
