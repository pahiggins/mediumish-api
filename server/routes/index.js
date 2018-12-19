const api = require('express').Router();
const topics = require('./topics');
const articles = require('./articles');

api.use('/topics', topics);
api.use('/articles', articles);

module.exports = api;
