const express = require('express');
const bodyParser = require('body-parser');
const getApiDesc = require('./utilities');

const app = express();

const api = require('./routes');

app.use(bodyParser.json());

app.use('/api', api);

app.use('/', getApiDesc);

module.exports = app;
