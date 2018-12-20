const articles = require('express').Router();
const {
  getArticles,
  getArticle,
  updateArticle,
  deleteArticle,
  getComments,
  addComment,
  updateComment,
  deleteComment,
} = require('../controllers/articles');

const { handle405 } = require('../errors');

articles.route('/')
  .get(getArticles)
  .all(handle405);

articles.route('/:article_id')
  .get(getArticle)
  .patch(updateArticle)
  .delete(deleteArticle)
  .all(handle405);

articles.route('/:article_id/comments')
  .get(getComments)
  .post(addComment)
  .all(handle405);

articles.route('/:article_id/comments/:comment_id')
  .patch(updateComment)
  .delete(deleteComment)
  .all(handle405);

module.exports = articles;
