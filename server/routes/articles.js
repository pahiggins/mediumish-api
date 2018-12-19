const articles = require('express').Router();
const {
  getArticles,
  getArticle,
  updateArticle,
} = require('../controllers/articles');

articles.get('/', getArticles);
articles.get('/:article_id', getArticle);
articles.patch('/:article_id', updateArticle);

module.exports = articles;
