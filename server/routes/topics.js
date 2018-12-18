const topics = require('express').Router();
const {
  getTopics,
  addTopic,
  getArticlesByTopic,
  addArticleByTopic,
} = require('../controllers/topics');

topics.get('/', getTopics);
topics.post('/', addTopic);
topics.get('/:topic/articles', getArticlesByTopic);
topics.post('/:topic/articles', addArticleByTopic);

module.exports = topics;
