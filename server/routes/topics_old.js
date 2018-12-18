const { getTopics, addTopic } = require('../controllers/topics');

const GET = () => getTopics();

const POST = req => addTopic(req);

const DELETE = (req) => { };

const PATCH = (req) => { };

module.exports = {
  GET,
  POST,
  DELETE,
  PATCH,
};
