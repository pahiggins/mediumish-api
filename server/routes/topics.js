const topics = require('express').Router();
const {
  getTopics,
  addTopic,
  getArticles,
  addArticle,
} = require('../controllers/topics');
const { handle405 } = require('../errors');

topics.route('/')
  .get(getTopics)
  .post(addTopic)
  .all(handle405);

topics.route('/:topic/articles')
  .get(getArticles);
// .all(handle405);

topics.route('/:topic/articles')
  .post(addArticle);
// .all(handle405);

module.exports = topics;
