const fs = require('fs');

module.exports = (req, res, next) => {
  fs.readFile('./server/apiDesc.json', (err, data) => {
    if (err) throw err;

    res.status(200).send(JSON.parse(data));
  });
};
