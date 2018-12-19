const articles = require('express').Router();
const {
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
} = require('../controllers/articles');

articles.get('/', getArticles);
articles.route('/:article_id')
  .get(getArticle)
  .patch(updateArticle)
  .delete(deleteArticle);

module.exports = articles;
