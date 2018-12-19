const api = require('express').Router();
const topics = require('./topics');
const articles = require('./articles');
const users = require('./users');

api.use('/topics', topics);
api.use('/articles', articles);
api.use('/users', users);

module.exports = api;
