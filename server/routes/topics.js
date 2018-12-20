const topics = require('express').Router();
const {
  getTopics,
  addTopic,
  getArticlesByTopic,
  addArticleByTopic,
} = require('../controllers/topics');
const { handle405 } = require('../errors');

topics.route('/')
  .get(getTopics)
  .post(addTopic)
  .all(handle405);
topics.get('/:topic/articles', getArticlesByTopic);
topics.post('/:topic/articles', addArticleByTopic);

module.exports = topics;
