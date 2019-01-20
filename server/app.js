const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { handle400, handle404, handle422 } = require('./errors');

const app = express();

const api = require('./routes');

app.use(cors());
app.use(bodyParser.json());

app.use('/api', api);

app.use(handle400);
app.use(handle404);
app.use(handle422);

module.exports = app;
