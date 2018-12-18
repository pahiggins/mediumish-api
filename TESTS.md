## Using Separate Test Files

The following steps will enable you to separate your tests into multiple files, with a view to better mirroring your controllers folder structure:

1. In your 'package.json' file set your test script to the following:

mocha spec/index.spec.js

2. In your 'spec' folder create the following file:

index.spec.js

3. Add the following contents to this file:

--- begin content ---

process.env.NODE_ENV = 'test';

const connection = require('../db/connection');
const articlesTests = require('./articles.spec');
const topicsTests = require('./topics.spec');

beforeEach(() => connection.migrate.rollback()
  .then(() => connection.migrate.latest())
  .then(() => connection.seed.run()));

afterAll(() => connection.destroy());

articlesTests();
topicsTests();

--- end content ---

4. In the respective 'articles.spec.js' and 'topics.spec.js' files (NB. these are just examples) you need to wrap your tests (i.e. the outer describe block) in an anonymous function and export this, e.g. this is a sample 'articles.spec.js' file:

--- begin content ---

const request = require('supertest');
const app = require('../server/app');

module.exports = () => {
  describe('/api/articles', () => {
    it('GET responds with status 200 and array of articles', async () => {
      const response = await request(app).get('/api/articles');
      expect(response.status).toEqual(200);
      expect(response.body).toHaveLength(10);
      expect(response.body[0]).toHaveProperty('comment_count', '13');
      expect(response.type).toEqual('application/json');
    });
  });
};

--- end content ---

5. If you revisit item 3 above, you'll see that the anonymous function exported from 'articles.spec.js' (item 4) is named 'articlesTests' when imported in 'index.spec.js'. It is then invoked after the database has been teared down / setup. Using this config you can have separate test files to help mitigate complexity as the number of tests grows.

Just remember that you'll need to do the following for each test file that you add:

- Wrap tests in an anoymous function.
- Export this function.
- Import this function in 'index.spec.js'.
- Name the function upon import and add it to the list of invokations.