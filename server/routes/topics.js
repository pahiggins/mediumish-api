const topics = require('express').Router();
const {
  getTopics,
  addTopic,
  getArticlesByTopic,
} = require('../controllers/topics');

topics.get('/', getTopics);
topics.post('/', addTopic);
topics.get('/:topic/articles', getArticlesByTopic);

module.exports = topics;
