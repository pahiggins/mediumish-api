const log = require('loglevel');
const app = require('./app');

const port = process.env.NODE_ENV === 'production' ? process.env.PORT : 3000;

app.listen(port, () => {
  log.warn(`Server listening on port ${port}`);
});
