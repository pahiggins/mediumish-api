/* eslint-disable consistent-return */
const connection = require('../../db/connection');

exports.getUsers = (req, res, next) => connection('users')
  .select('*')
  .then(allUsers => res.status(200).send(allUsers))
  .catch(next);

exports.getUser = (req, res, next) => {
  const { username } = req.params;

  return connection('users')
    .where('username', '=', username)
    .then(([matchingUser]) => {
      if (!matchingUser) return Promise.reject({ status: 404, msg: 'user not found' });
      res.status(200).send(matchingUser);
    })
    .catch(next);
};
