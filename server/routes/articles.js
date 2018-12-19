const articles = require('express').Router();
const {
  getArticles,
  getArticle,
} = require('../controllers/articles');

articles.get('/', getArticles);
articles.get('/:article_id', getArticle);

module.exports = articles;
