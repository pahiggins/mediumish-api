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

articles.get('/', getArticles);

articles.route('/:article_id')
  .get(getArticle)
  .patch(updateArticle)
  .delete(deleteArticle);

articles.route('/:article_id/comments')
  .get(getComments)
  .post(addComment);

articles.route('/:article_id/comments/:comment_id')
  .patch(updateComment)
  .delete(deleteComment);

module.exports = articles;
