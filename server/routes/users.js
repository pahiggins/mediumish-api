const users = require('express').Router();
const {
  getUsers,
  getUser,
} = require('../controllers/users');

users.get('/', getUsers);
users.get('/:username', getUser);

module.exports = users;
