const knex = require('knex');

const ENV = process.env.NODE_ENV || 'development';

const dbConfig = require('../knexfile.js')[ENV];

const connection = knex(dbConfig);

module.exports = connection;
