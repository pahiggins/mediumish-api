const articles = require('express').Router();
const {
  getArticles,
} = require('../controllers/articles');

articles.get('/', getArticles);

module.exports = articles;
