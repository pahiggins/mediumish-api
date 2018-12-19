const express = require('express');
const bodyParser = require('body-parser');
const getApiDesc = require('./utilities');
const { handle404, handle400 } = require('./errors');

const app = express();

const api = require('./routes');

app.use(bodyParser.json());

app.use('/api', api);

app.use('/', getApiDesc);

app.use(handle404);
app.use(handle400);

app.use('*', () => {
  console.log('End of the line!');
});

module.exports = app;
