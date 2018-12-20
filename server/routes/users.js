const users = require('express').Router();
const {
  getUsers,
  getUser,
} = require('../controllers/users');

const { handle405 } = require('../errors');

users.route('/')
  .get(getUsers)
  .all(handle405);

users.route('/:username')
  .get(getUser)
  .all(handle405);

module.exports = users;
