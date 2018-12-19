const articles = require('express').Router();
const {
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
  getCommentsByArticle,
} = require('../controllers/articles');

articles.get('/', getArticles);

articles.route('/:article_id')
  .get(getArticle)
  .patch(updateArticle)
  .delete(deleteArticle);

articles.get('/:article_id/comments', getCommentsByArticle);

module.exports = articles;
