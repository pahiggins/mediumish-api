const articles = require('express').Router();
const {
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
  getCommentsByArticle,
  addCommentToArticle,
} = require('../controllers/articles');

articles.get('/', getArticles);

articles.route('/:article_id')
  .get(getArticle)
  .patch(updateArticle)
  .delete(deleteArticle);

articles.route('/:article_id/comments')
  .get(getCommentsByArticle)
  .post(addCommentToArticle);

module.exports = articles;
